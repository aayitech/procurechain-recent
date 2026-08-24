'use client';

import { useMemo } from 'react';
import { useCommodityList, useFxList } from '@/hooks/useMarketIntelligence';
import { useNews } from '@/hooks/useNews';
import { computeRiskScore } from '@/lib/risk-index';

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</span>
      <span className="mt-1 font-mono text-xl text-ink">{value}</span>
      {sub && <span className="text-[11px] text-ink-faint">{sub}</span>}
    </div>
  );
}

export function GlobalProcurementPulse() {
  const { data: commodities } = useCommodityList();
  const { data: fx } = useFxList();
  const { data: news } = useNews();

  const stats = useMemo(() => {
    const all = [...(commodities ?? []), ...(fx ?? [])];
    const changes = all.map((e) => e.change7d).filter((v): v is number => v !== null);
    const avgChange = changes.length > 0 ? changes.reduce((s, v) => s + v, 0) / changes.length : null;
    const risk = computeRiskScore(all);
    return {
      tracked: all.length,
      avgChange,
      risk,
      newsCount: news?.length ?? 0,
    };
  }, [commodities, fx, news]);

  return (
    <div className="card flex flex-wrap items-center gap-x-10 gap-y-4 p-5">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Live</span>
      </div>
      <StatTile label="Tracked Instruments" value={String(stats.tracked)} sub="commodities + FX pairs" />
      <StatTile
        label="Avg 7d Move"
        value={stats.avgChange === null ? '—' : `${stats.avgChange >= 0 ? '+' : ''}${stats.avgChange.toFixed(1)}%`}
        sub="across tracked market"
      />
      <StatTile label="Risk Index" value={stats.risk === null ? '—' : String(stats.risk)} sub="derived, Beta" />
      <StatTile label="News Today" value={String(stats.newsCount)} sub="from tracked feeds" />
    </div>
  );
}
