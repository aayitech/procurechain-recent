'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { useMarketBriefList } from '@/hooks/useMarketBrief';

function formatWeekOf(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function MarketBriefArchiveList() {
  const { data, isLoading, isError } = useMarketBriefList();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card h-16 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="card p-6 text-sm text-ink-muted">
        No Market Briefs published yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((brief) => (
        <Link
          key={brief.id}
          href={`/market-brief/${brief.slug}`}
          className="card flex items-center gap-3 p-4 transition-colors hover:border-accent"
        >
          <FileText size={16} className="shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium text-ink">Week of {formatWeekOf(brief.weekOf)}</p>
            <p className="text-xs text-ink-faint">ProcureChain Procurement Market Brief</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
