'use client';

import Link from 'next/link';
import type { CommodityListEntry, FxListEntry } from '@/types/market-data';
import { ChangeBadge } from './ChangeBadge';

interface MoverRow {
  name: string;
  href: string;
  change7d: number | null;
}

export function TopMovers({ commodities, fx }: { commodities: CommodityListEntry[]; fx: FxListEntry[] }) {
  const rows: MoverRow[] = [
    ...commodities.map((c) => ({
      name: c.name,
      href: `/market-intelligence/commodity/${c.symbol}`,
      change7d: c.change7d,
    })),
    ...fx.map((f) => ({
      name: `${f.baseCode}/${f.quoteCode}`,
      href: `/market-intelligence/fx/${f.quoteCode}`,
      change7d: f.change7d,
    })),
  ]
    .filter((r) => r.change7d !== null)
    .sort((a, b) => Math.abs(b.change7d as number) - Math.abs(a.change7d as number))
    .slice(0, 6);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Top Movers</p>
        <span className="text-[11px] text-ink-faint">7-day change</span>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-faint">Not enough data yet.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {rows.map((row) => (
            <li key={row.href}>
              <Link href={row.href} className="flex items-center justify-between text-sm hover:text-accent">
                <span className="text-ink">{row.name}</span>
                <ChangeBadge value={row.change7d} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
