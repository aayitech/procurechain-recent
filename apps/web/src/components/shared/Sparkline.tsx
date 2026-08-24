'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { HistoryPoint } from '@/types/market-data';

export function Sparkline({ data, positive }: { data: HistoryPoint[]; positive: boolean }) {
  if (data.length < 2) return null;

  const color = positive ? '#22c55e' : '#ef4444';

  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line type="monotone" dataKey="price" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
