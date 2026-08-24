'use client';

import Link from 'next/link';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { useCommodityList, useFxList } from '@/hooks/useMarketIntelligence';
import { computeVolatility } from '@/lib/chart-stats';
import type { HistoryPoint } from '@/types/market-data';

// Diverging scale: negative (red) → neutral gray → positive (green).
// Two hues + a neutral midpoint, per standard diverging-color practice.
const NEGATIVE = [239, 68, 68];
const NEUTRAL = [35, 43, 59];
const POSITIVE = [34, 197, 94];
const CLAMP_PCT = 8;

function lerp(a: number[], b: number[], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function heatColor(change: number | null): string {
  if (change === null) return `rgb(${NEUTRAL.join(', ')})`;
  const clamped = Math.max(-CLAMP_PCT, Math.min(CLAMP_PCT, change));
  if (clamped >= 0) return lerp(NEUTRAL, POSITIVE, clamped / CLAMP_PCT);
  return lerp(NEUTRAL, NEGATIVE, -clamped / CLAMP_PCT);
}

// Real, computed from actual volatility — not an invented "AI" score.
function volatilityLabel(sparkline: HistoryPoint[]): string {
  const vol = computeVolatility(sparkline);
  if (vol === null) return '';
  if (vol < 1) return 'Low vol';
  if (vol < 3) return 'Med vol';
  return 'High vol';
}

function MiniSparkline({ data }: { data: HistoryPoint[] }) {
  if (data.length < 2) return null;
  return (
    <div className="h-5 w-full opacity-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 1, right: 1, bottom: 1, left: 1 }}>
          <Line type="monotone" dataKey="price" stroke="white" strokeWidth={1.25} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MarketHeatmap() {
  const { data: commodities } = useCommodityList();
  const { data: fx } = useFxList();

  const tiles = [
    ...(commodities ?? []).map((c) => ({
      key: c.symbol,
      label: c.name,
      price: c.latestPrice,
      change: c.change7d,
      sparkline: c.sparkline,
      href: `/market-intelligence/commodity/${c.symbol}`,
    })),
    ...(fx ?? []).map((f) => ({
      key: f.quoteCode,
      label: `${f.baseCode}/${f.quoteCode}`,
      price: f.latestRate,
      change: f.change7d,
      sparkline: f.sparkline,
      href: `/market-intelligence/fx/${f.quoteCode}`,
    })),
  ];

  if (tiles.length === 0) {
    return (
      <div className="card p-6 text-sm text-ink-muted">Heatmap will populate once market data loads.</div>
    );
  }

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Market Heatmap</p>
        <span className="text-[11px] text-ink-faint">7-day change · click for detail</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.key}
            href={tile.href}
            style={{ backgroundColor: heatColor(tile.change) }}
            className="flex flex-col justify-between gap-1.5 rounded-md p-2.5 transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between gap-1">
              <span className="text-[11px] font-medium leading-tight text-white/90">{tile.label}</span>
              <span className="shrink-0 text-[9px] uppercase tracking-wide text-white/70">
                {volatilityLabel(tile.sparkline)}
              </span>
            </div>
            <MiniSparkline data={tile.sparkline} />
            <div className="flex items-end justify-between">
              <span className="font-mono text-[11px] text-white/80">{tile.price.toFixed(2)}</span>
              <span className="font-mono text-xs text-white">
                {tile.change === null ? '—' : `${tile.change >= 0 ? '+' : ''}${tile.change.toFixed(1)}%`}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
