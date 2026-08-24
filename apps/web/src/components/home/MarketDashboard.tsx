'use client';

import Link from 'next/link';
import { useMarketDashboard } from '@/hooks/useMarketDashboard';
import { Sparkline } from '@/components/shared/Sparkline';
import { ChangeBadge } from '@/components/market-intelligence/ChangeBadge';

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MarketDashboard() {
  const { data, isLoading, isError } = useMarketDashboard();

  return (
    <section id="dashboard" className="container-page py-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Today&apos;s Procurement Dashboard</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Live exchange rates and commodity benchmarks, refreshed automatically.
          </p>
        </div>
        {data && (
          <span className="text-xs text-ink-faint">Updated {formatTime(data.generatedAt)}</span>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-28 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="card p-6 text-sm text-ink-muted">
          Market data is temporarily unavailable. The dashboard will retry automatically.
        </div>
      )}

      {data && (
        <>
          <h3 id="fx" className="mb-3 text-sm font-medium uppercase tracking-wide text-ink-faint">
            Exchange Rates (base USD)
          </h3>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.fx.length === 0 && (
              <p className="col-span-full text-sm text-ink-muted">
                No exchange rates cached yet — the refresh job runs every 6 hours; trigger a
                manual admin refresh to populate immediately.
              </p>
            )}
            {data.fx.map((entry) => (
              <div key={entry.quoteCode} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-ink-faint">USD / {entry.quoteCode}</p>
                    <p className="mt-1 font-mono text-xl text-ink">{entry.latestRate.toFixed(4)}</p>
                  </div>
                  <Sparkline data={entry.sparkline} positive={(entry.change7d ?? 0) >= 0} />
                </div>
                <ChangeBadge value={entry.change7d} label="7d" />
                <p className="mt-1 truncate text-[11px] text-ink-faint">{entry.source}</p>
              </div>
            ))}
          </div>

          <h3 id="commodities" className="mb-3 text-sm font-medium uppercase tracking-wide text-ink-faint">
            Commodity Prices
          </h3>
          {!data.commodityDataAvailable && (
            <div className="card mb-4 p-4 text-sm text-ink-muted">
              Commodity pricing requires a free Alpha Vantage API key. Set{' '}
              <code className="rounded bg-canvas-overlay px-1 py-0.5 font-mono text-xs">
                ALPHA_VANTAGE_API_KEY
              </code>{' '}
              in the API&apos;s environment to enable live commodity prices.
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.commodityDataAvailable && data.commodities.length === 0 && (
              <p className="col-span-full text-sm text-ink-muted">
                No commodity prices cached yet — the refresh job runs once daily; trigger a
                manual admin refresh to populate immediately.
              </p>
            )}
            {data.commodities.map((entry) => (
              <div key={entry.symbol} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-ink-faint">{entry.name}</p>
                    <p className="mt-1 font-mono text-xl text-ink">
                      {entry.latestPrice.toFixed(2)}{' '}
                      <span className="text-xs text-ink-faint">{entry.currency}</span>
                    </p>
                  </div>
                  <Sparkline data={entry.sparkline} positive={(entry.change7d ?? 0) >= 0} />
                </div>
                <p className="mt-1 text-[11px] text-ink-faint">{entry.unit}</p>
                <ChangeBadge value={entry.change7d} label="7d" />
                <p className="mt-1 truncate text-[11px] text-ink-faint">{entry.source}</p>
              </div>
            ))}
          </div>

          <Link
            href="/market-intelligence"
            className="mt-6 inline-block text-sm text-accent hover:underline"
          >
            View full Market Intelligence Centre →
          </Link>
        </>
      )}
    </section>
  );
}
