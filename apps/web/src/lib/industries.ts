// GHL is the source of truth for the labels shown to users. These mappings do
// not invent industry data; they connect each GHL label to the real commodity
// categories for which ProcureChain already has live coverage.
export const INDUSTRY_TO_CATEGORIES: Record<string, string[]> = {
  'Mining & Metals': ['Metals', 'Fuel & Energy', 'Logistics & Freight'],
  'Oil & Gas': ['Fuel & Energy', 'Chemicals', 'Logistics & Freight'],
  Construction: ['Construction Materials', 'Metals', 'Fuel & Energy'],
  Manufacturing: ['Metals', 'Chemicals', 'Plastics', 'Fuel & Energy'],
  'Agriculture & Agro-processing': ['Agriculture', 'Chemicals', 'Fuel & Energy'],
  'Energy & Utilities': ['Fuel & Energy', 'Metals'],
  'Healthcare & Pharma': ['Chemicals'],
  'Retail & FMCG': ['Agriculture', 'Packaging', 'Fuel & Energy'],
  Telecommunications: ['Metals', 'Fuel & Energy'],
  Automotive: ['Metals', 'Fuel & Energy', 'Chemicals'],
  Food: ['Agriculture', 'Fuel & Energy', 'Packaging'],
  'Transport & Logistics': ['Logistics & Freight', 'Fuel & Energy'],
  Chemicals: ['Chemicals', 'Fuel & Energy'],
  Packaging: ['Packaging', 'Paper', 'Plastics'],
  'Government & Public Sector': [],
  'Financial Services': [],
  Technology: [],
  Other: [],
};

export const INDUSTRY_OPTIONS = Object.keys(INDUSTRY_TO_CATEGORIES);

const INDUSTRY_ALIASES: Record<string, string> = {
  mining: 'Mining & Metals',
  metals: 'Mining & Metals',
  'mining and metals': 'Mining & Metals',
  agriculture: 'Agriculture & Agro-processing',
  'agro processing': 'Agriculture & Agro-processing',
  energy: 'Energy & Utilities',
  utilities: 'Energy & Utilities',
  healthcare: 'Healthcare & Pharma',
  pharma: 'Healthcare & Pharma',
  retail: 'Retail & FMCG',
  fmcg: 'Retail & FMCG',
  logistics: 'Transport & Logistics',
  transport: 'Transport & Logistics',
};

function normalizeIndustry(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const NORMALIZED_INDUSTRIES = new Map(
  INDUSTRY_OPTIONS.map((industry) => [normalizeIndustry(industry), industry]),
);

/** Resolve both current GHL labels and older, shorter labels used by the app. */
export function resolveIndustryCategories(industry: string | null | undefined): string[] {
  if (!industry) return [];

  const normalized = normalizeIndustry(industry);
  const canonical = NORMALIZED_INDUSTRIES.get(normalized) ?? INDUSTRY_ALIASES[normalized];
  return canonical ? INDUSTRY_TO_CATEGORIES[canonical] ?? [] : [];
}
