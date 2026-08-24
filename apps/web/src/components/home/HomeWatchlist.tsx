'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { useCommodityList, useFxList } from '@/hooks/useMarketIntelligence';
import { useWatchlist } from '@/hooks/useWatchlist';
import { ChangeBadge } from '@/components/market-intelligence/ChangeBadge';

export function HomeWatchlist() {
  const { data: commodities } = useCommodityList();
  const { data: fx } = useFxList();
  const { ids } = useWatchlist();

  const all = [
    ...(commodities ?? []).map((c) => ({
      id: c.symbol,
      name: c.name,
      href: `/market-intelligence/commodity/${c.symbol}`,
      value: c.latestPrice,
      change7d: c.change7d,
    })),
    ...(fx ?? []).map((f) => ({
      id: f.quoteCode,
      name: `${f.baseCode}/${f.quoteCode}`,
      href: `/market-intelligence/fx/${f.quoteCode}`,
      value: f.latestRate,
      change7d: f.change7d,
    })),
  ];

  const watched = all.filter((item) => ids.includes(item.id));

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Star size={14} className="text-warning" fill="currentColor" />
        <p className="text-sm font-medium text-ink">Your Watchlist</p>
      </div>

      {watched.length === 0 ? (
        <p className="text-xs text-ink-faint">
          Star any commodity or FX pair on its detail page to pin it here.{' '}
          <Link href="/market-intelligence" className="text-accent hover:underline">
            Browse Market Intelligence →
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {watched.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="flex items-center justify-between text-sm hover:text-accent">
                <span className="text-ink">{item.name}</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-ink-muted">{item.value.toFixed(2)}</span>
                  <ChangeBadge value={item.change7d} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
