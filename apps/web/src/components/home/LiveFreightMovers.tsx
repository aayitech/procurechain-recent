'use client';

import Link from 'next/link';
import { useCommodityList } from '@/hooks/useMarketIntelligence';
import { ChangeBadge } from '@/components/market-intelligence/ChangeBadge';

export function LiveFreightMovers() {
  const { data } = useCommodityList();
  const freight = (data ?? []).filter((c) => c.category === 'Logistics & Freight');

  if (freight.length === 0) return null;

  return (
    <div className="card p-5">
      <p className="mb-3 text-sm font-medium text-ink">Live Freight Movers</p>
      <ul className="flex flex-col gap-3">
        {freight.map((entry) => (
          <li key={entry.symbol}>
            <Link
              href={`/market-intelligence/commodity/${entry.symbol}`}
              className="flex items-center justify-between text-sm hover:text-accent"
            >
              <div>
                <p className="text-ink">{entry.name}</p>
                <p className="text-[11px] text-ink-faint">{entry.unit}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-ink">{entry.latestPrice.toFixed(2)}</p>
                <ChangeBadge value={entry.change7d} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] text-ink-faint">{freight[0].source}</p>
    </div>
  );
}
