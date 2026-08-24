'use client';

import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { CommodityListEntry } from '@/types/market-data';

// Fixed categorical order — never cycled/reassigned as the underlying set changes.
const SERIES_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'];

interface IndexedTooltipPayload {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
}

function IndexedTooltip({ active, payload }: IndexedTooltipPayload) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-canvas-overlay px-3 py-2 text-xs shadow-card">
      {payload.map((entry) => (
        <p key={entry.name} className="mt-0.5 font-mono" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toFixed(1)}
        </p>
      ))}
    </div>
  );
}

export function IndexedPerformanceChart({ entries }: { entries: CommodityListEntry[] }) {
  const selected = entries.filter((e) => e.sparkline.length >= 2).slice(0, 5);
  if (selected.length === 0) return null;

  const maxLength = Math.max(...selected.map((e) => e.sparkline.length));
  const data = Array.from({ length: maxLength }).map((_, i) => {
    const point: Record<string, number> = { period: i };
    for (const entry of selected) {
      const series = entry.sparkline;
      const offset = maxLength - series.length;
      if (i >= offset) {
        const base = series[0].price;
        const value = series[i - offset].price;
        point[entry.name] = base !== 0 ? (value / base) * 100 : 100;
      }
    }
    return point;
  });

  return (
    <div className="card p-5">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Price Trends Overview</p>
        <span className="text-[11px] text-ink-faint">Indexed to 100 at start of window</span>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232b3b" vertical={false} />
            <XAxis dataKey="period" tick={{ fill: '#5b6478', fontSize: 11 }} axisLine={{ stroke: '#232b3b' }} tickLine={false} tickFormatter={(v) => `T-${maxLength - 1 - v}`} />
            <YAxis tick={{ fill: '#5b6478', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<IndexedTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
            {selected.map((entry, i) => (
              <Line
                key={entry.symbol}
                type="monotone"
                dataKey={entry.name}
                stroke={SERIES_COLORS[i]}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
