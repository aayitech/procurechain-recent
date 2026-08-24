export type LeadSource =
  | 'NEWSLETTER'
  | 'DEMO_REQUEST'
  | 'CALCULATOR_DOWNLOAD'
  | 'BENCHMARK_ASSESSMENT'
  | 'ASSESSMENT'
  | 'GENERAL';

export interface CreateLeadInput {
  firstName: string;
  lastName?: string;
  email: string;
  company?: string;
  phone?: string;
  country?: string;
  industry?: string;
  role?: string;
  annualSpendBand?: string;
  categoriesOfInterest?: string[];
  preferredLanguage?: string;
  newsletterOptIn?: boolean;
  source: LeadSource;
  sourceDetail?: string;
  customFields?: Record<string, string | number | boolean>;
  sessionId?: string;
}

export interface CreateLeadResponse {
  id: string;
  status: 'NEW' | 'SYNCED' | 'SYNC_FAILED';
}
