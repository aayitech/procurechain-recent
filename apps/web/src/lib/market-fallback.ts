import type { DashboardPayload, FxDetail, FxListEntry, HistoryPoint } from '@/types/market-data';

const SPARKLINE_POINTS = 14;
const TRACKED_CURRENCIES = ['EUR', 'GBP', 'ZAR', 'CNY', 'BRL', 'SGD'];
const SOURCE_NAME = 'frankfurter.dev (ECB reference rates)';
const SOURCE_URL = 'https://api.frankfurter.dev/v1';

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function computeChange(history: HistoryPoint[], days: number): number | null {
  if (history.length === 0) return null;
  const latest = history[history.length - 1];
  const target = new Date(latest.asOf).getTime() - days * 24 * 60 * 60 * 1000;
  const reference = [...history].reverse().find((point) => new Date(point.asOf).getTime() <= target);
  if (!reference || reference.price === 0) return null;
  return ((latest.price - reference.price) / reference.price) * 100;
}

async function fetchLiveFxSeries(days: number): Promise<Record<string, HistoryPoint[]>> {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const response = await fetch(
    `${SOURCE_URL}/${formatDate(start)}..${formatDate(end)}?from=USD&to=${TRACKED_CURRENCIES.join(',')}`,
  );
  if (!response.ok) throw new Error('Frankfurter fallback request failed');

  const data = (await response.json()) as { rates: Record<string, Record<string, number>> };
  const byCurrency: Record<string, HistoryPoint[]> = {};
  for (const [date, rates] of Object.entries(data.rates)) {
    for (const [code, rate] of Object.entries(rates)) {
      byCurrency[code] ??= [];
      byCurrency[code].push({ asOf: `${date}T00:00:00.000Z`, price: rate });
    }
  }
  for (const series of Object.values(byCurrency)) {
    series.sort((a, b) => new Date(a.asOf).getTime() - new Date(b.asOf).getTime());
  }
  return byCurrency;
}

function toFxEntry(code: string, history: HistoryPoint[]): FxListEntry {
  const latest = history[history.length - 1];
  return {
    baseCode: 'USD',
    quoteCode: code,
    latestRate: latest.price,
    asOf: latest.asOf,
    change7d: computeChange(history, 7),
    change30d: computeChange(history, 30),
    periodShortLabel: '7d',
    periodLongLabel: '30d',
    source: SOURCE_NAME,
    sourceUrl: SOURCE_URL,
    sparkline: history.slice(-SPARKLINE_POINTS),
  };
}

export async function fetchFallbackFxList(): Promise<FxListEntry[]> {
  const series = await fetchLiveFxSeries(180);
  return Object.entries(series).map(([code, history]) => toFxEntry(code, history));
}

export async function fetchFallbackFxDetail(code: string): Promise<FxDetail | null> {
  const upper = code.toUpperCase();
  const history = (await fetchLiveFxSeries(180))[upper];
  return history?.length ? { ...toFxEntry(upper, history), history } : null;
}

export async function buildFallbackDashboard(): Promise<DashboardPayload> {
  let fx: FxListEntry[] = [];
  try {
    fx = await fetchFallbackFxList();
  } catch {
    // An unavailable live feed is represented as unavailable, never as generated data.
  }
  return { fx, commodities: [], commodityDataAvailable: false, generatedAt: new Date().toISOString() };
}
