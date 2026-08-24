'use client';

import Link from 'next/link';
import { useCommodityList } from '@/hooks/useMarketIntelligence';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { ChangeBadge } from './ChangeBadge';
import { CATEGORY_ORDER, UNTRACKED_BY_CATEGORY } from '@/lib/commodity-categories';
import type { CommodityListEntry } from '@/types/market-data';

function CategorySummary({ entries }: { entries: CommodityListEntry[] }) {
  const changes = entries.map((e) => e.change7d).filter((v): v is number => v !== null);
  if (changes.length === 0) return null;
  const avg = changes.reduce((sum, v) => sum + v, 0) / changes.length;
  return (
    <span className="text-xs text-ink-faint">
      {entries.length} tracked · avg 7d{' '}
      <span className={avg >= 0 ? 'text-positive' : 'text-negative'}>
        {avg >= 0 ? '+' : ''}
        {avg.toFixed(1)}%
      </span>
    </span>
  );
}

export function CommodityList() {
  const { data, isLoading, isError } = useCommodityList();
  const { convert } = useCurrencyConversion();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-ink-muted">Commodity data is temporarily unavailable.</p>;
  }

  if (data.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        No commodity prices cached yet. Set <code className="font-mono text-xs">ALPHA_VANTAGE_API_KEY</code> on
        the API and wait for the next refresh cycle.
      </p>
    );
  }

  const byCategory = new Map<string, CommodityListEntry[]>();
  for (const entry of data) {
    const list = byCategory.get(entry.category) ?? [];
    list.push(entry);
    byCategory.set(entry.category, list);
  }

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => byCategory.has(c)),
    ...Array.from(byCategory.keys()).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <div className="flex flex-col gap-10">
      {orderedCategories.map((category) => {
        const entries = byCategory.get(category) ?? [];
        const untracked = UNTRACKED_BY_CATEGORY[category] ?? [];
        return (
          <div key={category}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">{category}</h3>
              <CategorySummary entries={entries} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => {
                const converted = convert(entry.latestPrice);
                return (
                  <Link
                    key={entry.symbol}
                    href={`/market-intelligence/commodity/${entry.symbol}`}
                    className="card block p-5 transition-colors hover:border-accent"
                  >
                    <h4 className="text-base font-semibold text-ink">{entry.name}</h4>
                    <p className="mt-2 font-mono text-2xl text-ink">
                      {entry.latestPrice.toFixed(2)} <span className="text-xs text-ink-faint">{entry.currency}</span>
                    </p>
                    {!converted.isUsd && (
                      <p className="font-mono text-sm text-ink-muted">
                        ≈ {converted.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {converted.currencyCode}
                      </p>
                    )}
                    <p className="text-xs text-ink-faint">{entry.unit}</p>
                    <div className="mt-3 flex gap-4">
                      <ChangeBadge value={entry.change7d} label={entry.periodShortLabel} />
                      {entry.periodLongLabel && <ChangeBadge value={entry.change30d} label={entry.periodLongLabel} />}
                    </div>
                    <p className="mt-2 truncate text-[11px] text-ink-faint">{entry.source}</p>
                  </Link>
                );
              })}
              {untracked.map((name) => (
                <div
                  key={name}
                  className="card flex items-center justify-between p-5 text-sm text-ink-faint opacity-60"
                >
                  {name}
                  <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] uppercase tracking-wide">
                    Not tracked
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
