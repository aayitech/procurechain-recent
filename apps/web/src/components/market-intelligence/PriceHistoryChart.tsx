'use client';

import { useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { HistoryPoint } from '@/types/market-data';

const LINE_COLOR = '#3b82f6';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface TooltipPayload {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: TooltipPayload) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-canvas-overlay px-3 py-2 text-xs shadow-card">
      <p className="text-ink-faint">{label && formatDate(label)}</p>
      <p className="mt-0.5 font-mono text-sm text-ink">{payload[0].value.toFixed(2)}</p>
    </div>
  );
}

export function PriceHistoryChart({ history, unit }: { history: HistoryPoint[]; unit: string }) {
  const [showTable, setShowTable] = useState(false);
  const data = history.map((point) => ({ asOf: point.asOf, price: point.price }));

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-ink-muted">Price History</h3>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="text-xs text-ink-faint underline decoration-dotted hover:text-ink-muted"
        >
          {showTable ? 'View chart' : 'View as table'}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-ink-faint">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Price ({unit})</th>
              </tr>
            </thead>
            <tbody className="font-mono text-ink-muted">
              {[...data].reverse().map((point) => (
                <tr key={point.asOf} className="border-t border-border-subtle">
                  <td className="py-1.5">{formatDate(point.asOf)}</td>
                  <td className="py-1.5">{point.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232b3b" vertical={false} />
              <XAxis
                dataKey="asOf"
                tickFormatter={formatDate}
                tick={{ fill: '#5b6478', fontSize: 11 }}
                axisLine={{ stroke: '#232b3b' }}
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                tick={{ fill: '#5b6478', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={LINE_COLOR}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: LINE_COLOR, stroke: '#0a0e14', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
