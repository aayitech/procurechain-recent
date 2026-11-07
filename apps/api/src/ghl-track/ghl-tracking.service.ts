import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GhlProfile {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  company?: string | null;
  country?: string | null;
  city?: string | null;
  website?: string | null;
  jobTitle?: string | null;
  industry?: string | null;
  currency?: string | null;
  procurementCategories?: string[] | null;
  commodities?: string[] | null;
  purchaseMix?: string | null;
  sourcingCountries?: string[] | null;
  tradeLanes?: string[] | null;
  procurementChallenges?: string[] | null;
  newsletterOptIn?: boolean | null;
}

const FIELD_IDS = {
  status: 'FTgvtleYsKkvBY82KDgr', band: 'RwKyBStLVzUI1R3UhMHP', area: 'sLvGFboICx6uHEIyKtYR',
  tool: '6ffkrWfUJpTBamFw11Df', utm_source: 'a2tt6FU9HK8vvWmXRYIp',
  utm_medium: 'gorXK7yRmz2a8eBkzNzL', utm_campaign: 'um8bvbd3WgRRNTKz8NIS',
  jobTitle: 'EQs8CKUmaZASDb014lDD', industry: '84MF33xfcsuEgllI4mLN', currency: '9AjCvbrHzBTmZ55Glarf',
  procurementCategories: '7Rm78oFXvlubjQIBv4gn', commodities: 'fA29wBwL2mSm6dDNmNAd',
  purchaseMix: 'dm6p4Zk732yd0INVNZMi', sourcingCountries: '2zKw3fwdfLW48qpLA3cG',
  tradeLanes: 'Oxk679SUiFzVw0nGeXWO', procurementChallenges: 'Qd0XaT0q53yKM9MJjJj2',
  newsletterOptIn: 'RkjltErwFnIIOdtrMHAJ',
  productInterest: 'ZYGIUEmfWScV9hdHV0vi', campaignFit: 'TPm8CXAL5faycLhkxf1I',
  campaignEntryAsset: '8f3HADSHCUHyMHkrL9UY', consentDate: '1L3KnrPJ2V1Qf6OLkAFe',
} as const;

const CURRENCY_LABELS: Record<string, string> = { USD: '$ USD', EUR: '€ EUR', GBP: '£ GBP', ZAR: 'R ZAR', CNY: '¥ CNY' };
const COUNTRY_CODES: Record<string, string> = {
  southafrica: 'ZA', nigeria: 'NG', kenya: 'KE', egypt: 'EG', ghana: 'GH', china: 'CN',
  'unitedstates': 'US', 'unitedkingdom': 'GB', 'unitedarabemirates': 'AE',
};

@Injectable()
export class GhlTrackingService {
  private readonly logger = new Logger(GhlTrackingService.name);
  constructor(private readonly config: ConfigService) {}

  async upsert(profile: GhlProfile, fields: Array<{ id: string; field_value: string }>, tags: string[]): Promise<boolean> {
    const token = this.config.get<string>('GHL_TOKEN');
    const locationId = this.config.get<string>('GHL_LOCATION_ID');
    if (!token || !locationId) { this.logger.warn('GHL tracking is not configured'); return false; }
    const headers = { Authorization: `Bearer ${token}`, Version: '2021-07-28', 'Content-Type': 'application/json' };
    const body = { locationId, email: profile.email, ...this.nonEmpty('firstName', profile.firstName), ...this.nonEmpty('lastName', profile.lastName), ...this.nonEmpty('phone', this.phoneForGhl(profile.phone, profile.country)), ...this.nonEmpty('companyName', profile.company), ...this.nonEmpty('country', this.countryCode(profile.country)), ...this.nonEmpty('city', profile.city), ...this.nonEmpty('website', profile.website), source: 'procurechain.online', customFields: [...fields, ...this.profileCustomFields(profile)] };
    try {
      const response = await fetch('https://services.leadconnectorhq.com/contacts/upsert', { method: 'POST', headers, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`Contact upsert returned ${response.status}`);
      const result = await response.json() as { contact?: { id?: string; new?: boolean; created?: boolean }; id?: string; new?: boolean };
      const id = result.contact?.id ?? result.id;
      if (!id) throw new Error('Contact upsert response did not contain a contact id');
      const tagged = await fetch(`https://services.leadconnectorhq.com/contacts/${encodeURIComponent(id)}/tags`, { method: 'POST', headers, body: JSON.stringify({ tags: [...new Set(tags)] }) });
      if (!tagged.ok) throw new Error(`Contact tagging returned ${tagged.status}`);
      return Boolean(result.contact?.new ?? result.contact?.created ?? result.new);
    } catch (error) { this.logger.error('GHL tracking failed', error instanceof Error ? error.stack : String(error)); return false; }
  }

  async send(profile: GhlProfile, fields: Array<{ id: string; field_value: string }>, tags: string[]): Promise<void> {
    await this.upsert(profile, fields, [...tags, ...(profile.newsletterOptIn ? ['newsletter_subscriber'] : [])]);
  }

  private profileCustomFields(profile: GhlProfile): Array<{ id: string; field_value: string }> {
    const fields: Array<{ id: string; field_value: string }> = [];
    this.add(fields, FIELD_IDS.jobTitle, profile.jobTitle);
    this.add(fields, FIELD_IDS.industry, profile.industry);
    const currency = profile.currency ? CURRENCY_LABELS[profile.currency] : undefined;
    this.add(fields, FIELD_IDS.currency, currency);
    this.add(fields, FIELD_IDS.procurementCategories, this.joinList(profile.procurementCategories));
    this.add(fields, FIELD_IDS.commodities, this.joinList(profile.commodities));
    this.add(fields, FIELD_IDS.purchaseMix, profile.purchaseMix);
    this.add(fields, FIELD_IDS.sourcingCountries, this.joinList(profile.sourcingCountries));
    this.add(fields, FIELD_IDS.tradeLanes, this.joinList(profile.tradeLanes));
    this.add(fields, FIELD_IDS.procurementChallenges, this.joinList(profile.procurementChallenges));
    if (profile.newsletterOptIn !== undefined && profile.newsletterOptIn !== null) {
      this.add(fields, FIELD_IDS.newsletterOptIn, profile.newsletterOptIn ? 'Opted In' : 'Not Opted In');
    }
    return fields;
  }

  private joinList(values?: string[] | null): string | undefined {
    const joined = values?.map((item) => item.trim()).filter(Boolean).join(', ');
    return joined || undefined;
  }

  private add(fields: Array<{ id: string; field_value: string }>, id: string, value?: string | null) {
    const trimmed = value?.trim();
    if (trimmed) fields.push({ id, field_value: trimmed });
  }

  private nonEmpty(key: string, value?: string | null): Record<string, string> {
    const trimmed = value?.trim();
    return trimmed ? { [key]: trimmed } : {};
  }

  private e164(value?: string | null): string | undefined {
    const phone = value?.trim();
    return phone && /^\+[1-9]\d{7,14}$/.test(phone) ? phone : undefined;
  }

  private phoneForGhl(value?: string | null, country?: string | null): string | undefined {
    const phone = value?.trim();
    if (!phone) return undefined;
    const normalizedCountry = this.countryCode(country);
    if (normalizedCountry === 'ZA' && /^0/.test(phone)) {
      const digits = phone.replace(/\D/g, '');
      const converted = `+27${digits.slice(1)}`;
      return /^\+[1-9]\d{7,14}$/.test(converted) ? converted : undefined;
    }
    return this.e164(phone);
  }

  private countryCode(value?: string | null): string | undefined {
    const country = value?.trim();
    if (!country) return undefined;
    if (/^[a-z]{2}$/i.test(country)) return country.toUpperCase();
    return COUNTRY_CODES[country.toLowerCase().replace(/[^a-z]/g, '')];
  }
}
