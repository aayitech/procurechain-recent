'use client';

import { useMemo, useState } from 'react';
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { HistoryPoint } from '@/types/market-data';
import {
  computeBollingerBands,
  computeRSI,
  computeTrendProjection,
  filterByRange,
  simpleMovingAverage,
} from '@/lib/chart-stats';

const RANGES: Array<{ label: string; days: number | null }> = [
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: '3Y', days: 365 * 3 },
  { label: 'All', days: null },
];

const PROJECTION_HORIZONS = [
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

const PRICE_COLOR = '#3b82f6';
const SMA_COLOR = '#f59e0b';
const COMPARE_COLOR = '#22c55e';
const MARKER_COLOR = '#a855f7';
const BAND_COLOR = '#8b93a7';
const RSI_COLOR = '#06b6d4';
const PROJECTION_COLOR = '#ec4899';

// How close (in days) a real article's publish date must be to an actual
// data point before we'll place a marker there — avoids implying precision
// we don't have (e.g. pinning a news date to a monthly commodity point
// that's actually 3 weeks away).
const MARKER_TOLERANCE_DAYS = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

interface TooltipEntry {
  value: number;
  name: string;
  color: string;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-canvas-overlay px-3 py-2 text-xs shadow-card">
      <p className="text-ink-faint">{label && formatDate(label)}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="mt-0.5 font-mono" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
}

export interface NewsMarker {
  asOf: string;
  title: string;
  link: string;
}

type Overlay = 'none' | 'sma' | 'bollinger';

export function AdvancedPriceChart({
  history,
  unit,
  compareHistory,
  compareLabel,
  newsMarkers,
}: {
  history: HistoryPoint[];
  unit: string;
  compareHistory?: HistoryPoint[];
  compareLabel?: string;
  newsMarkers?: NewsMarker[];
}) {
  const [range, setRange] = useState(RANGES[3]);
  const [overlay, setOverlay] = useState<Overlay>('sma');
  const [showRsi, setShowRsi] = useState(false);
  const [projectionHorizon, setProjectionHorizon] = useState<number | null>(null);

  const windowed = useMemo(() => filterByRange(history, range.days), [history, range]);
  const indicatorWindow = Math.min(20, Math.max(2, Math.floor(windowed.length / 3)));
  const smaSeries = useMemo(() => simpleMovingAverage(windowed, indicatorWindow), [windowed, indicatorWindow]);
  const bollinger = useMemo(() => computeBollingerBands(windowed, indicatorWindow), [windowed, indicatorWindow]);
  const rsiSeries = useMemo(() => computeRSI(windowed), [windowed]);
  const projection = useMemo(
    () => (projectionHorizon ? computeTrendProjection(windowed, projectionHorizon) : null),
    [windowed, projectionHorizon],
  );

  const compareIndexed = useMemo(() => {
    if (!compareHistory || compareHistory.length < 2) return null;
    const base = compareHistory[0].price;
    return compareHistory.map((p) => ({ asOf: p.asOf, value: base !== 0 ? (p.price / base) * 100 : 100 }));
  }, [compareHistory]);

  const data = windowed.map((point, i) => {
    const row: Record<string, number | string> = { asOf: point.asOf, price: point.price };
    if (overlay === 'sma' && smaSeries[i]?.sma !== null) row.sma = smaSeries[i].sma as number;
    if (overlay === 'bollinger') {
      if (bollinger[i]?.upper !== null) row.bbUpper = bollinger[i].upper as number;
      if (bollinger[i]?.lower !== null) row.bbLower = bollinger[i].lower as number;
    }
    if (compareIndexed) {
      const priceBase = windowed[0].price;
      row.priceIndexed = priceBase !== 0 ? (point.price / priceBase) * 100 : 100;
      const match = compareIndexed.find((c) => c.asOf === point.asOf) ?? compareIndexed[Math.min(i, compareIndexed.length - 1)];
      row.compare = match.value;
    }
    if (projection && i === windowed.length - 1) {
      row.projection = point.price;
    }
    return row;
  });

  const chartData = projection && !compareIndexed
    ? [...data, ...projection.points.map((p) => ({ asOf: p.asOf, projection: p.price }))]
    : data;

  const rsiData = windowed.map((point, i) => ({ asOf: point.asOf, rsi: rsiSeries[i]?.rsi ?? null }));

  // Snap each real article's publish date to the nearest actual data point,
  // dropping any that are too far away to be honestly represented.
  const resolvedMarkers = useMemo(() => {
    if (!newsMarkers || windowed.length === 0) return [];
    return newsMarkers
      .map((marker) => {
        const markerTime = new Date(marker.asOf).getTime();
        let nearest = windowed[0];
        let nearestDiff = Math.abs(new Date(nearest.asOf).getTime() - markerTime);
        for (const point of windowed) {
          const diff = Math.abs(new Date(point.asOf).getTime() - markerTime);
          if (diff < nearestDiff) {
            nearest = point;
            nearestDiff = diff;
          }
        }
        const diffDays = nearestDiff / (24 * 60 * 60 * 1000);
        return diffDays <= MARKER_TOLERANCE_DAYS ? { ...marker, snappedAsOf: nearest.asOf, snappedPrice: nearest.price } : null;
      })
      .filter((m): m is NewsMarker & { snappedAsOf: string; snappedPrice: number } => m !== null);
  }, [newsMarkers, windowed]);

  const hasEnoughRsiData = rsiData.some((d) => d.rsi !== null);

  return (
    <div className="card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                range.label === r.label ? 'bg-accent text-white' : 'text-ink-muted hover:bg-canvas-overlay'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setOverlay(overlay === 'sma' ? 'none' : 'sma')}
            disabled={!!compareIndexed}
            className={`rounded-md border px-2.5 py-1 text-xs transition-colors disabled:opacity-40 ${
              overlay === 'sma' ? 'border-warning text-warning' : 'border-border-subtle text-ink-faint hover:text-ink'
            }`}
          >
            Moving Average
          </button>
          <button
            type="button"
            onClick={() => setOverlay(overlay === 'bollinger' ? 'none' : 'bollinger')}
            disabled={!!compareIndexed}
            className={`rounded-md border px-2.5 py-1 text-xs transition-colors disabled:opacity-40 ${
              overlay === 'bollinger' ? 'border-ink-muted text-ink' : 'border-border-subtle text-ink-faint hover:text-ink'
            }`}
          >
            Bollinger Bands
          </button>
          <button
            type="button"
            onClick={() => setShowRsi((v) => !v)}
            disabled={!!compareIndexed || !hasEnoughRsiData}
            className={`rounded-md border px-2.5 py-1 text-xs transition-colors disabled:opacity-40 ${
              showRsi ? 'text-accent' : 'border-border-subtle text-ink-faint hover:text-ink'
            }`}
            style={showRsi ? { borderColor: RSI_COLOR, color: RSI_COLOR } : undefined}
          >
            RSI
          </button>
          <div className="mx-1 h-5 w-px bg-border-subtle" />
          {PROJECTION_HORIZONS.map((h) => (
            <button
              key={h.label}
              type="button"
              onClick={() => setProjectionHorizon(projectionHorizon === h.days ? null : h.days)}
              disabled={!!compareIndexed}
              className="rounded-md border px-2.5 py-1 text-xs transition-colors disabled:opacity-40"
              style={
                projectionHorizon === h.days
                  ? { borderColor: PROJECTION_COLOR, color: PROJECTION_COLOR }
                  : undefined
              }
            >
              Trend +{h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232b3b" vertical={false} />
            <XAxis dataKey="asOf" tickFormatter={formatDate} tick={{ fill: '#5b6478', fontSize: 11 }} axisLine={{ stroke: '#232b3b' }} tickLine={false} minTickGap={50} />
            <YAxis yAxisId="left" tick={{ fill: '#5b6478', fontSize: 11 }} axisLine={false} tickLine={false} width={50} domain={['auto', 'auto']} />
            {compareIndexed && (
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#5b6478', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            )}
            <Tooltip content={<ChartTooltip />} />
            {(overlay !== 'none' || compareIndexed || projection) && <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />}
            <Line yAxisId="left" type="monotone" dataKey={compareIndexed ? 'priceIndexed' : 'price'} name={compareIndexed ? `Price (indexed)` : unit} stroke={PRICE_COLOR} strokeWidth={2} dot={false} />
            {overlay === 'sma' && !compareIndexed && (
              <Line yAxisId="left" type="monotone" dataKey="sma" name="Moving avg" stroke={SMA_COLOR} strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
            )}
            {overlay === 'bollinger' && !compareIndexed && (
              <>
                <Line yAxisId="left" type="monotone" dataKey="bbUpper" name="Upper band" stroke={BAND_COLOR} strokeWidth={1} dot={false} strokeDasharray="2 3" />
                <Line yAxisId="left" type="monotone" dataKey="bbLower" name="Lower band" stroke={BAND_COLOR} strokeWidth={1} dot={false} strokeDasharray="2 3" />
              </>
            )}
            {projection && !compareIndexed && (
              <Line yAxisId="left" type="monotone" dataKey="projection" name="Trend projection" stroke={PROJECTION_COLOR} strokeWidth={2} dot={false} strokeDasharray="5 4" connectNulls />
            )}
            {compareIndexed && (
              <Line yAxisId="left" type="monotone" dataKey="compare" name={compareLabel ?? 'Compare'} stroke={COMPARE_COLOR} strokeWidth={2} dot={false} />
            )}
            {!compareIndexed &&
              resolvedMarkers.map((marker) => (
                <ReferenceDot
                  key={marker.link}
                  yAxisId="left"
                  x={marker.snappedAsOf}
                  y={marker.snappedPrice}
                  r={5}
                  fill={MARKER_COLOR}
                  stroke="#0a0e14"
                  strokeWidth={1.5}
                  isFront
                />
              ))}
            <Brush dataKey="asOf" height={22} stroke="#3b82f6" fill="#111722" tickFormatter={formatDate} travellerWidth={8} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {projection && !compareIndexed && (
        <div className="mt-3 rounded-lg border border-border-subtle p-3">
          <p className="text-xs" style={{ color: PROJECTION_COLOR }}>
            Simple trend projection: {projection.projectedChangePct !== null && (
              <span className="font-mono">
                {projection.projectedChangePct >= 0 ? '+' : ''}
                {projection.projectedChangePct.toFixed(1)}%
              </span>
            )}{' '}
            over the next {PROJECTION_HORIZONS.find((h) => h.days === projectionHorizon)?.label}, based on linear
            extrapolation of the visible history (R² = {projection.r2.toFixed(2)}).
          </p>
          <p className="mt-1 text-[10px] text-ink-faint">
            This is arithmetic on past data, not a prediction — it assumes the recent trend continues linearly,
            which real markets rarely do. Not procurement advice.
          </p>
        </div>
      )}

      {showRsi && hasEnoughRsiData && !compareIndexed && (
        <div className="mt-3 h-24 w-full border-t border-border-subtle pt-2">
          <p className="mb-1 text-[10px] uppercase tracking-wide" style={{ color: RSI_COLOR }}>
            RSI (14)
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rsiData} margin={{ top: 2, right: 8, bottom: 0, left: 0 }}>
              <XAxis dataKey="asOf" hide />
              <YAxis domain={[0, 100]} tick={{ fill: '#5b6478', fontSize: 10 }} axisLine={false} tickLine={false} width={28} ticks={[30, 70]} />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 3" />
              <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="2 3" />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="rsi" name="RSI" stroke={RSI_COLOR} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {resolvedMarkers.length > 0 && !compareIndexed && (
        <div className="mt-3 flex flex-col gap-1 border-t border-border-subtle pt-3">
          <p className="text-[10px] uppercase tracking-wide text-ink-faint">
            <span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: MARKER_COLOR }} />
            Real news headlines, snapped to nearest data point
          </p>
          {resolvedMarkers.map((marker) => (
            <a
              key={marker.link}
              href={marker.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ink-muted hover:text-accent"
            >
              {formatDate(marker.asOf)} — {marker.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
