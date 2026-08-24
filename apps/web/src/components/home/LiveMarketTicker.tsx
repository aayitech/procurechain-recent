'use client';

import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useCommodityList, useFxList } from '@/hooks/useMarketIntelligence';

export function LiveMarketTicker() {
  const { data: commodities } = useCommodityList();
  const { data: fx } = useFxList();

  const items = [
    ...(commodities ?? []).map((c) => ({
      key: c.symbol,
      label: c.name,
      value: c.latestPrice,
      change: c.change7d,
      href: `/market-intelligence/commodity/${c.symbol}`,
    })),
    ...(fx ?? []).map((f) => ({
      key: f.quoteCode,
      label: `${f.baseCode}/${f.quoteCode}`,
      value: f.latestRate,
      change: f.change7d,
      href: `/market-intelligence/fx/${f.quoteCode}`,
    })),
  ];

  if (items.length === 0) return null;

  // Duplicate the list so the CSS marquee loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-border-subtle bg-canvas-overlay py-2">
      <div className="ticker-track flex w-max gap-8">
        {loop.map((item, i) => {
          const positive = (item.change ?? 0) >= 0;
          return (
            <Link
              key={`${item.key}-${i}`}
              href={item.href}
              className="flex shrink-0 items-center gap-1.5 text-xs hover:text-accent"
            >
              <span className="text-ink-muted">{item.label}</span>
              <span className="font-mono text-ink">{item.value.toFixed(2)}</span>
              {item.change !== null && (
                <span className={`flex items-center gap-0.5 font-mono ${positive ? 'text-positive' : 'text-negative'}`}>
                  {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(item.change).toFixed(1)}%
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 40s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
