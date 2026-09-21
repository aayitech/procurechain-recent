'use client';

import Link from 'next/link';
import { Activity, ArrowRight, BarChart3, Bot, Boxes, Building2, CheckCircle2, Droplets, Factory, Globe2, Leaf, MapPin, Newspaper, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { useMarketDashboard } from '@/hooks/useMarketDashboard';
import { useNews } from '@/hooks/useNews';
import { useAuthStore } from '@/store/auth-store';
import { Sparkline } from '@/components/shared/Sparkline';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { resolveIndustryCategories } from '@/lib/industries';
import { profileKeywords, profileRelevance } from '@/lib/profile-personalization';

type Signal = { id: string; kind: 'commodity' | 'fx'; label: string; value: number; currency: string; unit: string; change: number | null; history: Array<{ asOf: string; price: number }>; href: string; category: string };
const categoryMeta: Record<string, { label: string; icon: typeof Droplets }> = {
  energy: { label: 'Energy & Fuels', icon: Droplets }, metals: { label: 'Metals', icon: Building2 }, agriculture: { label: 'Agriculture', icon: Leaf },
  fertilizers: { label: 'Fertilizers', icon: Factory }, precious_metals: { label: 'Precious Metals', icon: Boxes }, fx: { label: 'FX & Currencies', icon: Globe2 },
};
const number = (value: number) => new Intl.NumberFormat('en-ZA', { maximumFractionDigits: value >= 100 ? 0 : 2 }).format(value);

export function ExecutiveHome() {
  const { data, isLoading } = useMarketDashboard();
  const { data: news } = useNews();
  const user = useAuthStore((state) => state.user);
  const { currencyCode, convert } = useCurrencyConversion();
  const industryCategories = useMemo(() => resolveIndustryCategories(user?.industry), [user?.industry]);
  const personalizationKeywords = useMemo(() => profileKeywords(user), [user]);
  const signals = useMemo<Signal[]>(() => {
    if (!data) return [];
    const relevance = (item: Signal) => profileRelevance(`${item.label} ${item.category}`, personalizationKeywords);
    return [
      ...data.commodities.map((item) => ({ id: item.symbol, kind: 'commodity' as const, label: item.name, value: item.latestPrice, currency: item.currency, unit: item.unit, change: item.change30d, history: item.sparkline, href: `/market-intelligence?instrument=${encodeURIComponent(`commodity:${item.symbol}`)}`, category: item.category })),
      ...data.fx.map((item) => ({ id: `${item.baseCode}-${item.quoteCode}`, kind: 'fx' as const, label: `${item.baseCode}/${item.quoteCode}`, value: item.latestRate, currency: item.quoteCode, unit: `per ${item.baseCode}`, change: item.change30d, history: item.sparkline, href: `/market-intelligence?instrument=${encodeURIComponent(`fx:${item.baseCode}:${item.quoteCode}`)}`, category: 'fx' })),
    ].filter((item) => Number.isFinite(item.value)).sort((a, b) => relevance(b) - relevance(a) || Math.abs(b.change ?? 0) - Math.abs(a.change ?? 0));
  }, [data, personalizationKeywords]);
  const displaySignals = useMemo(() => signals.map((item) => {
    if (item.kind === 'fx') return item;
    const converted = convert(item.value, item.currency);
    return { ...item, value: converted.amount, currency: converted.currencyCode };
  }), [convert, currencyCode, signals]);
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    displaySignals.forEach((item) => counts.set(item.category, (counts.get(item.category) ?? 0) + 1));
    return Array.from(counts.entries()).map(([key, count]) => ({ key, count, ...(categoryMeta[key] ?? { label: key.replaceAll('_', ' '), icon: Package }) })).sort((a, b) => b.count - a.count);
  }, [displaySignals]);
  const trackedIndustryCategories = useMemo(() => {
    const liveCategories = new Set(displaySignals.map((item) => item.category.toLowerCase()));
    return industryCategories.filter((category) => liveCategories.has(category.toLowerCase()));
  }, [displaySignals, industryCategories]);
  const stories = useMemo(() => (news ?? []).filter((story) => story.title && story.link).map((story, index) => ({ story, index, score: profileRelevance(`${story.title} ${story.description}`, personalizationKeywords) })).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 3).map(({ story }) => story), [news, personalizationKeywords]);
  const heroImage = stories.find((story) => story.imageUrl)?.imageUrl;
  const greeting = user?.firstName?.trim() ? `Good morning, ${user.firstName.trim()}.` : 'Market intelligence, at a glance.';
  const today = new Intl.DateTimeFormat('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <section className="relative overflow-hidden border-b border-slate-800" style={heroImage ? { backgroundImage: `linear-gradient(90deg, rgba(2,6,23,.96), rgba(2,6,23,.75), rgba(2,6,23,.93)), url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      <div className="container-page relative py-10 lg:py-14"><div className="max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">ProcureChain Insight Hub</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{greeting}</h1>
        <p className="mt-3 text-base text-slate-300 sm:text-lg">Smarter procurement starts with trusted market signals, current prices and useful context.</p><p className="mt-2 text-sm text-slate-400">{today}</p>
      </div>
      {(user?.country || user?.industry || user?.jobTitle) && <div className="mt-7 flex flex-wrap gap-2">{[user.country, user.industry, user.jobTitle].filter(Boolean).map((item) => <span key={item} className="rounded-lg border border-slate-700 bg-slate-900/75 px-3 py-2 text-xs text-slate-300">{item}</span>)}</div>}
      </div>
    </section>
    <div id="dashboard" className="container-page space-y-8 py-8">
      {isLoading && <div className="flex h-24 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-5 text-sm text-slate-400"><Activity className="h-5 w-5 animate-pulse text-blue-400" />Loading verified market coverage…</div>}
      {!isLoading && <section aria-label="Personal market overview" className={`grid gap-3 sm:grid-cols-2 ${trackedIndustryCategories.length > 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        <OverviewStat icon={MapPin} label="Your market" value={user?.country || 'Global'} detail={user?.marketProfile?.currency || 'Market currency'} />
        {trackedIndustryCategories.length > 0 && <OverviewStat icon={Factory} label="Your industry" value={user?.industry ?? ''} detail={`${trackedIndustryCategories.length} tracked ${trackedIndustryCategories.length === 1 ? 'category' : 'categories'}`} />}
        <OverviewStat icon={Activity} label="Market coverage" value={`${displaySignals.length} live`} detail="Verified instruments" />
        <OverviewStat icon={CheckCircle2} label="Data status" value="Verified sources" detail="No estimated market values" positive />
      </section>}
      {displaySignals.length > 0 && <section><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Today&apos;s key signals</p><h2 className="mt-1 text-xl font-semibold">Markets moving now</h2></div><Link href="/market-intelligence" className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300">Open terminal <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{displaySignals.slice(0, 5).map((item) => { const positive = (item.change ?? 0) >= 0; return <Link key={`${item.category}-${item.id}`} href={item.href} className="group rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-blue-500/60"><div className="flex items-start justify-between gap-2"><p className="truncate text-sm font-semibold text-slate-200">{item.label}</p>{positive ? <TrendingUp className="h-4 w-4 text-emerald-400" /> : <TrendingDown className="h-4 w-4 text-rose-400" />}</div><p className="mt-3 text-xl font-bold">{number(item.value)} <span className="text-xs font-normal text-slate-500">{item.currency}{item.unit ? ` · ${item.unit}` : ''}</span></p><p className={`mt-1 text-sm font-semibold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>{item.change == null ? 'Current' : `${positive ? '+' : ''}${item.change.toFixed(2)}% (30D)`}</p>{item.history.length > 1 && <div className="mt-3"><Sparkline data={item.history} positive={positive} /></div>}</Link>; })}</div>
      </section>}
      {(stories.length > 0 || displaySignals.length > 0) && <section className={`grid gap-5 ${stories.length > 0 && displaySignals.length > 0 ? 'lg:grid-cols-[1.7fr_1fr]' : ''}`}>
        {stories.length > 0 && <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5"><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-semibold"><Newspaper className="h-5 w-5 text-blue-400" /> Today&apos;s top stories</h2><Link href="/market-brief" className="text-xs font-medium text-blue-400">View market brief</Link></div><div className="grid gap-4 md:grid-cols-3">{stories.map((story) => <a key={story.link} href={story.link} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-950/65">{story.imageUrl && <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${story.imageUrl})` }} />}<div className="p-4"><p className="line-clamp-3 text-sm font-semibold leading-5 group-hover:text-blue-300">{story.title}</p><p className="mt-3 text-xs text-slate-500">{story.source}</p></div></a>)}</div></div>}
        {displaySignals.length > 0 && <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-5"><h2 className="flex items-center gap-2 text-lg font-semibold"><BarChart3 className="h-5 w-5 text-blue-400" /> Market watch</h2><div className="mt-4 divide-y divide-slate-800">{displaySignals.slice(0, 6).map((item) => <Link key={`watch-${item.category}-${item.id}`} href={item.href} className="flex items-center justify-between gap-3 py-3 text-sm hover:text-blue-300"><span className="truncate text-slate-300">{item.label}</span><span className={`font-semibold ${(item.change ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{item.change == null ? `${number(item.value)} ${item.currency}` : `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%`}</span></Link>)}</div></div>}
      </section>}
      <section className="rounded-2xl border border-blue-500/30 bg-blue-950/30 p-5 sm:p-7"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600"><Bot className="h-6 w-6" /></div><div><h2 className="text-lg font-semibold">Ask the Market</h2><p className="mt-1 text-sm text-slate-400">Explore procurement implications using the market data available in ProcureChain.</p><p className="mt-2 text-xs text-blue-300">Try asking: Which tracked markets are moving most?</p></div></div><Link href="/assistant" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500">Open Ask the Market <ArrowRight className="h-4 w-4" /></Link></div></section>
      {categories.length > 0 && <section><div className="mb-4"><p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Explore by category</p><h2 className="mt-1 text-xl font-semibold">Available market coverage</h2></div><div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">{categories.map(({ key, label, count, icon: Icon }) => <Link key={key} href="/market-intelligence" className="rounded-xl border border-slate-800 bg-slate-900/65 p-4 text-center transition hover:border-blue-500/60"><Icon className="mx-auto h-6 w-6 text-blue-400" /><p className="mt-3 text-sm font-semibold capitalize">{label}</p><p className="mt-1 text-xs text-slate-500">{count} live {count === 1 ? 'instrument' : 'instruments'}</p></Link>)}</div></section>}
    </div>
  </main>;
}

function OverviewStat({ icon: Icon, label, value, detail, positive = false }: { icon: typeof MapPin; label: string; value: string; detail: string; positive?: boolean }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"><div className="flex items-center gap-2 text-xs text-slate-500"><Icon className={`h-4 w-4 ${positive ? 'text-emerald-400' : 'text-blue-400'}`} />{label}</div><p className="mt-3 truncate text-base font-semibold text-slate-100">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}
