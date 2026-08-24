import type {
  CommodityDetail,
  CommodityListEntry,
  DashboardPayload,
  FxDetail,
  FxListEntry,
  HistoryPoint,
} from '@/types/market-data';

/**
 * Fallbacks used only when our own API is unreachable or hasn't been
 * seeded yet (e.g. no backend running, or a fresh database with no
 * refresh cycle completed). FX falls back to a real, live client-side
 * call to frankfurter.dev (free, no key, CORS-friendly — safe to call
 * from the browser). Commodities fall back to clearly-labeled sample
 * data, since Alpha Vantage requires a server-side key and shouldn't be
 * called from the browser.
 */

const SPARKLINE_POINTS = 14;
const TRACKED_CURRENCIES = ['EUR', 'GBP', 'ZAR', 'NGN', 'KES', 'EGP', 'GHS', 'CNY', 'BRL', 'SGD'];

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

type IndicatorFrequency = 'daily' | 'monthly' | 'annual';

interface ChangeStats {
  change7d: number | null;
  change30d: number | null;
  periodShortLabel: string;
  periodLongLabel: string | null;
}

// Mirrors apps/api/src/market-data/market-data.utils.ts::computeChangeStats
// exactly — a 7-day window is meaningless for monthly/annual indicators,
// so the comparison window (and its label) must match how often the
// series actually updates, never a hardcoded "7d"/"30d".
function computeChangeStats(history: HistoryPoint[], frequency: IndicatorFrequency = 'daily'): ChangeStats {
  if (history.length === 0) {
    return { change7d: null, change30d: null, periodShortLabel: '7d', periodLongLabel: '30d' };
  }
  const latest = history[history.length - 1];
  const latestTime = new Date(latest.asOf).getTime();

  function changeAt(days: number): number | null {
    const targetTime = latestTime - days * 24 * 60 * 60 * 1000;
    let reference: HistoryPoint | null = null;
    for (const point of history) {
      if (new Date(point.asOf).getTime() <= targetTime) {
        reference = point;
      } else {
        break;
      }
    }
    if (!reference || reference.price === 0) return null;
    return ((latest.price - reference.price) / reference.price) * 100;
  }

  if (frequency === 'annual') {
    return { change7d: null, change30d: changeAt(365), periodShortLabel: 'YoY', periodLongLabel: null };
  }
  if (frequency === 'monthly') {
    return { change7d: changeAt(30), change30d: changeAt(365), periodShortLabel: 'MoM', periodLongLabel: 'YoY' };
  }
  return { change7d: changeAt(7), change30d: changeAt(30), periodShortLabel: '7d', periodLongLabel: '30d' };
}

function sparklineOf(history: HistoryPoint[]): HistoryPoint[] {
  return history.slice(-SPARKLINE_POINTS);
}

async function fetchLiveFxSeries(days: number): Promise<Record<string, HistoryPoint[]>> {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const url = `https://api.frankfurter.dev/v1/${formatDate(start)}..${formatDate(end)}?from=USD&to=${TRACKED_CURRENCIES.join(',')}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Frankfurter fallback request failed');

  const data = (await response.json()) as { rates: Record<string, Record<string, number>> };
  const byCurrency: Record<string, HistoryPoint[]> = {};

  for (const [dateStr, ratesForDate] of Object.entries(data.rates)) {
    for (const [code, rate] of Object.entries(ratesForDate)) {
      byCurrency[code] ??= [];
      byCurrency[code].push({ asOf: `${dateStr}T00:00:00.000Z`, price: rate });
    }
  }

  for (const series of Object.values(byCurrency)) {
    series.sort((a, b) => new Date(a.asOf).getTime() - new Date(b.asOf).getTime());
  }

  return byCurrency;
}

// Deterministic pseudo-random walk so the sample chart looks like a real
// series (not a flat line) without pretending to be a live feed.
function syntheticHistory(basePrice: number, seed: number, points = 182): HistoryPoint[] {
  const today = new Date();
  const history: HistoryPoint[] = [];
  let price = basePrice * 0.9;
  let rand = seed;

  for (let i = points - 1; i >= 0; i -= 1) {
    rand = (rand * 9301 + 49297) % 233280;
    const noise = (rand / 233280 - 0.5) * 0.04;
    price = Math.max(price * (1 + noise + 0.0025), basePrice * 0.6);
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    history.push({ asOf: date.toISOString(), price: Number(price.toFixed(2)) });
  }
  // Anchor the last point to today's "known" price so the headline number is stable.
  history[history.length - 1] = { asOf: today.toISOString(), price: basePrice };
  return history;
}

// Frankfurter mirrors ECB reference rates, which don't cover several major
// African currencies procurement teams actually price against. These fill
// that gap with clearly-labeled sample rates rather than leaving them out.
const SAMPLE_FX_EXTRAS = [
  { code: 'NGN', rate: 1550, seed: 211 },
  { code: 'KES', rate: 129, seed: 223 },
  { code: 'EGP', rate: 49, seed: 227 },
  { code: 'GHS', rate: 15.2, seed: 233 },
];

const SAMPLE_FX_SOURCE = 'Sample data — not published by the ECB reference feed';

function getSampleFxEntries(): FxListEntry[] {
  return SAMPLE_FX_EXTRAS.map((def) => {
    const history = syntheticHistory(def.rate, def.seed);
    const stats = computeChangeStats(history);
    const latest = history[history.length - 1];
    return {
      baseCode: 'USD',
      quoteCode: def.code,
      latestRate: latest.price,
      asOf: latest.asOf,
      change7d: stats.change7d,
      change30d: stats.change30d,
      periodShortLabel: stats.periodShortLabel,
      periodLongLabel: stats.periodLongLabel,
      source: SAMPLE_FX_SOURCE,
      sparkline: sparklineOf(history),
    };
  });
}

export async function fetchFallbackFxList(): Promise<FxListEntry[]> {
  const series = await fetchLiveFxSeries(180);
  const live = Object.entries(series).map(([code, history]) => {
    const stats = computeChangeStats(history);
    const latest = history[history.length - 1];
    return {
      baseCode: 'USD',
      quoteCode: code,
      latestRate: latest.price,
      asOf: latest.asOf,
      change7d: stats.change7d,
      change30d: stats.change30d,
      periodShortLabel: stats.periodShortLabel,
      periodLongLabel: stats.periodLongLabel,
      source: 'frankfurter.dev (live, direct)',
      sparkline: sparklineOf(history),
    };
  });
  return [...live, ...getSampleFxEntries()];
}

export async function fetchFallbackFxDetail(code: string): Promise<FxDetail | null> {
  const upper = code.toUpperCase();
  const series = await fetchLiveFxSeries(180);
  const history = series[upper];
  if (history && history.length > 0) {
    const stats = computeChangeStats(history);
    const latest = history[history.length - 1];
    return {
      baseCode: 'USD',
      quoteCode: upper,
      latestRate: latest.price,
      asOf: latest.asOf,
      change7d: stats.change7d,
      change30d: stats.change30d,
      periodShortLabel: stats.periodShortLabel,
      periodLongLabel: stats.periodLongLabel,
      source: 'frankfurter.dev (live, direct)',
      sparkline: sparklineOf(history),
      history,
    };
  }

  const sampleDef = SAMPLE_FX_EXTRAS.find((def) => def.code === upper);
  if (!sampleDef) return null;

  const sampleHistory = syntheticHistory(sampleDef.rate, sampleDef.seed);
  const stats = computeChangeStats(sampleHistory);
  const latest = sampleHistory[sampleHistory.length - 1];
  return {
    baseCode: 'USD',
    quoteCode: upper,
    latestRate: latest.price,
    asOf: latest.asOf,
    change7d: stats.change7d,
    change30d: stats.change30d,
    periodShortLabel: stats.periodShortLabel,
    periodLongLabel: stats.periodLongLabel,
    source: SAMPLE_FX_SOURCE,
    sparkline: sparklineOf(sampleHistory),
    history: sampleHistory,
  };
}

const SAMPLE_COMMODITY_DEFS = [
  { symbol: 'WTI', name: 'Crude Oil (WTI)', unit: 'USD/barrel', category: 'Fuel & Energy', price: 78.4, seed: 11 },
  { symbol: 'BRENT', name: 'Crude Oil (Brent)', unit: 'USD/barrel', category: 'Fuel & Energy', price: 82.1, seed: 23 },
  { symbol: 'NATURAL_GAS', name: 'Natural Gas', unit: 'USD/MMBtu', category: 'Fuel & Energy', price: 2.85, seed: 37 },
  { symbol: 'COPPER', name: 'Copper', unit: 'USD/lb', category: 'Metals', price: 4.32, seed: 51 },
  { symbol: 'ALUMINUM', name: 'Aluminium', unit: 'USD/tonne', category: 'Metals', price: 2410, seed: 67 },
  { symbol: 'WHEAT', name: 'Wheat', unit: 'USD/bushel', category: 'Agriculture', price: 5.68, seed: 83 },
  { symbol: 'STEEL_HRC', name: 'Steel (Hot-Rolled Coil)', unit: 'USD/short ton', category: 'Metals', price: 731, seed: 97 },
  { symbol: 'PACKAGING_BOARD', name: 'Containerboard (Packaging)', unit: 'USD/short ton', category: 'Packaging', price: 618, seed: 109 },
  { symbol: 'PULP', name: 'Pulp (NBSK, Paper)', unit: 'USD/tonne', category: 'Paper', price: 1180, seed: 127 },
  { symbol: 'HDPE', name: 'Polyethylene (HDPE)', unit: 'USD/tonne', category: 'Plastics', price: 1350, seed: 139 },
  { symbol: 'BENZENE', name: 'Benzene (Industrial Chemical)', unit: 'USD/tonne', category: 'Chemicals', price: 982, seed: 151 },
  { symbol: 'LUMBER', name: 'Softwood Lumber', unit: 'USD/thousand board ft', category: 'Construction Materials', price: 542, seed: 163 },
  { symbol: 'CORN', name: 'Corn (Maize)', unit: 'USD/tonne', category: 'Agriculture', price: 213.4, seed: 173 },
  { symbol: 'SEA_FREIGHT', name: 'Sea Freight (40ft Container, Asia–Africa)', unit: 'USD/container', category: 'Logistics & Freight', price: 2450, seed: 191 },
  { symbol: 'ROAD_FREIGHT', name: 'Road Freight (Regional Trucking)', unit: 'USD/tonne-km', category: 'Logistics & Freight', price: 0.12, seed: 199 },
  // World Bank Pink Sheet commodities (real when the backend is reachable)
  { symbol: 'IRON_ORE', name: 'Iron Ore', unit: 'USD/dmtu', category: 'Metals', price: 98.2, seed: 211 },
  { symbol: 'COAL', name: 'Coal (Australian)', unit: 'USD/tonne', category: 'Fuel & Energy', price: 131.9, seed: 223 },
  { symbol: 'ZINC', name: 'Zinc', unit: 'USD/tonne', category: 'Metals', price: 3599, seed: 227 },
  { symbol: 'NICKEL', name: 'Nickel', unit: 'USD/tonne', category: 'Metals', price: 16651, seed: 233 },
  { symbol: 'UREA', name: 'Urea (Fertilizer)', unit: 'USD/tonne', category: 'Chemicals', price: 400, seed: 239 },
  { symbol: 'COTTON', name: 'Cotton', unit: 'USD/kg', category: 'Agriculture', price: 1.96, seed: 241 },
  { symbol: 'SUGAR', name: 'Sugar', unit: 'USD/kg', category: 'Agriculture', price: 0.34, seed: 251 },
  { symbol: 'PALM_OIL', name: 'Palm Oil', unit: 'USD/tonne', category: 'Agriculture', price: 1101, seed: 257 },
  { symbol: 'GOLD', name: 'Gold', unit: 'USD/troy oz', category: 'Metals', price: 4073, seed: 263 },
  // FRED US macro indicators (real when the backend is reachable) — monthly series
  { symbol: 'CPI_US', name: 'US Consumer Price Index (CPI)', unit: 'Index (1982-84=100)', category: 'Economic Indicators', price: 332.57, seed: 271, frequency: 'monthly' as const },
  { symbol: 'PPI_US', name: 'US Producer Price Index (PPI)', unit: 'Index (1982=100)', category: 'Economic Indicators', price: 286.83, seed: 277, frequency: 'monthly' as const },
  { symbol: 'FED_FUNDS_RATE', name: 'US Federal Funds Rate', unit: '% (effective rate)', category: 'Economic Indicators', price: 3.63, seed: 281, frequency: 'monthly' as const },
  { symbol: 'INDUSTRIAL_PRODUCTION_US', name: 'US Industrial Production Index', unit: 'Index (2017=100)', category: 'Economic Indicators', price: 102.64, seed: 283, frequency: 'monthly' as const },
  // IMF World Economic Outlook indicators (real when the backend is reachable) — annual series
  { symbol: 'INFLATION_ZAF', name: 'Inflation (CPI, avg) — South Africa', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 3.2, seed: 293, frequency: 'annual' as const },
  { symbol: 'INFLATION_EGY', name: 'Inflation (CPI, avg) — Egypt', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 20.4, seed: 307, frequency: 'annual' as const },
  { symbol: 'INFLATION_CHN', name: 'Inflation (CPI, avg) — China', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 0.1, seed: 311, frequency: 'annual' as const },
  { symbol: 'INFLATION_NLD', name: 'Inflation (CPI, avg) — Netherlands', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 3, seed: 313, frequency: 'annual' as const },
  { symbol: 'INFLATION_GBR', name: 'Inflation (CPI, avg) — United Kingdom', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 3.4, seed: 317, frequency: 'annual' as const },
  { symbol: 'INFLATION_BRA', name: 'Inflation (CPI, avg) — Brazil', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 5, seed: 331, frequency: 'annual' as const },
  { symbol: 'INFLATION_SGP', name: 'Inflation (CPI, avg) — Singapore', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 0.9, seed: 337, frequency: 'annual' as const },
  { symbol: 'INFLATION_USA', name: 'Inflation (CPI, avg) — United States', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 2.7, seed: 347, frequency: 'annual' as const },
  { symbol: 'GDP_GROWTH_ZAF', name: 'Real GDP Growth — South Africa', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 1.1, seed: 349, frequency: 'annual' as const },
  { symbol: 'GDP_GROWTH_EGY', name: 'Real GDP Growth — Egypt', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 4.4, seed: 353, frequency: 'annual' as const },
  { symbol: 'GDP_GROWTH_CHN', name: 'Real GDP Growth — China', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 5, seed: 359, frequency: 'annual' as const },
  { symbol: 'GDP_GROWTH_NLD', name: 'Real GDP Growth — Netherlands', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 1.9, seed: 367, frequency: 'annual' as const },
  { symbol: 'GDP_GROWTH_GBR', name: 'Real GDP Growth — United Kingdom', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 1.3, seed: 373, frequency: 'annual' as const },
  { symbol: 'GDP_GROWTH_BRA', name: 'Real GDP Growth — Brazil', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 2.3, seed: 379, frequency: 'annual' as const },
  { symbol: 'GDP_GROWTH_SGP', name: 'Real GDP Growth — Singapore', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 5, seed: 383, frequency: 'annual' as const },
  { symbol: 'GDP_GROWTH_USA', name: 'Real GDP Growth — United States', unit: '% year-over-year (IMF WEO)', category: 'Economic Indicators', price: 2.1, seed: 389, frequency: 'annual' as const },
] as const;

const SAMPLE_SOURCE = 'Sample data — live feed unavailable';

export function getSampleCommodityList(): CommodityListEntry[] {
  return SAMPLE_COMMODITY_DEFS.map((def) => {
    const frequency = ('frequency' in def ? def.frequency : 'daily') as 'daily' | 'monthly' | 'annual';
    const history = syntheticHistory(def.price, def.seed);
    const stats = computeChangeStats(history, frequency);
    return {
      symbol: def.symbol,
      name: def.name,
      unit: def.unit,
      category: def.category,
      latestPrice: def.price,
      currency: 'USD',
      asOf: new Date().toISOString(),
      change7d: stats.change7d,
      change30d: stats.change30d,
      periodShortLabel: stats.periodShortLabel,
      periodLongLabel: stats.periodLongLabel,
      frequency,
      source: SAMPLE_SOURCE,
      sparkline: sparklineOf(history),
    };
  });
}

export function getSampleCommodityDetail(symbol: string): CommodityDetail | null {
  const def = SAMPLE_COMMODITY_DEFS.find((d) => d.symbol === symbol.toUpperCase());
  if (!def) return null;

  const frequency = ('frequency' in def ? def.frequency : 'daily') as 'daily' | 'monthly' | 'annual';
  const history = syntheticHistory(def.price, def.seed);
  const stats = computeChangeStats(history, frequency);
  return {
    symbol: def.symbol,
    name: def.name,
    unit: def.unit,
    category: def.category,
    latestPrice: def.price,
    currency: 'USD',
    asOf: new Date().toISOString(),
    change7d: stats.change7d,
    change30d: stats.change30d,
    periodShortLabel: stats.periodShortLabel,
    periodLongLabel: stats.periodLongLabel,
    frequency,
    source: SAMPLE_SOURCE,
    sparkline: sparklineOf(history),
    history,
  };
}

export async function buildFallbackDashboard(): Promise<DashboardPayload> {
  let fx: FxListEntry[] = [];
  try {
    fx = await fetchFallbackFxList();
  } catch {
    fx = getSampleFxEntries();
  }

  return {
    fx,
    commodities: getSampleCommodityList(),
    commodityDataAvailable: true,
    generatedAt: new Date().toISOString(),
  };
}
