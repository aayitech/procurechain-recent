'use client';

import Link from 'next/link';
import { useFxList } from '@/hooks/useMarketIntelligence';
import { ChangeBadge } from './ChangeBadge';

export function FxList() {
  const { data, isLoading, isError } = useFxList();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return <p className="text-sm text-ink-muted">Exchange rate data is temporarily unavailable.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {data.map((entry) => (
        <Link
          key={entry.quoteCode}
          href={`/market-intelligence/fx/${entry.quoteCode}`}
          className="card block p-4 transition-colors hover:border-accent"
        >
          <p className="text-xs text-ink-faint">
            {entry.baseCode} / {entry.quoteCode}
          </p>
          <p className="mt-1 font-mono text-xl text-ink">{entry.latestRate.toFixed(4)}</p>
          <div className="mt-2 flex flex-col gap-1">
            <ChangeBadge value={entry.change7d} label={entry.periodShortLabel} />
            {entry.periodLongLabel && <ChangeBadge value={entry.change30d} label={entry.periodLongLabel} />}
          </div>
          <p className="mt-2 truncate text-[11px] text-ink-faint">{entry.source}</p>
        </Link>
      ))}
    </div>
  );
}
