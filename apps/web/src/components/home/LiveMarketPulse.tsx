'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useCommodityList, useFxList } from '@/hooks/useMarketIntelligence';
import { Sparkline } from '@/components/shared/Sparkline';

// Disclosed status thresholds — computed from the real 7d/30d change
// already returned by the API, never an invented label.
function statusFor(change: number | null): { label: string; tone: string } {
  if (change === null) return { label: 'Stable', tone: 'text-ink-faint' };
  const abs = Math.abs(change);
  if (abs >= 8) return { label: 'High Movement', tone: 'text-negative' };
  if (change >= 2) return { label: 'Rising', tone: 'text-positive' };
  if (change <= -2) return { label: 'Falling', tone: 'text-negative' };
  if (abs >= 1) return { label: 'Watch', tone: 'text-warning' };
  return { label: 'Stable', tone: 'text-ink-faint' };
}

export function LiveMarketPulse() {
  const { data: commodities } = useCommodityList();
  const { data: fx } = useFxList();

  const items = useMemo(() => {
    const nonEconomic = (commodities ?? []).filter((c) => c.category !== 'Economic Indicators');
    const picked = [
      nonEconomic.find((c) => c.symbol === 'WTI') ?? nonEconomic.find((c) => c.symbol === 'BRENT'),
      nonEconomic.find((c) => c.symbol === 'COPPER'),
      nonEconomic.find((c) => c.symbol === 'ALUMINUM'),
      nonEconomic.find((c) => c.symbol === 'IRON_ORE'),
      nonEconomic.find((c) => c.symbol === 'GOLD'),
      (fx ?? []).find((f) => f.quoteCode === 'ZAR'),
    ].filter((x): x is NonNullable<typeof x> => Boolean(x));

    return picked.map((entry) => {
      const isFx = 'quoteCode' in entry && 'latestRate' in entry;
      const label = isFx ? `USD/${entry.quoteCode}` : entry.name;
      const value = isFx ? entry.latestRate : entry.latestPrice;
      const unit = isFx ? entry.quoteCode : entry.currency;
      const href = isFx ? `/market-intelligence/fx/${entry.quoteCode}` : `/market-intelligence/commodity/${entry.symbol}`;
      const status = statusFor(entry.change7d);
      return { key: label, label, value, unit, change: entry.change7d, periodLabel: entry.periodShortLabel, sparkline: entry.sparkline, href, status };
    });
  }, [commodities, fx]);

  if (items.length === 0) return null;

  return (
    <section className="container-page py-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Live Market Pulse</h2>
          <p className="mt-1 text-sm text-ink-muted">What&apos;s moving right now, tracked continuously.</p>
        </div>
        <Link href="/market-intelligence" className="text-xs text-accent hover:underline">
          View full Market Intelligence →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => {
          const positive = (item.change ?? 0) >= 0;
          return (
            <Link key={item.key} href={item.href} className="card p-4 transition-colors hover:border-accent">
              <p className="text-xs font-medium text-ink">{item.label}</p>
              <p className="text-[10px] text-ink-faint">{item.unit}</p>
              <p className="mt-1.5 font-mono text-lg text-ink">
                {item.value.toLocaleString(undefined, { maximumFractionDigits: item.value > 1000 ? 0 : 2 })}
              </p>
              {item.change !== null && (
                <span className={`text-xs font-medium ${positive ? 'text-positive' : 'text-negative'}`}>
                  {positive ? '+' : ''}
                  {item.change.toFixed(1)}% ({item.periodLabel})
                </span>
              )}
              {item.sparkline.length > 1 && (
                <div className="mt-1.5">
                  <Sparkline data={item.sparkline} positive={positive} />
                </div>
              )}
              <span className={`mt-1.5 block text-[10px] font-medium uppercase tracking-wide ${item.status.tone}`}>
                {item.status.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
