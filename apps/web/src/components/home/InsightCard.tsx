'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { useCommodityDetail, useCommodityList } from '@/hooks/useMarketIntelligence';
import { computeTrendProjection } from '@/lib/chart-stats';

export function InsightCard() {
  const { data: commodities } = useCommodityList();

  const topMover = useMemo(() => {
    if (!commodities || commodities.length === 0) return null;
    return [...commodities].sort((a, b) => Math.abs(b.change7d ?? 0) - Math.abs(a.change7d ?? 0))[0];
  }, [commodities]);

  const { data: detail } = useCommodityDetail(topMover?.symbol ?? '');
  const projection = detail ? computeTrendProjection(detail.history, 30) : null;

  return (
    <div className="card p-5">
      <div className="mb-2 flex items-center gap-2">
        <Activity size={15} className="text-accent" />
        <p className="text-sm font-medium text-ink">Market Signal</p>
        <span className="rounded-full border border-border-subtle px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-ink-faint">
          Computed, not AI
        </span>
      </div>

      {!topMover || !projection ? (
        <p className="text-xs text-ink-faint">Not enough data yet.</p>
      ) : (
        <>
          <p className="text-sm text-ink-muted">
            <Link href={`/market-intelligence/commodity/${topMover.symbol}`} className="font-medium text-ink hover:text-accent">
              {topMover.name}
            </Link>{' '}
            moved {(topMover.change7d ?? 0) >= 0 ? '+' : ''}
            {(topMover.change7d ?? 0).toFixed(1)}% over the last 7 days — the largest move we&apos;re tracking
            right now.
          </p>
          <p className="mt-2 text-xs text-ink-faint">
            Linear trend extrapolation: {projection.projectedChangePct !== null && (
              <span className="font-mono text-ink-muted">
                {projection.projectedChangePct >= 0 ? '+' : ''}
                {projection.projectedChangePct.toFixed(1)}%
              </span>
            )}{' '}
            over 30 days if the recent trend continued linearly (R² = {projection.r2.toFixed(2)}). Not a
            forecast or recommendation.
          </p>
        </>
      )}
    </div>
  );
}
