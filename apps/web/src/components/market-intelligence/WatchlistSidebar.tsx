'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { useCommodityList, useFxList } from '@/hooks/useMarketIntelligence';
import { useWatchlist } from '@/hooks/useWatchlist';
import { ChangeBadge } from './ChangeBadge';

export function WatchlistSidebar({ currentId }: { currentId: string }) {
  const { data: commodities } = useCommodityList();
  const { data: fx } = useFxList();
  const { ids, toggle, isWatched } = useWatchlist();

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
  const rest = all.filter((item) => !ids.includes(item.id) && item.id !== currentId).slice(0, 8);

  return (
    <div className="card p-4">
      <p className="mb-3 text-sm font-medium text-ink">Watchlist</p>

      {watched.length > 0 && (
        <ul className="mb-3 flex flex-col gap-2 border-b border-border-subtle pb-3">
          {watched.map((item) => (
            <WatchRow key={item.id} item={item} watched onToggle={() => toggle(item.id)} />
          ))}
        </ul>
      )}

      <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">
        {watched.length > 0 ? 'Add more' : 'Click the star to add'}
      </p>
      <ul className="flex flex-col gap-2">
        {rest.map((item) => (
          <WatchRow key={item.id} item={item} watched={isWatched(item.id)} onToggle={() => toggle(item.id)} />
        ))}
      </ul>
    </div>
  );
}

interface WatchItem {
  id: string;
  name: string;
  href: string;
  value: number;
  change7d: number | null;
}

function WatchRow({ item, watched, onToggle }: { item: WatchItem; watched: boolean; onToggle: () => void }) {
  return (
    <li className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        aria-label={watched ? `Remove ${item.name} from watchlist` : `Add ${item.name} to watchlist`}
        className={watched ? 'text-warning' : 'text-ink-faint hover:text-ink'}
      >
        <Star size={14} fill={watched ? 'currentColor' : 'none'} />
      </button>
      <Link href={item.href} className="flex flex-1 items-center justify-between text-xs hover:text-accent">
        <span className="text-ink">{item.name}</span>
        <span className="flex items-center gap-2">
          <span className="font-mono text-ink-muted">{item.value.toFixed(2)}</span>
          <ChangeBadge value={item.change7d} />
        </span>
      </Link>
    </li>
  );
}
