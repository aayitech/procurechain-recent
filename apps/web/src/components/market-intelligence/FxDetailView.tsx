'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFxDetail, useFxList } from '@/hooks/useMarketIntelligence';
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
import { AIMarketStory } from './AIMarketStory';
import { Tabs, type TabDef } from '@/components/shared/Tabs';
import { ComingSoonPanel } from '@/components/shared/ComingSoonPanel';

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function FxCompareSelector({ currentCode, value, onChange }: { currentCode: string; value: string; onChange: (v: string) => void }) {
  const { data } = useFxList();
  const options = (data ?? []).filter((f) => f.quoteCode !== currentCode);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border-subtle bg-canvas-raised px-2 py-1 text-xs text-ink-muted focus:border-accent focus:outline-none"
    >
      <option value="">Compare against…</option>
      {options.map((f) => (
        <option key={f.quoteCode} value={f.quoteCode}>
          {f.baseCode}/{f.quoteCode}
        </option>
      ))}
    </select>
  );
}

function FxChartWithCompare({ code, history, unit }: { code: string; history: { asOf: string; price: number }[]; unit: string }) {
  const [compareCode, setCompareCode] = useState('');
  const { data: compareData } = useFxDetail(compareCode);
  const { data: news } = useNews();

  const newsMarkers = filterNewsByKeywords(news ?? [], keywordsFrom(code, 'currency exchange'), 8).map((article) => ({
    asOf: article.publishedAt,
    title: article.title,
    link: article.link,
  }));

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <FxCompareSelector currentCode={code} value={compareCode} onChange={setCompareCode} />
      </div>
      <AdvancedPriceChart
        history={history}
        unit={unit}
        compareHistory={compareData?.history}
        compareLabel={compareData ? `${compareData.baseCode}/${compareData.quoteCode}` : undefined}
        newsMarkers={newsMarkers}
      />
    </div>
  );
}

export function FxDetailView({ code }: { code: string }) {
  const { data, isLoading, isError } = useFxDetail(code);

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
        We don&apos;t have data for USD/{code} yet.{' '}
        <Link href="/market-intelligence" className="text-accent hover:underline">
          Back to Market Intelligence
        </Link>
      </div>
    );
  }

  const pair = `${data.baseCode}/${data.quoteCode}`;

  const tabs: TabDef[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: <FxChartWithCompare code={data.quoteCode} history={data.history} unit={pair} />,
    },
    {
      id: 'news',
      label: 'News & Insights',
      content: <RelatedNews name={data.quoteCode} category="currency exchange" />,
    },
    {
      id: 'forecast',
      label: 'Forecast',
      disabled: true,
      content: (
        <ComingSoonPanel
          title="FX forecast"
          description="We won't show a forecast range until there's a real model behind it — no invented numbers."
        />
      ),
    },
    {
      id: 'historical',
      label: 'Historical Data',
      content: <HistoricalDataTable history={data.history} unit={pair} />,
    },
  ];

  return (
    <div>
      <Link href="/market-intelligence" className="text-sm text-ink-muted hover:text-ink">
        ← Market Intelligence
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Exchange Rate</p>
          <h1 className="mt-1 text-3xl font-semibold text-ink">{pair}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="font-mono text-2xl text-ink">{data.latestRate.toFixed(4)}</span>
            <ChangeBadge value={data.change7d} label={data.periodShortLabel} size="lg" />
            <span className="text-sm text-ink-faint">updated {formatTime(data.asOf)}</span>
          </div>
        </div>
        <a
          href={`/api/market-data/fx/${data.quoteCode}/export.csv`}
          className="shrink-0 rounded-lg border border-border px-4 py-2 text-sm text-ink-muted transition-colors hover:border-accent hover:text-ink"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <Tabs tabs={tabs} />
        <div className="flex flex-col gap-4">
          <AIMarketStory type="fx" symbol={data.quoteCode} />
          <WhatChangedPanel name={pair} category="currency exchange" change7d={data.change7d} periodLabel={data.periodShortLabel} />
          <KeyStatsPanel history={data.history} unit={pair} change7d={data.change7d} change30d={data.change30d} source={data.source} />
          <PriceAlertCapture symbol={data.quoteCode} name={pair} currentPrice={data.latestRate} />
          <WatchlistSidebar currentId={data.quoteCode} />
        </div>
      </div>
    </div>
  );
}
