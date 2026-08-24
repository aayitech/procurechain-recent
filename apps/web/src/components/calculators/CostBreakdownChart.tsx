'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface BreakdownItem {
  name: string;
  value: number;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-canvas-overlay px-3 py-2 text-xs shadow-card">
      <p className="text-ink-faint">{label}</p>
      <p className="mt-0.5 font-mono text-sm text-ink">{payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
    </div>
  );
}

export function CostBreakdownChart({ data }: { data: BreakdownItem[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232b3b" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#5b6478', fontSize: 11 }} axisLine={{ stroke: '#232b3b' }} tickLine={false} />
          <YAxis tick={{ fill: '#5b6478', fontSize: 11 }} axisLine={false} tickLine={false} width={56} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
