import type { PortConditionsPayload } from '@/types/logistics';

/**
 * Maps each tracked trade-route point to the real FX currency (if any) we
 * also track for that country, so the two independently-real data sources
 * (FX history volatility, live port weather) can be shown side by side as
 * one "signal" per country — computed and disclosed, never a fabricated
 * risk score.
 */
export const COUNTRY_SIGNAL_DEFS = [
  { country: 'South Africa', fxQuoteCode: 'ZAR', portId: 'PORT_DURBAN' },
  { country: 'Egypt', fxQuoteCode: null, portId: 'SUEZ_CANAL' },
  { country: 'China', fxQuoteCode: 'CNY', portId: 'PORT_SHANGHAI' },
  { country: 'Netherlands', fxQuoteCode: 'EUR', portId: 'PORT_ROTTERDAM' },
  { country: 'United Kingdom', fxQuoteCode: 'GBP', portId: null },
  { country: 'Brazil', fxQuoteCode: 'BRL', portId: 'PORT_SANTOS' },
  { country: 'Singapore', fxQuoteCode: 'SGD', portId: 'SINGAPORE_STRAIT' },
  { country: 'United States', fxQuoteCode: null, portId: 'PORT_LOS_ANGELES' },
  { country: 'Panama', fxQuoteCode: null, portId: 'PANAMA_CANAL' },
  { country: 'Iran / Oman', fxQuoteCode: null, portId: 'STRAIT_OF_HORMUZ' },
] as const;

export type VolatilityBucket = 'Low' | 'Moderate' | 'Elevated';

// Disclosed thresholds on standard deviation of daily % change over the
// last 30 tracked days — not a black-box score.
export function volatilityBucket(stddevPct: number): VolatilityBucket {
  if (stddevPct < 0.3) return 'Low';
  if (stddevPct < 0.6) return 'Moderate';
  return 'Elevated';
}

export function findPortCondition(payload: PortConditionsPayload | undefined, portId: string | null) {
  if (!portId || !payload) return null;
  return payload.points.find((p) => p.id === portId) ?? null;
}
