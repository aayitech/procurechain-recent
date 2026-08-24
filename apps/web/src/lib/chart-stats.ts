import type { HistoryPoint } from '@/types/market-data';

export function simpleMovingAverage(history: HistoryPoint[], window: number): Array<{ asOf: string; sma: number | null }> {
  return history.map((point, i) => {
    if (i < window - 1) return { asOf: point.asOf, sma: null };
    const slice = history.slice(i - window + 1, i + 1);
    const avg = slice.reduce((sum, p) => sum + p.price, 0) / slice.length;
    return { asOf: point.asOf, sma: avg };
  });
}

/** Standard deviation of period-over-period % change — a real volatility measure. */
export function computeVolatility(history: HistoryPoint[]): number | null {
  if (history.length < 2) return null;
  const pctChanges: number[] = [];
  for (let i = 1; i < history.length; i += 1) {
    const prev = history[i - 1].price;
    if (prev === 0) continue;
    pctChanges.push(((history[i].price - prev) / prev) * 100);
  }
  if (pctChanges.length === 0) return null;
  const mean = pctChanges.reduce((s, v) => s + v, 0) / pctChanges.length;
  const variance = pctChanges.reduce((s, v) => s + (v - mean) ** 2, 0) / pctChanges.length;
  return Math.sqrt(variance);
}

export interface BollingerPoint {
  asOf: string;
  upper: number | null;
  lower: number | null;
}

/** Standard Bollinger Bands: SMA ± (multiplier × rolling standard deviation). */
export function computeBollingerBands(history: HistoryPoint[], window: number, multiplier = 2): BollingerPoint[] {
  return history.map((point, i) => {
    if (i < window - 1) return { asOf: point.asOf, upper: null, lower: null };
    const slice = history.slice(i - window + 1, i + 1).map((p) => p.price);
    const mean = slice.reduce((s, v) => s + v, 0) / slice.length;
    const variance = slice.reduce((s, v) => s + (v - mean) ** 2, 0) / slice.length;
    const stddev = Math.sqrt(variance);
    return { asOf: point.asOf, upper: mean + multiplier * stddev, lower: mean - multiplier * stddev };
  });
}

/** Standard 14-period RSI (Wilder's smoothing), 0-100. Real computed indicator. */
export function computeRSI(history: HistoryPoint[], period = 14): Array<{ asOf: string; rsi: number | null }> {
  if (history.length < period + 1) {
    return history.map((p) => ({ asOf: p.asOf, rsi: null }));
  }

  const result: Array<{ asOf: string; rsi: number | null }> = history.map((p) => ({ asOf: p.asOf, rsi: null }));
  let gainSum = 0;
  let lossSum = 0;

  for (let i = 1; i <= period; i += 1) {
    const change = history[i].price - history[i - 1].price;
    if (change >= 0) gainSum += change;
    else lossSum -= change;
  }
  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;
  result[period].rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < history.length; i += 1) {
    const change = history[i].price - history[i - 1].price;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    result[i].rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }

  return result;
}

export interface TrendProjection {
  points: HistoryPoint[];
  slopePerDay: number;
  r2: number;
  projectedChangePct: number | null;
}

/**
 * Ordinary least-squares linear regression of price vs. real elapsed days,
 * extrapolated forward. This is transparent arithmetic on real historical
 * data — not a predictive model. r2 (goodness of fit) is reported alongside
 * so the projection's reliability is visible, not asserted.
 */
export function computeTrendProjection(history: HistoryPoint[], projectDays: number): TrendProjection | null {
  if (history.length < 3) return null;

  const t0 = new Date(history[0].asOf).getTime();
  const xs = history.map((p) => (new Date(p.asOf).getTime() - t0) / (24 * 60 * 60 * 1000));
  const ys = history.map((p) => p.price);
  const n = xs.length;

  const xMean = xs.reduce((s, v) => s + v, 0) / n;
  const yMean = ys.reduce((s, v) => s + v, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i += 1) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;

  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i += 1) {
    const predicted = slope * xs[i] + intercept;
    ssRes += (ys[i] - predicted) ** 2;
    ssTot += (ys[i] - yMean) ** 2;
  }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  const lastX = xs[n - 1];
  const lastPoint = history[n - 1];
  const projectedSteps = 6;
  const points: HistoryPoint[] = [];
  for (let step = 1; step <= projectedSteps; step += 1) {
    const x = lastX + (projectDays * step) / projectedSteps;
    const price = slope * x + intercept;
    const date = new Date(t0 + x * 24 * 60 * 60 * 1000);
    points.push({ asOf: date.toISOString(), price });
  }

  const projectedChangePct = lastPoint.price !== 0
    ? ((points[points.length - 1].price - lastPoint.price) / lastPoint.price) * 100
    : null;

  return { points, slopePerDay: slope, r2, projectedChangePct };
}

export function filterByRange(history: HistoryPoint[], rangeDays: number | null): HistoryPoint[] {
  if (rangeDays === null) return history;
  const cutoff = Date.now() - rangeDays * 24 * 60 * 60 * 1000;
  const filtered = history.filter((p) => new Date(p.asOf).getTime() >= cutoff);
  // If the range is tighter than our data resolution (e.g. "1M" on monthly
  // commodity data), fall back to the last few points rather than showing nothing.
  return filtered.length >= 2 ? filtered : history.slice(-3);
}
