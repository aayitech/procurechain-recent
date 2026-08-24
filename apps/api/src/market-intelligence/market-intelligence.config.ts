// A single shared category taxonomy used across Top Stories and Supply
// Chain Watch — keyword-matched against real headlines (word-boundary
// matching, same fix applied after the Market Brief's "ore" false-positive
// bug). Never AI-classified; always a disclosed, reproducible rule.
export const STORY_CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Shipping & Freight': ['freight', 'shipping', 'ocean', 'carrier', 'port', 'container', 'air cargo', 'intermodal', 'vessel', 'sailing'],
  Metals: ['copper', 'aluminium', 'aluminum', 'steel', 'iron ore', 'zinc', 'nickel', 'gold', 'metal', 'mining', 'mine'],
  Energy: ['oil', 'crude', 'gas', 'fuel', 'diesel', 'energy', 'refinery', 'opec'],
  Manufacturing: ['manufactur', 'factory', 'plant', 'production line', 'assembly', 'fulfillment', 'warehouse'],
  Agriculture: ['wheat', 'corn', 'crop', 'grain', 'harvest', 'agricultur', 'cattle', 'beef', 'coffee', 'cocoa', 'sugar', 'cotton'],
  'Trade & Policy': ['tariff', 'trade court', 'customs', 'regulation', 'export', 'import', 'sanction', 'de minimis', 'policy'],
  'FX & Economy': ['dollar', 'currency', 'exchange rate', 'inflation', 'gdp', 'interest rate', 'central bank'],
};

// Disclosed thresholds for classifying a real % move — never an opaque
// per-story judgment call.
export const IMPACT_HIGH_THRESHOLD_PCT = 5;
export const IMPACT_MEDIUM_THRESHOLD_PCT = 2;

export type ImpactLevel = 'High' | 'Medium' | 'Watch';

export function classifyImpact(absChangePct: number | null): ImpactLevel {
  if (absChangePct === null) return 'Watch';
  if (absChangePct >= IMPACT_HIGH_THRESHOLD_PCT) return 'High';
  if (absChangePct >= IMPACT_MEDIUM_THRESHOLD_PCT) return 'Medium';
  return 'Watch';
}

// Real coordinates for the two African markets we currently have any real
// tracked signal for (FX and/or a logistics chokepoint) — see
// apps/api/src/market-brief/market-brief.service.ts::computeAfricaWatch,
// same honesty constraint applies here (checked 2026-08-18: no real
// headline coverage this week for Nigeria/Kenya/Angola/DRC/Congo/Ghana).
export const AFRICA_COUNTRIES = [
  { country: 'South Africa', flag: '🇿🇦', fxQuoteCode: 'ZAR', portId: 'PORT_DURBAN' },
  { country: 'Egypt', flag: '🇪🇬', fxQuoteCode: null, portId: 'SUEZ_CANAL' },
] as const;
