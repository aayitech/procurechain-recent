'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ExternalLink, MessageSquare, Search, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { useCommodityDetail, useCommodityList, useFxDetail, useFxList } from '@/hooks/useMarketIntelligence';
import { useWatchlist } from '@/hooks/useWatchlist';
import { AdvancedPriceChart } from './AdvancedPriceChart';
import { CATEGORY_CONTEXT } from '@/lib/commodity-categories';
import { MARKET_CATEGORIES, universeMatch, type MarketUniverseKind } from '@/lib/market-universe';
import type { CommodityListEntry, FxListEntry, HistoryPoint } from '@/types/market-data';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';

type TerminalInstrument = {
  key: string; id: string; kind: MarketUniverseKind; name: string; category: string;
  value: number | null; currency: string; sourceCurrency: string; unit: string; changeShort: number | null;
  changeLong: number | null; shortLabel: string; longLabel: string | null;
  asOf: string | null; source: string | null; sourceUrl: string | null;
  sparkline: HistoryPoint[];
};

const categoryAliases: Record<string, string> = {
  energy: 'Energy & Fuels', fuels: 'Energy & Fuels', agriculture: 'Agriculture & Food',
  fertilizers: 'Agriculture & Food', precious_metals: 'Metals',
  'economic indicators': 'Economics', fx: 'FX & Currencies',
};
const normalizeCategory = (value: string) => categoryAliases[value.toLowerCase()] ?? value;

function fromCommodity(item: CommodityListEntry): TerminalInstrument {
  const catalog = universeMatch('commodity', item.symbol, item.name);
  return { key: `commodity:${item.symbol}`, id: item.symbol, kind: 'commodity', name: catalog?.name ?? item.name, category: catalog?.category ?? normalizeCategory(item.category), value: item.latestPrice, currency: item.currency, sourceCurrency: item.currency, unit: item.unit, changeShort: item.change7d, changeLong: item.change30d, shortLabel: item.periodShortLabel, longLabel: item.periodLongLabel, asOf: item.asOf, source: item.source, sourceUrl: item.sourceUrl, sparkline: item.sparkline };
}

function fromFx(item: FxListEntry): TerminalInstrument {
  return { key: `fx:${item.baseCode}:${item.quoteCode}`, id: `${item.baseCode}-${item.quoteCode}`, kind: 'fx', name: `${item.baseCode}/${item.quoteCode}`, category: 'FX & Currencies', value: item.latestRate, currency: item.quoteCode, sourceCurrency: item.quoteCode, unit: `1 ${item.baseCode}`, changeShort: item.change7d, changeLong: item.change30d, shortLabel: item.periodShortLabel, longLabel: item.periodLongLabel, asOf: item.asOf, source: item.source, sourceUrl: item.sourceUrl, sparkline: item.sparkline };
}

const pct = (value: number | null) => value === null ? '—' : `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

function Movement({ value }: { value: number | null }) {
  if (value === null) return <span className="text-ink-faint">—</span>;
  const positive = value >= 0;
  return <span className={`inline-flex items-center gap-1 font-mono ${positive ? 'text-positive' : 'text-negative'}`}>{positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{pct(value)}</span>;
}

function movementImpact(item: TerminalInstrument) {
  const movement = Math.max(Math.abs(item.changeShort ?? 0), Math.abs(item.changeLong ?? 0));
  return movement >= 3 ? 'High' : movement >= 1 ? 'Medium' : 'Low';
}

export function MarketTerminal() {
  const searchParams = useSearchParams();
  const { data: commodities = [], isLoading: commoditiesLoading } = useCommodityList();
  const { data: fx = [], isLoading: fxLoading } = useFxList();
  const { toggle, isWatched } = useWatchlist();
  const { currencyCode, convert } = useCurrencyConversion();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof MARKET_CATEGORIES)[number]>('All');
  const [sort, setSort] = useState<'priority' | 'name' | 'movement'>('priority');
  const [selectedKey, setSelectedKey] = useState('');

  const instruments = useMemo(() => {
    const raw = [...commodities.map(fromCommodity), ...fx.map(fromFx)];
    return raw.map((item) => {
      if (item.kind !== 'commodity' || item.value === null) return item;
      const converted = convert(item.value, item.currency);
      return {
        ...item,
        value: converted.amount,
        currency: converted.currencyCode,
        sparkline: item.sparkline.map((point) => ({ ...point, price: convert(point.price, item.currency).amount })),
      };
    });
  }, [commodities, convert, currencyCode, fx]);

  const availableCategories = useMemo(() => {
    const present = new Set(instruments.map((item) => item.category));
    return MARKET_CATEGORIES.filter((item) => item === 'All' || present.has(item));
  }, [instruments]);

  const activeSources = useMemo(() => {
    const sources = new Map<string, string | null>();
    instruments.forEach((item) => {
      if (item.source) sources.set(item.source, item.sourceUrl);
    });
    return Array.from(sources.entries()).map(([name, url]) => ({ name, url }));
  }, [instruments]);

  useEffect(() => {
    if (selectedKey || instruments.length === 0) return;
    const requested = searchParams.get('instrument');
    const preferred = instruments.find((item) => item.key === requested) ?? instruments.find((item) => item.name === 'Diesel (South Africa)') ?? instruments.find((item) => item.id === 'BRENT') ?? instruments[0];
    setSelectedKey(preferred.key);
  }, [instruments, searchParams, selectedKey]);

  const selected = instruments.find((item) => item.key === selectedKey) ?? instruments[0];
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return instruments.filter((item) => (category === 'All' || item.category === category) && (!needle || `${item.name} ${item.category} ${item.kind}`.toLowerCase().includes(needle))).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'movement' ? Math.abs(b.changeShort ?? -1) - Math.abs(a.changeShort ?? -1) : Number(isWatched(b.key)) - Number(isWatched(a.key)) || a.name.localeCompare(b.name));
  }, [category, instruments, isWatched, query, sort]);
  const { data: commodityDetail } = useCommodityDetail(selected?.kind === 'commodity' ? selected.id : '');
  const { data: fxDetail } = useFxDetail(selected?.kind === 'fx' ? selected.id : '');
  const history = selected?.kind === 'commodity' ? commodityDetail?.history : selected?.kind === 'fx' ? fxDetail?.history : undefined;
  const chartHistory = useMemo(() => {
    if (!selected) return [];
    if (!history) return selected.sparkline;
    if (selected.kind !== 'commodity' || selected.currency === selected.sourceCurrency) return history;
    return history.map((point) => ({ ...point, price: convert(point.price, selected.sourceCurrency).amount }));
  }, [convert, currencyCode, history, selected]);
  const context = selected ? CATEGORY_CONTEXT[selected.category] ?? (selected.kind === 'fx' ? 'Currency movement can change the local cost of imported goods and foreign-currency contracts.' : 'This market can influence input cost, landed cost, supplier pricing, or contract timing when verified data is available.') : '';

  function selectInstrument(key: string) {
    setSelectedKey(key);
    const url = new URL(window.location.href);
    url.searchParams.set('instrument', key);
    window.history.replaceState({}, '', url);
  }

  if ((commoditiesLoading || fxLoading) && instruments.length === 0) return <div className="container-page py-10"><div className="card h-[640px] animate-pulse" /></div>;
  if (!selected) return null;

  return <div className="container-page py-6 lg:py-8">
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Interactive market terminal</p><h1 className="mt-1 text-3xl font-semibold text-ink">Market Intelligence</h1><p className="mt-1 text-sm text-ink-muted">Search and compare the full market currently covered by verified sources.</p></div><div className="flex gap-2 text-xs"><span className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-positive">{instruments.length} live instruments</span></div></div>
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">{availableCategories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium ${category === item ? 'bg-accent text-white' : 'border border-border bg-canvas-raised text-ink-muted hover:text-ink'}`}>{item}</button>)}</div>
    <main className="space-y-4">
      <section className="card overflow-hidden">
        <div className="grid gap-4 border-b border-border-subtle p-5 lg:grid-cols-[1fr_auto]"><div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => toggle(selected.key)} aria-label="Toggle watchlist"><Star size={18} className={isWatched(selected.key) ? 'fill-warning text-warning' : 'text-ink-faint'} /></button><h2 className="text-2xl font-semibold text-ink">{selected.name}</h2><span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-accent">{selected.category}</span><span className="inline-flex items-center gap-1 text-xs text-positive"><CheckCircle2 size={13} /> Verified data</span></div><p className="mt-3 font-mono text-3xl font-semibold text-ink">{selected.value?.toLocaleString(undefined, { maximumFractionDigits: 4 })}<span className="ml-2 text-sm font-normal text-ink-faint">{selected.currency} · {selected.unit}</span></p><div className="mt-2 flex flex-wrap gap-5 text-xs"><span>{selected.shortLabel} <Movement value={selected.changeShort} /></span>{selected.longLabel && <span>{selected.longLabel} <Movement value={selected.changeLong} /></span>}</div></div><div className="flex flex-col items-start gap-4 text-xs text-ink-faint lg:items-end lg:text-right"><div><p>Data period</p><p className="mt-1 text-ink">{selected.asOf ? new Date(selected.asOf).toLocaleDateString('en-ZA', { dateStyle: 'medium' }) : '—'}</p><p className="mt-3">Source</p>{selected.sourceUrl ? <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 block max-w-64 text-accent hover:underline">{selected.source}</a> : <p className="mt-1 max-w-64 text-ink">{selected.source}</p>}</div><Link href={`/assistant?instrument=${encodeURIComponent(selected.key)}&category=${encodeURIComponent(selected.category)}`} className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 font-medium text-white hover:bg-accent-hover"><MessageSquare size={14} /> Ask about this market</Link></div></div>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]"><div className="min-h-80 p-4"><AdvancedPriceChart history={chartHistory} unit={`${selected.currency} · ${selected.unit}`} />{selected.kind === 'commodity' && selected.currency !== selected.sourceCurrency && <p className="mt-1 text-center text-[10px] text-ink-faint">Displayed in {selected.currency} using the latest verified FX rate; source data is {selected.sourceCurrency}.</p>}</div><div className="border-t border-border-subtle p-5 lg:border-l lg:border-t-0"><p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Procurement impact</p><p className="mt-3 text-sm leading-6 text-ink-muted">{context}</p><p className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-faint">Data confidence</p><p className="mt-2 text-sm font-medium text-positive">Source-verified observation</p></div></div>
      </section>
      <section className="card overflow-hidden"><div className="flex flex-col gap-3 border-b border-border-subtle p-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-semibold text-ink">Market instruments</h2><p className="text-xs text-ink-faint">Search available verified markets; select any row without leaving the terminal.</p></div><div className="flex flex-wrap gap-2"><label className="flex min-w-52 items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2"><Search size={14} className="text-ink-faint" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search available commodities and FX…" className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none" /></label><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="rounded-lg border border-border bg-canvas px-3 py-2 text-xs text-ink"><option value="priority">Priority</option><option value="movement">Largest movement</option><option value="name">Name</option></select></div></div>
        <div className="max-h-[560px] overflow-y-auto md:hidden">
          {filtered.map((item) => <button key={item.key} type="button" onClick={() => selectInstrument(item.key)} className={`flex w-full items-center justify-between gap-4 border-t border-border-subtle p-4 text-left ${selected.key === item.key ? 'bg-accent/10' : 'hover:bg-canvas-overlay'}`}><span className="min-w-0"><span className="block truncate text-sm font-medium text-ink">{item.name}</span><span className="mt-1 block text-[11px] text-ink-faint">{item.category}</span></span><span className="shrink-0 text-right"><span className="block font-mono text-xs text-ink">{item.value?.toLocaleString(undefined, { maximumFractionDigits: 4 })} {item.currency}</span><span className="mt-1 block"><Movement value={item.changeShort} /></span></span></button>)}
          {filtered.length === 0 && <p className="p-8 text-center text-sm text-ink-muted">No instruments match these filters.</p>}
        </div>
        <div className="hidden max-h-[560px] overflow-auto md:block"><table className="w-full min-w-[900px] text-left text-xs"><thead className="sticky top-0 bg-canvas-overlay text-ink-faint"><tr><th className="px-4 py-3">Watch</th><th className="px-4 py-3">Instrument</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Current</th><th className="px-4 py-3">7D / short</th><th className="px-4 py-3">30D / long</th><th className="px-4 py-3">Impact</th><th className="px-4 py-3">Data period</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.key} onClick={() => selectInstrument(item.key)} className={`cursor-pointer border-t border-border-subtle transition-colors hover:bg-canvas-overlay ${selected.key === item.key ? 'bg-accent/10' : ''}`}><td className="px-4 py-3"><button type="button" onClick={(event) => { event.stopPropagation(); toggle(item.key); }} aria-label={`Toggle ${item.name} watchlist`}><Star size={14} className={isWatched(item.key) ? 'fill-warning text-warning' : 'text-ink-faint'} /></button></td><td className="px-4 py-3 font-medium text-ink">{item.name}</td><td className="px-4 py-3 text-ink-muted">{item.category}</td><td className="px-4 py-3 font-mono text-ink">{item.value === null ? '—' : `${item.value.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${item.currency}`}</td><td className="px-4 py-3"><Movement value={item.changeShort} /></td><td className="px-4 py-3"><Movement value={item.changeLong} /></td><td className="px-4 py-3 text-ink-muted">{movementImpact(item)}</td><td className="px-4 py-3 text-ink-faint">{item.asOf ? new Date(item.asOf).toLocaleDateString('en-ZA', { dateStyle: 'medium' }) : '—'}</td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-8 text-center text-sm text-ink-muted">No instruments match these filters.</p>}</div>
      </section>
      {activeSources.length > 0 && <section className="card p-5"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Active data sources</p><h2 className="mt-1 text-lg font-semibold text-ink">Verified coverage in this terminal</h2></div><Link href="/data-sources" className="text-xs font-medium text-accent hover:text-accent-hover">View source registry</Link></div><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{activeSources.map((source) => source.url ? <a key={source.name} href={source.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-canvas px-3 py-3 text-xs text-ink-muted hover:border-accent/50 hover:text-ink"><span className="truncate">{source.name}</span><ExternalLink className="h-3.5 w-3.5 shrink-0 text-accent" /></a> : <div key={source.name} className="rounded-lg border border-border-subtle bg-canvas px-3 py-3 text-xs text-ink-muted">{source.name}</div>)}</div></section>}
    </main>
  </div>;
}
