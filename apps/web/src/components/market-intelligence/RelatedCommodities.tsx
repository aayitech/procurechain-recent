'use client';

import Link from 'next/link';
import { useCommodityList } from '@/hooks/useMarketIntelligence';
import { ChangeBadge } from './ChangeBadge';

export function RelatedCommodities({ currentSymbol, category }: { currentSymbol: string; category: string }) {
  const { data } = useCommodityList();
  const peers = (data ?? []).filter((c) => c.category === category && c.symbol !== currentSymbol);

  if (peers.length === 0) {
    return (
      <p className="text-xs text-ink-faint">No other tracked commodities in {category} yet.</p>
    );
  }

  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">Related — {category}</p>
      <ul className="flex flex-col gap-2">
        {peers.map((peer) => (
          <li key={peer.symbol}>
            <Link
              href={`/market-intelligence/commodity/${peer.symbol}`}
              className="flex items-center justify-between text-sm hover:text-accent"
            >
              <span className="text-ink">{peer.name}</span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-ink-muted">{peer.latestPrice.toFixed(2)}</span>
                <ChangeBadge value={peer.change7d} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
