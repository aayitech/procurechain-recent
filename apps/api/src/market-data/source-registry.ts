export type SourceAvailability = 'active' | 'configuration_required' | 'planned';
export type LicenceReview = 'approved' | 'terms_review_required';

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
  commercialUse: LicenceReview;
  redistributionAllowed: LicenceReview;
  attributionRequired: boolean;
  licence: string;
  status: SourceAvailability;
  lastSuccessfulFetch: string | null;
  lastFailedFetch: string | null;
  lastDataTimestamp: string | null;
}

export const SOURCE_NAMES = {
  worldBank: 'World Bank Commodity Markets (Pink Sheet)',
  imf: 'IMF World Economic Outlook (DataMapper API)',
  fred: 'FRED (Federal Reserve Bank of St. Louis)',
  frankfurter: 'frankfurter.dev (ECB reference rates)',
  alphaVantage: 'Alpha Vantage',
} as const;

export const DATA_SOURCE_REGISTRY: DataSourceRegistryEntry[] = [
  {
    sourceId: 'world-bank-pink-sheet',
    sourceName: SOURCE_NAMES.worldBank,
    domain: 'worldbank.org',
    dataType: ['commodities', 'historical prices'],
    country: null,
    region: 'Global',
    apiAvailable: false,
    apiEndpoint: 'https://www.worldbank.org/en/research/commodity-markets',
    apiKeyRequired: false,
    updateFrequency: 'monthly',
    historicalData: true,
    commercialUse: 'terms_review_required',
    redistributionAllowed: 'terms_review_required',
    attributionRequired: true,
    licence: 'World Bank dataset terms apply',
    status: 'active',
    lastSuccessfulFetch: null,
    lastFailedFetch: null,
    lastDataTimestamp: null,
  },
  {
    sourceId: 'imf-datamapper',
    sourceName: SOURCE_NAMES.imf,
    domain: 'imf.org',
    dataType: ['inflation', 'GDP growth', 'economic indicators'],
    country: null,
    region: 'Global',
    apiAvailable: true,
    apiEndpoint: 'https://www.imf.org/external/datamapper/api/v1',
    apiKeyRequired: false,
    updateFrequency: 'periodic',
    historicalData: true,
    commercialUse: 'terms_review_required',
    redistributionAllowed: 'terms_review_required',
    attributionRequired: true,
    licence: 'IMF data terms apply',
    status: 'active',
    lastSuccessfulFetch: null,
    lastFailedFetch: null,
    lastDataTimestamp: null,
  },
  {
    sourceId: 'fred',
    sourceName: SOURCE_NAMES.fred,
    domain: 'fred.stlouisfed.org',
    dataType: ['US inflation', 'producer prices', 'interest rates', 'industrial production'],
    country: 'United States',
    region: 'North America',
    apiAvailable: true,
    apiEndpoint: 'https://api.stlouisfed.org/fred/series/observations',
    apiKeyRequired: true,
    updateFrequency: 'series dependent',
    historicalData: true,
    commercialUse: 'terms_review_required',
    redistributionAllowed: 'terms_review_required',
    attributionRequired: true,
    licence: 'FRED and underlying series terms apply',
    status: 'configuration_required',
    lastSuccessfulFetch: null,
    lastFailedFetch: null,
    lastDataTimestamp: null,
  },
  {
    sourceId: 'frankfurter-ecb',
    sourceName: SOURCE_NAMES.frankfurter,
    domain: 'frankfurter.dev',
    dataType: ['FX reference rates'],
    country: null,
    region: 'Global',
    apiAvailable: true,
    apiEndpoint: 'https://api.frankfurter.dev/v1',
    apiKeyRequired: false,
    updateFrequency: 'business daily',
    historicalData: true,
    commercialUse: 'terms_review_required',
    redistributionAllowed: 'terms_review_required',
    attributionRequired: true,
    licence: 'Provider and ECB reference-rate terms apply',
    status: 'active',
    lastSuccessfulFetch: null,
    lastFailedFetch: null,
    lastDataTimestamp: null,
  },
  {
    sourceId: 'alpha-vantage',
    sourceName: SOURCE_NAMES.alphaVantage,
    domain: 'alphavantage.co',
    dataType: ['commodity reference prices'],
    country: null,
    region: 'Global',
    apiAvailable: true,
    apiEndpoint: 'https://www.alphavantage.co/query',
    apiKeyRequired: true,
    updateFrequency: 'monthly',
    historicalData: true,
    commercialUse: 'terms_review_required',
    redistributionAllowed: 'terms_review_required',
    attributionRequired: true,
    licence: 'Selected Alpha Vantage plan terms apply',
    status: 'configuration_required',
    lastSuccessfulFetch: null,
    lastFailedFetch: null,
    lastDataTimestamp: null,
  },
];

export function sourceUrlFor(sourceName: string): string | null {
  return DATA_SOURCE_REGISTRY.find((source) => source.sourceName === sourceName)?.apiEndpoint ?? null;
}
