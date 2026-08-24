// Real personalization: which real tracked commodity categories are most
// relevant to each industry. No fabricated per-industry data — this just
// reorders/filters the categories we actually have live coverage for.
export const INDUSTRY_TO_CATEGORIES: Record<string, string[]> = {
  Mining: ['Metals', 'Fuel & Energy', 'Logistics & Freight'],
  Packaging: ['Packaging', 'Paper', 'Plastics'],
  Construction: ['Construction Materials', 'Metals', 'Fuel & Energy'],
  FMCG: ['Packaging', 'Fuel & Energy', 'Agriculture'],
  Manufacturing: ['Metals', 'Chemicals', 'Plastics'],
  Agriculture: ['Agriculture', 'Fuel & Energy', 'Logistics & Freight'],
  Retail: ['Logistics & Freight', 'Packaging', 'Agriculture'],
  'Oil & Gas': ['Fuel & Energy', 'Chemicals', 'Logistics & Freight'],
  Logistics: ['Logistics & Freight', 'Fuel & Energy'],
};

export const INDUSTRY_OPTIONS = Object.keys(INDUSTRY_TO_CATEGORIES);
