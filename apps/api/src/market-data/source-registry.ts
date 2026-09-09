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
  imfCommodities: 'IMF Primary Commodity Price System',
  fred: 'FRED (Federal Reserve Bank of St. Louis)',
  frankfurter: 'frankfurter.dev (ECB reference rates)',
  alphaVantage: 'Alpha Vantage',
  eia: 'U.S. Energy Information Administration',
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
    sourceId: 'imf-primary-commodity-prices',
    sourceName: SOURCE_NAMES.imfCommodities,
    domain: 'imf.org',
    dataType: ['fuel commodities', 'non-fuel commodities', 'commodity price indices', 'commodity terms of trade', 'historical commodity prices'],
    country: null,
    region: 'Global',
    apiAvailable: true,
    apiEndpoint: 'https://data.imf.org/Datasets/PCPS',
    apiKeyRequired: false,
    updateFrequency: 'monthly',
    historicalData: true,
    commercialUse: 'terms_review_required',
    redistributionAllowed: 'terms_review_required',
    attributionRequired: true,
    licence: 'IMF data terms apply',
    status: 'planned',
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
  ...[
    ['eia', 'U.S. Energy Information Administration', 'eia.gov', ['energy', 'petroleum', 'natural gas', 'coal', 'electricity'], 'https://api.eia.gov/v2/', true],
    ['za-dmre', 'South African Department of Mineral Resources and Energy', 'gov.za', ['official South African fuel prices', 'fuel adjustments'], 'https://www.gov.za/about-sa/minerals', false],
    ['za-cef', 'Central Energy Fund', 'cefgroup.co.za', ['South African fuel price mechanism', 'fuel components'], 'https://www.cefgroup.co.za/', false],
    ['stats-sa', 'Statistics South Africa', 'statssa.gov.za', ['CPI', 'PPI', 'GDP', 'manufacturing', 'employment', 'trade'], 'https://www.statssa.gov.za/', false],
    ['sarb', 'South African Reserve Bank', 'resbank.co.za', ['interest rates', 'exchange rates', 'monetary indicators'], 'https://www.resbank.co.za/', false],
    ['eurostat', 'Eurostat', 'ec.europa.eu/eurostat', ['European inflation', 'production', 'trade', 'energy'], 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/', false],
    ['un-comtrade', 'UN Comtrade', 'comtradeplus.un.org', ['imports', 'exports', 'HS code trade'], 'https://comtradeapi.un.org/', false],
    ['world-bank-wits', 'World Bank WITS', 'wits.worldbank.org', ['trade', 'tariffs', 'partners', 'products'], 'https://wits.worldbank.org/', false],
    ['wto-data', 'WTO Data', 'data.wto.org', ['merchandise trade', 'tariffs', 'market access'], 'https://api.wto.org/', true],
    ['fao', 'Food and Agriculture Organization', 'fao.org', ['agriculture', 'food prices', 'production'], 'https://fenixservices.fao.org/', false],
    ['usda', 'United States Department of Agriculture', 'usda.gov', ['crops', 'grains', 'supply and demand'], 'https://quickstats.nass.usda.gov/api/', true],
    ['unctad', 'UN Trade and Development', 'unctad.org', ['maritime transport', 'port traffic', 'connectivity'], 'https://unctadstat.unctad.org/', false],
    ['imf-portwatch', 'IMF PortWatch', 'portwatch.imf.org', ['port activity', 'maritime flows', 'disruption'], 'https://portwatch.imf.org/', false],
    ['transnet-national-ports-authority', 'Transnet National Ports Authority', 'transnetnationalportsauthority.net', ['South African port operations', 'port notices', 'operational disruption'], 'https://www.transnetnationalportsauthority.net/', false],
    ['gdelt', 'GDELT', 'gdeltproject.org', ['news discovery', 'supply-chain events', 'geopolitics'], 'https://api.gdeltproject.org/api/v2/doc/doc', false],
    ['approved-industry-news', 'Approved industry publishers', 'publisher-registry-required', ['procurement', 'supply chain', 'manufacturing', 'logistics', 'packaging', 'mining', 'agriculture', 'energy', 'chemicals', 'retail'], null, false],
    ['licensed-weather-provider', 'Licensed weather-data provider', 'provider-contract-required', ['port weather', 'agriculture weather', 'logistics disruption', 'mining weather risk'], null, true],
    ['licensed-freight-provider', 'Licensed freight-rate provider', 'provider-contract-required', ['container freight rates'], null, true],
    ['yahoo-finance-authorized', 'Yahoo Finance (authorised access only)', 'finance.yahoo.com', ['secondary FX reference', 'secondary commodity reference', 'historical market reference'], null, true],
  ].map(([sourceId, sourceName, domain, dataType, apiEndpoint, apiKeyRequired]) => ({
    sourceId: sourceId as string,
    sourceName: sourceName as string,
    domain: domain as string,
    dataType: dataType as string[],
    country: sourceId === 'za-dmre' || sourceId === 'za-cef' || sourceId === 'stats-sa' || sourceId === 'sarb' ? 'South Africa' : null,
    region: sourceId === 'eurostat' ? 'Europe' : 'Global',
    apiAvailable: Boolean(apiEndpoint),
    apiEndpoint: apiEndpoint as string | null,
    apiKeyRequired: apiKeyRequired as boolean,
    updateFrequency: 'source dependent',
    historicalData: sourceId !== 'gdelt',
    commercialUse: 'terms_review_required' as LicenceReview,
    redistributionAllowed: 'terms_review_required' as LicenceReview,
    attributionRequired: true,
    licence: 'Provider terms and intended commercial use must be approved before activation',
    status: sourceId === 'eia' ? 'configuration_required' as SourceAvailability : 'planned' as SourceAvailability,
    lastSuccessfulFetch: null,
    lastFailedFetch: null,
    lastDataTimestamp: null,
  })),
];

export function sourceUrlFor(sourceName: string): string | null {
  return DATA_SOURCE_REGISTRY.find((source) => source.sourceName === sourceName)?.apiEndpoint ?? null;
}
