'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkline } from '@/components/shared/Sparkline';
import { ChangeBadge } from '@/components/market-intelligence/ChangeBadge';
import type { PulseTile } from '@/types/market-intelligence-snapshot';

export function MarketPulseSection({ tiles }: { tiles: PulseTile[] }) {
  const [period, setPeriod] = useState<'short' | 'long'>('short');

  if (tiles.length === 0) return null;

  return (
    <section className="container-page py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Market Pulse</h2>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-md border border-border">
            {tiles[0] && (
              <button
                type="button"
                onClick={() => setPeriod('short')}
                className={`px-3 py-1 text-xs font-medium ${period === 'short' ? 'bg-accent text-white' : 'text-ink-muted hover:text-ink'}`}
              >
                {tiles[0].periodShortLabel}
              </button>
            )}
            {tiles.find((t) => t.periodLongLabel) && (
              <button
                type="button"
                onClick={() => setPeriod('long')}
                className={`px-3 py-1 text-xs font-medium ${period === 'long' ? 'bg-accent text-white' : 'text-ink-muted hover:text-ink'}`}
              >
                {tiles.find((t) => t.periodLongLabel)?.periodLongLabel}
              </button>
            )}
            <span
              title="90-day and 1-year comparisons aren't computed yet — shown as coming soon rather than guessed"
              className="cursor-not-allowed px-3 py-1 text-xs text-ink-faint opacity-40"
            >
              90D
            </span>
            <span
              title="90-day and 1-year comparisons aren't computed yet — shown as coming soon rather than guessed"
              className="cursor-not-allowed px-3 py-1 text-xs text-ink-faint opacity-40"
            >
              1Y
            </span>
          </div>
          <Link href="/market-intelligence#commodities" className="text-xs text-accent hover:underline">
            View all markets →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {tiles.map((tile) => {
          const isLive = tile.periodShortLabel === 'Live';
          const value = period === 'long' && tile.periodLongLabel ? tile.changeLong : tile.changeShort;
          const label = period === 'long' && tile.periodLongLabel ? tile.periodLongLabel : tile.periodShortLabel;
          return (
            <div key={tile.key} className="card p-4">
              <p className="text-xs text-ink-muted">{tile.label}</p>
              <p className="text-[10px] text-ink-faint">{tile.unit}</p>
              <p className="mt-1.5 font-mono text-lg text-ink">
                {tile.value.toLocaleString(undefined, { maximumFractionDigits: tile.value > 1000 ? 0 : 2 })}
              </p>
              {isLive ? <p className="mt-1 text-[11px] text-ink-faint">Live</p> : <ChangeBadge value={value} label={label} />}
              {tile.sparkline.length > 1 && (
                <div className="mt-1.5">
                  <Sparkline data={tile.sparkline} positive={(value ?? 0) >= 0} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
