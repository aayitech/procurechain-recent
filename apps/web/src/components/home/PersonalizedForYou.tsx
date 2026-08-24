'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { useCommodityList } from '@/hooks/useMarketIntelligence';
import { INDUSTRY_TO_CATEGORIES } from '@/lib/industries';
import { ChangeBadge } from '@/components/market-intelligence/ChangeBadge';

export function PersonalizedForYou() {
  const user = useAuthStore((s) => s.user);
  const { data: commodities } = useCommodityList();

  if (!user || !user.industry) return null;

  const relevantCategories = INDUSTRY_TO_CATEGORIES[user.industry] ?? [];
  const relevant = (commodities ?? []).filter((c) => relevantCategories.includes(c.category));

  if (relevant.length === 0) return null;

  return (
    <section className="container-page py-10">
      <div className="card p-5">
        <p className="text-sm font-medium text-ink">
          Personalized for {user.industry}
          {user.firstName ? `, ${user.firstName}` : ''}
        </p>
        <p className="mt-1 text-xs text-ink-faint">
          Based on your profile — real commodities most relevant to {user.industry.toLowerCase()} procurement.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {relevant.slice(0, 8).map((c) => (
            <Link
              key={c.symbol}
              href={`/market-intelligence/commodity/${c.symbol}`}
              className="rounded-lg border border-border-subtle p-3 transition-colors hover:border-accent"
            >
              <p className="truncate text-xs text-ink-muted">{c.name}</p>
              <p className="mt-1 font-mono text-sm text-ink">{c.latestPrice.toFixed(2)}</p>
              <ChangeBadge value={c.change7d} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
