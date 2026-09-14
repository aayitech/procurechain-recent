import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Lead } from '@prisma/client';

const GHL_CONTACTS_ENDPOINT = 'https://services.leadconnectorhq.com/contacts/';

export interface GhlSyncResult {
  synced: boolean;
  reason?: string;
}

export interface GhlContactProfile {
  firstName?: string;
  lastName?: string;
  company?: string;
  country?: string;
  industry?: string;
  jobTitle?: string;
}

interface GhlCustomFieldValue {
  id?: string;
  key?: string;
  fieldKey?: string;
  value?: unknown;
  fieldValue?: unknown;
}

interface GhlContact {
  email?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  country?: string;
  jobTitle?: string;
  customFields?: GhlCustomFieldValue[];
}

interface GhlCustomFieldDefinition {
  id?: string;
  name?: string;
  fieldKey?: string;
}

/**
 * Thin client around the GoHighLevel "upsert contact" API.
 * Until GOHIGHLEVEL_API_KEY / GOHIGHLEVEL_LOCATION_ID are supplied this
 * intentionally no-ops rather than failing the request — leads are never
 * lost, they just wait in Postgres for the sync worker to catch up once
 * credentials exist.
 */
@Injectable()
export class GoHighLevelClient {
  private readonly logger = new Logger(GoHighLevelClient.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('GOHIGHLEVEL_API_KEY') && this.config.get<string>('GOHIGHLEVEL_LOCATION_ID'));
  }

  async upsertContact(lead: Lead): Promise<GhlSyncResult> {
    if (!this.isConfigured()) {
      return { synced: false, reason: 'GoHighLevel credentials not configured' };
    }

    const apiKey = this.config.get<string>('GOHIGHLEVEL_API_KEY');
    const locationId = this.config.get<string>('GOHIGHLEVEL_LOCATION_ID');

    try {
      const response = await fetch(GHL_CONTACTS_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Version: '2021-07-28',
        },
        body: JSON.stringify({
          locationId,
          firstName: lead.firstName,
          lastName: lead.lastName ?? undefined,
          email: lead.email,
          phone: lead.phone ?? undefined,
          companyName: lead.company ?? undefined,
          source: lead.source,
          tags: lead.categoriesOfInterest,
          customFields: [
            { key: 'industry', value: lead.industry ?? '' },
            { key: 'role', value: lead.role ?? '' },
            { key: 'annual_spend_band', value: lead.annualSpendBand ?? '' },
            { key: 'newsletter_opt_in', value: String(lead.newsletterOptIn) },
            ...this.extraCustomFields(lead.customFields),
          ],
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        this.logger.warn(`GoHighLevel sync failed for lead ${lead.id}: ${response.status} ${body}`);
        return { synced: false, reason: `GoHighLevel API error ${response.status}` };
      }

      return { synced: true };
    } catch (error) {
      this.logger.error(`GoHighLevel sync threw for lead ${lead.id}`, error as Error);
      return { synced: false, reason: (error as Error).message };
    }
  }

  async getContactProfileByEmail(email: string): Promise<GhlContactProfile | null> {
    if (!this.isConfigured()) return null;

    const apiKey = this.config.get<string>('GOHIGHLEVEL_API_KEY')!;
    const locationId = this.config.get<string>('GOHIGHLEVEL_LOCATION_ID')!;
    const query = new URLSearchParams({ locationId, email: email.trim().toLowerCase() });

    const response = await fetch(
      `https://services.leadconnectorhq.com/contacts/search/duplicate?${query.toString()}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
          Version: '2023-02-21',
        },
      },
    );

    if (!response.ok) {
      const body = await response.text();
      this.logger.warn(`GoHighLevel contact lookup failed: ${response.status} ${body}`);
      throw new Error(`GoHighLevel contact lookup failed (${response.status})`);
    }

    const payload = (await response.json()) as { contact?: GhlContact };
    const contact = payload.contact;
    if (!contact) return null;

    const definitions = await this.getContactFieldDefinitions(apiKey, locationId);
    const customValues = this.customFieldValues(contact.customFields, definitions);

    return {
      firstName: this.clean(contact.firstName),
      lastName: this.clean(contact.lastName),
      company: this.clean(contact.companyName),
      country: this.clean(contact.country),
      industry: this.findCustomValue(customValues, ['contact.industry_1', 'contact.industry'], ['industry']),
      jobTitle:
        this.clean(contact.jobTitle) ??
        this.findCustomValue(customValues, ['contact.job_title', 'contact.jobtitle'], ['job title', 'jobtitle']),
    };
  }

  private async getContactFieldDefinitions(
    apiKey: string,
    locationId: string,
  ): Promise<GhlCustomFieldDefinition[]> {
    const response = await fetch(
      `https://services.leadconnectorhq.com/locations/${encodeURIComponent(locationId)}/customFields?model=contact`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
          Version: '2023-02-21',
        },
      },
    );

    if (!response.ok) {
      this.logger.warn(`Unable to read GoHighLevel custom-field definitions (${response.status})`);
      return [];
    }

    const payload = (await response.json()) as { customFields?: GhlCustomFieldDefinition[] };
    return payload.customFields ?? [];
  }

  private customFieldValues(
    values: GhlCustomFieldValue[] | undefined,
    definitions: GhlCustomFieldDefinition[],
  ): Array<{ key: string; name: string; value: string }> {
    const definitionsById = new Map(
      definitions.filter((field) => field.id).map((field) => [field.id!, field]),
    );

    return (values ?? []).flatMap((field) => {
      const definition = field.id ? definitionsById.get(field.id) : undefined;
      const value = this.clean(field.fieldValue ?? field.value);
      if (!value) return [];
      return [{
        key: (field.key ?? field.fieldKey ?? definition?.fieldKey ?? '').toLowerCase(),
        name: (definition?.name ?? '').toLowerCase(),
        value,
      }];
    });
  }

  private findCustomValue(
    values: Array<{ key: string; name: string; value: string }>,
    keys: string[],
    names: string[],
  ): string | undefined {
    const normalizedKeys = keys.map((key) => key.toLowerCase());
    const normalizedNames = names.map((name) => name.toLowerCase());
    return values.find(
      (field) =>
        normalizedKeys.includes(field.key) ||
        normalizedNames.some((name) => field.name === name || field.name.startsWith(`${name} `)),
    )?.value;
  }

  private clean(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    const cleaned = value.trim();
    return cleaned || undefined;
  }

  private extraCustomFields(raw: unknown): Array<{ key: string; value: string }> {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return [];
    return Object.entries(raw as Record<string, unknown>).map(([key, value]) => ({ key, value: String(value) }));
  }
}
