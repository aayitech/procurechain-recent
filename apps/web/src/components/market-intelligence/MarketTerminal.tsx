'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Search, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { useCommodityDetail, useCommodityList, useFxDetail, useFxList } from '@/hooks/useMarketIntelligence';
import { AdvancedPriceChart } from './AdvancedPriceChart';
import { CATEGORY_CONTEXT } from '@/lib/commodity-categories';
import type { CommodityListEntry, FxListEntry, HistoryPoint } from '@/types/market-data';

type TerminalInstrument = {
  id: string;
  kind: 'commodity' | 'fx';
  name: string;
  category: string;
  value: number;
  currency: string;
  unit: string;
  changeShort: number | null;
  changeLong: number | null;
  shortLabel: string;
  longLabel: string | null;
  asOf: string;
  source: string;
  sourceUrl: string | null;
  sparkline: HistoryPoint[];
};

const ALL = 'All instruments';

function commodityInstrument(item: CommodityListEntry): TerminalInstrument {
  return { id: item.symbol, kind: 'commodity', name: item.name, category: item.category, value: item.latestPrice, currency: item.currency, unit: item.unit, changeShort: item.change7d, changeLong: item.change30d, shortLabel: item.periodShortLabel, longLabel: item.periodLongLabel, asOf: item.asOf, source: item.source, sourceUrl: item.sourceUrl, sparkline: item.sparkline };
}

function fxInstrument(item: FxListEntry): TerminalInstrument {
  return { id: item.quoteCode, kind: 'fx', name: `${item.baseCode}/${item.quoteCode}`, category: 'FX & Currencies', value: item.latestRate, currency: item.quoteCode, unit: `1 ${item.baseCode}`, changeShort: item.change7d, changeLong: item.change30d, shortLabel: item.periodShortLabel, longLabel: item.periodLongLabel, asOf: item.asOf, source: item.source, sourceUrl: item.sourceUrl, sparkline: item.sparkline };
}

function pct(value: number | null) {
  if (value === null) return '—';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Movement({ value }: { value: number | null }) {
  const positive = (value ?? 0) >= 0;
  return <span className={`inline-flex items-center gap-1 font-mono ${value === null ? 'text-ink-faint' : positive ? 'text-positive' : 'text-negative'}`}>{value !== null && (positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />)}{pct(value)}</span>;
}

export function MarketTerminal() {
  const { data: commodities = [], isLoading: commoditiesLoading } = useCommodityList();
  const { data: fx = [], isLoading: fxLoading } = useFxList();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);
  const [selectedKey, setSelectedKey] = useState('');
  const instruments = useMemo(() => [...commodities.map(commodityInstrument), ...fx.map(fxInstrument)], [commodities, fx]);

  useEffect(() => {
    if (!selectedKey && instruments.length > 0) {
      const preferred = instruments.find((item) => item.id === 'BRENT') ?? instruments[0];
      setSelectedKey(`${preferred.kind}:${preferred.id}`);
    }
  }, [instruments, selectedKey]);

  const selected = instruments.find((item) => `${item.kind}:${item.id}` === selectedKey) ?? instruments[0];
  const categories = useMemo(() => Array.from(new Set(instruments.map((item) => item.category))).sort(), [instruments]);
  const filtered = instruments.filter((item) => (category === ALL || item.category === category) && `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase()));
  const { data: commodityDetail } = useCommodityDetail(selected?.kind === 'commodity' ? selected.id : '');
  const { data: fxDetail } = useFxDetail(selected?.kind === 'fx' ? selected.id : '');
  const history = selected?.kind === 'commodity' ? commodityDetail?.history : fxDetail?.history;
  const context = selected ? CATEGORY_CONTEXT[selected.category] ?? (selected.kind === 'fx' ? 'Currency movement changes the local cost of imported goods and USD-denominated contracts.' : 'This benchmark can influence procurement cost, supplier pricing, and contract timing.') : '';

  if ((commoditiesLoading || fxLoading) && instruments.length === 0) return <div className="container-page py-10"><div className="card h-[640px] animate-pulse" /></div>;
  if (!selected) return <div className="container-page py-16 text-sm text-ink-muted">No verified market instruments are available.</div>;

  return (
    <div className="container-page py-6 lg:py-8">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Interactive market terminal</p><h1 className="mt-1 text-3xl font-semibold text-ink">Market Intelligence</h1><p className="mt-1 text-sm text-ink-muted">Explore verified markets and understand what moves procurement costs.</p></div>
        <div className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-xs text-ink-muted">{instruments.length} live instruments</div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="card h-fit overflow-hidden lg:sticky lg:top-20">
          <div className="border-b border-border-subtle p-3"><div className="flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2"><Search size={14} className="text-ink-faint" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search instruments..." className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-ink-faint" /></div></div>
          <nav className="max-h-[560px] overflow-y-auto p-2">
            {[ALL, ...categories].map((item) => {
              const count = item === ALL ? instruments.length : instruments.filter((entry) => entry.category === item).length;
              return <button key={item} type="button" onClick={() => setCategory(item)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${category === item ? 'bg-accent text-white' : 'text-ink-muted hover:bg-canvas-overlay hover:text-ink'}`}><span>{item}</span><span className="font-mono opacity-70">{count}</span></button>;
            })}
          </nav>
        </aside>

        <main className="min-w-0 space-y-4">
          <section className="card overflow-hidden">
            <div className="grid gap-4 border-b border-border-subtle p-5 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2"><Star size={16} className="text-warning" /><h2 className="text-2xl font-semibold text-ink">{selected.name}</h2><span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-accent">{selected.category}</span></div>
                <p className="mt-3 font-mono text-3xl font-semibold text-ink">{selected.value.toLocaleString(undefined, { maximumFractionDigits: 4 })}<span className="ml-2 text-sm font-normal text-ink-faint">{selected.currency} · {selected.unit}</span></p>
                <div className="mt-2 flex flex-wrap gap-5 text-xs"><span>{selected.shortLabel} <Movement value={selected.changeShort} /></span>{selected.longLabel && <span>{selected.longLabel} <Movement value={selected.changeLong} /></span>}</div>
              </div>
              <div className="text-xs text-ink-faint lg:text-right"><p>Last updated</p><p className="mt-1 text-ink">{dateLabel(selected.asOf)}</p><p className="mt-3">Source</p>{selected.sourceUrl ? <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 block max-w-56 text-accent hover:underline">{selected.source}</a> : <p className="mt-1 max-w-56 text-ink">{selected.source}</p>}</div>
            </div>
            <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="min-h-80 p-4"><AdvancedPriceChart history={history ?? selected.sparkline} unit={selected.unit} /></div>
              <div className="border-t border-border-subtle p-5 lg:border-l lg:border-t-0"><p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Procurement impact</p><p className="mt-3 text-sm leading-6 text-ink-muted">{context}</p><p className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-faint">Current signal</p><div className="mt-2 flex items-center gap-2"><Movement value={selected.changeShort} /><span className="text-xs text-ink-muted">verified {selected.shortLabel} movement</span></div></div>
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-border-subtle p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-ink">Market instruments</h2><p className="text-xs text-ink-faint">Select a row to update the chart without leaving this page.</p></div><div className="flex items-center gap-2 text-xs text-ink-muted"><Download size={14} /> Export from instrument detail</div></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-canvas-overlay text-ink-faint"><tr><th className="px-4 py-3">Instrument</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Movement</th><th className="px-4 py-3">Trend</th><th className="px-4 py-3">Updated</th></tr></thead><tbody>
              {filtered.map((item) => <tr key={`${item.kind}:${item.id}`} onClick={() => setSelectedKey(`${item.kind}:${item.id}`)} className={`cursor-pointer border-t border-border-subtle transition-colors hover:bg-canvas-overlay ${selectedKey === `${item.kind}:${item.id}` ? 'bg-accent/10' : ''}`}><td className="px-4 py-3 font-medium text-ink">{item.name}</td><td className="px-4 py-3 text-ink-muted">{item.category}</td><td className="px-4 py-3 font-mono text-ink">{item.value.toLocaleString(undefined, { maximumFractionDigits: 4 })} {item.currency}</td><td className="px-4 py-3"><Movement value={item.changeShort} /></td><td className="px-4 py-3">{(item.changeShort ?? 0) >= 0 ? <TrendingUp size={14} className="text-positive" /> : <TrendingDown size={14} className="text-negative" />}</td><td className="px-4 py-3 text-ink-faint">{dateLabel(item.asOf)}</td></tr>)}
            </tbody></table>{filtered.length === 0 && <p className="p-6 text-center text-sm text-ink-muted">No live instruments match this search.</p>}</div>
          </section>
        </main>
      </div>
    </div>
  );
}
