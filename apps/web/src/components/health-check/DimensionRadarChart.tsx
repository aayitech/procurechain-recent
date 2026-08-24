'use client';

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import type { DimensionResult } from '@/types/health-check';

export function DimensionRadarChart({ dimensions }: { dimensions: DimensionResult[] }) {
  const data = dimensions.map((d) => ({ dimension: d.label, score: d.score }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="rgb(var(--color-border-subtle))" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: 'rgb(var(--color-ink-faint))', fontSize: 11 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'rgb(var(--color-ink-faint))', fontSize: 9 }} />
          <Radar dataKey="score" stroke="rgb(var(--color-accent))" fill="rgb(var(--color-accent))" fillOpacity={0.25} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
