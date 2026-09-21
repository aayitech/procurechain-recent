import type { AuthUser } from '@/types/auth';
import { resolveIndustryCategories } from './industries';

const INTEREST_KEYWORDS: Record<string, string[]> = {
  'Commodity prices': ['commodity', 'price'],
  'FX & currency risk': ['fx', 'currency', 'exchange rate'],
  'Logistics & freight': ['logistics', 'freight', 'shipping', 'port'],
  'Supplier risk': ['supplier', 'supply', 'disruption'],
  'Cost optimization': ['cost', 'price', 'inflation'],
  'Category intelligence': ['category', 'procurement'],
  'Economic indicators': ['economic', 'inflation', 'gdp', 'interest rate'],
  'Trade & regulation': ['trade', 'tariff', 'regulation'],
  'Crude oil': ['crude oil', 'wti', 'brent'],
  'Pulp & paper': ['pulp', 'paper'],
};

export function profileKeywords(user: AuthUser | null): string[] {
  if (!user) return [];
  const values = [
    user.country,
    user.industry,
    ...resolveIndustryCategories(user.industry),
    ...(user.marketProfile?.procurementCategories ?? []),
    ...(user.marketProfile?.commodities ?? []),
  ].filter((value): value is string => Boolean(value));

  const expanded = values.flatMap((value) => [
    value,
    ...(INTEREST_KEYWORDS[value] ?? []),
    ...value.split(/\s*(?:&|\/|,)\s*/).filter((part) => part.length > 2),
  ]);
  return [...new Set(expanded.map((value) => value.trim().toLowerCase()).filter((value) => value.length > 2))];
}

export function profileRelevance(text: string, keywords: string[]): number {
  const haystack = text.toLowerCase();
  return keywords.reduce((score, keyword) => score + (haystack.includes(keyword) ? 1 : 0), 0);
}
