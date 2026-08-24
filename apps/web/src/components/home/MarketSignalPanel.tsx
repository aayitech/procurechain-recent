'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { useCommodityDetail, useCommodityList } from '@/hooks/useMarketIntelligence';
import { CATEGORY_CONTEXT } from '@/lib/commodity-categories';

export function MarketSignalPanel() {
  const { data: commodities } = useCommodityList();

  const topMover = useMemo(() => {
    if (!commodities || commodities.length === 0) return null;
    return [...commodities].sort((a, b) => Math.abs(b.change7d ?? 0) - Math.abs(a.change7d ?? 0))[0];
  }, [commodities]);

  const { data: detail } = useCommodityDetail(topMover?.symbol ?? '');

  if (!topMover || topMover.change7d === null) {
    return null;
  }

  const positive = topMover.change7d >= 0;
  const whyItMatters = CATEGORY_CONTEXT[topMover.category];

  return (
    <section className="container-page py-12">
      <div className="card overflow-hidden p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr]">
          <div className={`flex flex-col justify-center p-8 ${positive ? 'bg-positive/5' : 'bg-negative/5'}`}>
            <div className="mb-2 flex items-center gap-1.5">
              <Zap size={14} className="text-accent" />
              <p className="text-xs font-medium uppercase tracking-wide text-accent">Market Signal</p>
              <span className="rounded-full border border-border-subtle px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-ink-faint">
                Computed, not AI
              </span>
            </div>
            <p className="text-sm text-ink-muted">
              {topMover.name} moved sharply {detail?.periodShortLabel ? `this ${detail.periodShortLabel === '7d' ? 'week' : detail.periodShortLabel}` : ''}
            </p>
            <p className={`mt-1 font-mono text-4xl font-semibold ${positive ? 'text-positive' : 'text-negative'}`}>
              {positive ? '+' : ''}
              {topMover.change7d.toFixed(1)}%
            </p>
            <p className="mt-2 text-xs text-ink-faint">The largest real move we&apos;re currently tracking.</p>
          </div>
          <div className="flex flex-col justify-center gap-4 p-8">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">Why it matters</p>
              <p className="text-sm text-ink-muted">
                {whyItMatters ?? `${topMover.category} pricing is a real, tracked input cost category for many procurement teams.`}
              </p>
            </div>
            <Link
              href={`/market-intelligence/commodity/${topMover.symbol}`}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Analyse Market Signal
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
