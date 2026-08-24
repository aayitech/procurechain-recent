'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCommodityList, useFxList } from '@/hooks/useMarketIntelligence';
import { usePreferencesStore } from '@/store/preferences-store';
import { COUNTRY_OPTIONS } from '@/lib/currencies';
import { Sparkline } from '@/components/shared/Sparkline';
import { ChangeBadge } from '@/components/market-intelligence/ChangeBadge';

type Tab = 'commodities' | 'currencies' | 'freight';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'commodities', label: 'Commodities' },
  { id: 'currencies', label: 'Currencies' },
  { id: 'freight', label: 'Freight' },
];

export function MarketOverviewTable() {
  const [tab, setTab] = useState<Tab>('commodities');
  const { data: commodities, isLoading: loadingCommodities } = useCommodityList();
  const { data: fx, isLoading: loadingFx } = useFxList();
  const { country, setCountry } = usePreferencesStore();

  const isLoading = tab === 'currencies' ? loadingFx : loadingCommodities;

  const commodityRows = (commodities ?? []).filter((c) => c.category !== 'Logistics & Freight');
  const freightRows = (commodities ?? []).filter((c) => c.category === 'Logistics & Freight');
  const fxRows = fx ?? [];

  return (
    <div className="card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t.id ? 'bg-accent text-white' : 'text-ink-muted hover:bg-canvas-overlay'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-md border border-border-subtle bg-canvas-raised px-2 py-1 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="">All regions</option>
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-canvas-overlay" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-ink-faint">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Price</th>
                <th className="pb-2 font-medium">7D Change</th>
                <th className="pb-2 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {tab === 'commodities' &&
                commodityRows.map((c) => (
                  <tr key={c.symbol} className="border-t border-border-subtle">
                    <td className="py-2">
                      <Link href={`/market-intelligence/commodity/${c.symbol}`} className="text-ink hover:text-accent">
                        {c.name}
                      </Link>
                      <span className="ml-1.5 text-[10px] text-ink-faint">{c.unit}</span>
                    </td>
                    <td className="py-2 font-mono text-ink-muted">{c.latestPrice.toFixed(2)}</td>
                    <td className="py-2">
                      <ChangeBadge value={c.change7d} />
                    </td>
                    <td className="py-2">
                      <Sparkline data={c.sparkline} positive={(c.change7d ?? 0) >= 0} />
                    </td>
                  </tr>
                ))}
              {tab === 'freight' &&
                freightRows.map((c) => (
                  <tr key={c.symbol} className="border-t border-border-subtle">
                    <td className="py-2">
                      <Link href={`/market-intelligence/commodity/${c.symbol}`} className="text-ink hover:text-accent">
                        {c.name}
                      </Link>
                      <span className="ml-1.5 text-[10px] text-ink-faint">{c.unit}</span>
                    </td>
                    <td className="py-2 font-mono text-ink-muted">{c.latestPrice.toFixed(2)}</td>
                    <td className="py-2">
                      <ChangeBadge value={c.change7d} />
                    </td>
                    <td className="py-2">
                      <Sparkline data={c.sparkline} positive={(c.change7d ?? 0) >= 0} />
                    </td>
                  </tr>
                ))}
              {tab === 'currencies' &&
                fxRows.map((f) => (
                  <tr key={f.quoteCode} className="border-t border-border-subtle">
                    <td className="py-2">
                      <Link href={`/market-intelligence/fx/${f.quoteCode}`} className="text-ink hover:text-accent">
                        {f.baseCode}/{f.quoteCode}
                      </Link>
                    </td>
                    <td className="py-2 font-mono text-ink-muted">{f.latestRate.toFixed(4)}</td>
                    <td className="py-2">
                      <ChangeBadge value={f.change7d} />
                    </td>
                    <td className="py-2">
                      <Sparkline data={f.sparkline} positive={(f.change7d ?? 0) >= 0} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <Link href="/market-intelligence" className="mt-3 inline-block text-xs text-accent hover:underline">
        View full market dashboard →
      </Link>
    </div>
  );
}
