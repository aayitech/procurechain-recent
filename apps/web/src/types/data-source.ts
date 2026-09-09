export interface DataSourceRegistryEntry {
  sourceId: string;
  sourceName: string;
  domain: string;
  dataType: string[];
  country: string | null;
  region: string;
  apiAvailable: boolean;
  apiEndpoint: string | null;
  apiKeyRequired: boolean;
  updateFrequency: string;
  historicalData: boolean;
  commercialUse: 'approved' | 'terms_review_required';
  redistributionAllowed: 'approved' | 'terms_review_required';
  attributionRequired: boolean;
  licence: string;
  status: 'active' | 'configuration_required' | 'planned';
}
