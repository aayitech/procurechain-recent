'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCommodityDetail, useCommodityList } from '@/hooks/useMarketIntelligence';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { useNews } from '@/hooks/useNews';
import { filterNewsByKeywords, keywordsFrom } from '@/lib/related-news';
import { AdvancedPriceChart } from './AdvancedPriceChart';
import { ChangeBadge } from './ChangeBadge';
import { HistoricalDataTable } from './HistoricalDataTable';
import { RelatedNews } from './RelatedNews';
import { WatchlistSidebar } from './WatchlistSidebar';
import { KeyStatsPanel } from './KeyStatsPanel';
import { PriceAlertCapture } from './PriceAlertCapture';
import { WhatChangedPanel } from './WhatChangedPanel';
import { RelatedCommodities } from './RelatedCommodities';
import { AIMarketStory } from './AIMarketStory';
import { Tabs, type TabDef } from '@/components/shared/Tabs';
import { ComingSoonPanel } from '@/components/shared/ComingSoonPanel';
import { CATEGORY_CONTEXT } from '@/lib/commodity-categories';

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CompareSelector({ currentSymbol, value, onChange }: { currentSymbol: string; value: string; onChange: (v: string) => void }) {
  const { data } = useCommodityList();
  const options = (data ?? []).filter((c) => c.symbol !== currentSymbol);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border-subtle bg-canvas-raised px-2 py-1 text-xs text-ink-muted focus:border-accent focus:outline-none"
    >
      <option value="">Compare against…</option>
      {options.map((c) => (
        <option key={c.symbol} value={c.symbol}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

function ChartWithCompare({
  symbol,
  name,
  category,
  history,
  unit,
}: {
  symbol: string;
  name: string;
  category: string;
  history: { asOf: string; price: number }[];
  unit: string;
}) {
  const [compareSymbol, setCompareSymbol] = useState('');
  const { data: compareData } = useCommodityDetail(compareSymbol);
  const { data: news } = useNews();

  const newsMarkers = filterNewsByKeywords(news ?? [], keywordsFrom(name, category), 8).map((article) => ({
    asOf: article.publishedAt,
    title: article.title,
    link: article.link,
  }));

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <CompareSelector currentSymbol={symbol} value={compareSymbol} onChange={setCompareSymbol} />
      </div>
      <AdvancedPriceChart
        history={history}
        unit={unit}
        compareHistory={compareData?.history}
        compareLabel={compareData?.name}
        newsMarkers={newsMarkers}
      />
    </div>
  );
}

export function CommodityDetailView({ symbol }: { symbol: string }) {
  const { data, isLoading, isError } = useCommodityDetail(symbol);
  const { convert } = useCurrencyConversion();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="card h-32 animate-pulse" />
        <div className="card h-64 animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card p-6 text-sm text-ink-muted">
        We don&apos;t have data for &ldquo;{symbol}&rdquo; yet.{' '}
        <Link href="/market-intelligence" className="text-accent hover:underline">
          Back to Market Intelligence
        </Link>
      </div>
    );
  }

  const tabs: TabDef[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <ChartWithCompare
          symbol={data.symbol}
          name={data.name}
          category={data.category}
          history={data.history}
          unit={data.unit}
        />
      ),
    },
    {
      id: 'news',
      label: 'News & Insights',
      content: <RelatedNews name={data.name} category={data.category} />,
    },
    {
      id: 'supply-demand',
      label: 'Supply & Demand',
      disabled: true,
      content: (
        <ComingSoonPanel
          title="Supply & demand analysis"
          description="Needs production, inventory, and consumption data we don't have a source for yet."
        />
      ),
    },
    {
      id: 'risk',
      label: 'Risk Reports',
      disabled: true,
      content: (
        <ComingSoonPanel
          title="Commodity-specific risk reports"
          description="Planned for a future module — will surface real supply-chain risk signals, not invented scores."
        />
      ),
    },
    {
      id: 'forecast',
      label: 'Forecast',
      disabled: true,
      content: (
        <ComingSoonPanel
          title="Price forecast"
          description="We won't show a forecast range until there's a real model behind it — no invented numbers."
        />
      ),
    },
    {
      id: 'historical',
      label: 'Historical Data',
      content: <HistoricalDataTable history={data.history} unit={data.unit} />,
    },
  ];

  return (
    <div>
      <Link href="/market-intelligence" className="text-sm text-ink-muted hover:text-ink">
        ← Market Intelligence
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">{data.category}</p>
          <h1 className="mt-1 text-3xl font-semibold text-ink">{data.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="font-mono text-2xl text-ink">
              {data.latestPrice.toFixed(2)} <span className="text-sm text-ink-faint">{data.currency}</span>
            </span>
            {(() => {
              const converted = convert(data.latestPrice);
              return !converted.isUsd ? (
                <span className="font-mono text-lg text-ink-muted">
                  ≈ {converted.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {converted.currencyCode}
                </span>
              ) : null;
            })()}
            <ChangeBadge value={data.change7d} label={data.periodShortLabel} size="lg" />
            <span className="text-sm text-ink-faint">
              {data.unit} · updated {formatTime(data.asOf)}
            </span>
          </div>
          {(() => {
            const converted = convert(1);
            return !converted.isUsd && converted.rate ? (
              <p className="mt-1 text-xs text-ink-faint">
                Exchange rate: 1 USD = {converted.rate.toFixed(4)} {converted.currencyCode}
                {converted.rateAsOf && ` · updated ${formatTime(converted.rateAsOf)}`}
              </p>
            ) : null;
          })()}
        </div>
        <a
          href={`/api/market-data/commodities/${data.symbol}/export.csv`}
          className="shrink-0 rounded-lg border border-border px-4 py-2 text-sm text-ink-muted transition-colors hover:border-accent hover:text-ink"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <Tabs tabs={tabs} />
        <div className="flex flex-col gap-4">
          <AIMarketStory type="commodity" symbol={data.symbol} />
          <WhatChangedPanel name={data.name} category={data.category} change7d={data.change7d} periodLabel={data.periodShortLabel} />
          {CATEGORY_CONTEXT[data.category] && (
            <div className="card p-4">
              <p className="mb-1.5 text-[11px] uppercase tracking-wide text-ink-faint">Why it matters</p>
              <p className="text-xs text-ink-muted">{CATEGORY_CONTEXT[data.category]}</p>
            </div>
          )}
          <KeyStatsPanel history={data.history} unit={data.unit} change7d={data.change7d} change30d={data.change30d} source={data.source} />
          <div className="card p-4">
            <RelatedCommodities currentSymbol={data.symbol} category={data.category} />
          </div>
          <PriceAlertCapture symbol={data.symbol} name={data.name} currentPrice={data.latestPrice} />
          <WatchlistSidebar currentId={data.symbol} />
        </div>
      </div>
    </div>
  );
}
