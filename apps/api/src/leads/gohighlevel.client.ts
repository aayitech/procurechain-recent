import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Lead } from '@prisma/client';

const GHL_CONTACTS_ENDPOINT = 'https://services.leadconnectorhq.com/contacts/';

export interface GhlSyncResult {
  synced: boolean;
  reason?: string;
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

  private extraCustomFields(raw: unknown): Array<{ key: string; value: string }> {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return [];
    return Object.entries(raw as Record<string, unknown>).map(([key, value]) => ({ key, value: String(value) }));
  }
}
