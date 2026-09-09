'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, Eye, FileText, Newspaper, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Sparkline } from '@/components/shared/Sparkline';
import { useMarketDashboard } from '@/hooks/useMarketDashboard';
import { useNews } from '@/hooks/useNews';
import { useAuthStore } from '@/store/auth-store';

type BriefSignal = { key: string; name: string; value: number; unit: string; change7d: number | null; change30d: number | null; history: Array<{ asOf: string; price: number }>; href: string; source: string; asOf: string };
const formatValue = (amount: number) => new Intl.NumberFormat('en-ZA', { maximumFractionDigits: amount >= 100 ? 0 : 2 }).format(amount);

export function VisualMarketBrief() {
  const { data, isLoading } = useMarketDashboard();
  const { data: news } = useNews();
  const user = useAuthStore((state) => state.user);
  const signals = useMemo<BriefSignal[]>(() => {
    if (!data) return [];
    const priorities = [...(user?.marketProfile?.commodities ?? []), ...(user?.marketProfile?.procurementCategories ?? []), ...(user?.country === 'South Africa' ? ['diesel', 'steel', 'polyethylene', 'usd/zar', 'freight'] : [])].map((item) => item.toLowerCase());
    const relevance = (item: BriefSignal) => priorities.some((priority) => item.name.toLowerCase().includes(priority)) ? 1 : 0;
    return [
      ...data.commodities.map((item) => ({ key: item.symbol, name: item.name, value: item.latestPrice, unit: item.unit, change7d: item.change7d, change30d: item.change30d, history: item.sparkline, href: `/market-intelligence?instrument=${encodeURIComponent(`commodity:${item.symbol}`)}`, source: item.source, asOf: item.asOf })),
      ...data.fx.map((item) => ({ key: `${item.baseCode}/${item.quoteCode}`, name: `${item.baseCode}/${item.quoteCode}`, value: item.latestRate, unit: '', change7d: item.change7d, change30d: item.change30d, history: item.sparkline, href: `/market-intelligence?instrument=${encodeURIComponent(`fx:${item.baseCode}:${item.quoteCode}`)}`, source: item.source, asOf: item.asOf })),
    ].filter((item) => Number.isFinite(item.value)).sort((a, b) => relevance(b) - relevance(a) || Math.abs(b.change7d ?? 0) - Math.abs(a.change7d ?? 0));
  }, [data, user]);
  const stories = (news ?? []).filter((story) => story.title && story.link).slice(0, 4);
  const heroImage = stories.find((story) => story.imageUrl)?.imageUrl;
  const date = new Intl.DateTimeFormat('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const greeting = user?.firstName ? `Good morning, ${user.firstName}.` : 'Your procurement market brief';

  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <section className="border-b border-slate-800 bg-slate-900/60" style={heroImage ? { backgroundImage: `linear-gradient(90deg, rgba(2,6,23,.98), rgba(2,6,23,.74)), url(${heroImage})`, backgroundPosition: 'center', backgroundSize: 'cover' } : undefined}>
      <div className="container-page py-9"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Market Brief</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">{greeting}</h1><p className="mt-2 text-sm text-slate-300">Your Procurement Market Brief</p><p className="mt-3 text-xs text-slate-400">{[user?.country, user?.industry, date].filter(Boolean).join(' · ')}</p></div>
    </section>
    <div className="container-page space-y-6 py-7">
      {isLoading && <div className="h-36 animate-pulse rounded-2xl bg-slate-900" />}
      {signals.length > 0 && <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-sm text-slate-400">Today&apos;s key signals</p><h2 className="text-xl font-semibold">{signals.slice(0, 3).filter((item) => item.change7d !== null).length} signals require your attention</h2></div><Link href="/market-intelligence" className="flex items-center gap-1 text-sm text-blue-400">View terminal <ArrowRight className="h-4 w-4" /></Link></div><div className="grid gap-3 md:grid-cols-3">{signals.slice(0, 3).map((item) => { const positive = (item.change7d ?? 0) >= 0; return <Link href={item.href} key={item.key} className="rounded-xl border border-slate-800 bg-slate-950/65 p-4 hover:border-blue-500/60"><div className="flex items-start justify-between"><p className="font-semibold">{item.name}</p>{positive ? <TrendingUp className="h-4 w-4 text-emerald-400" /> : <TrendingDown className="h-4 w-4 text-rose-400" />}</div><div className="mt-3 flex items-end justify-between gap-3"><div><p className="text-lg font-bold">{formatValue(item.value)} <span className="text-xs font-normal text-slate-500">{item.unit}</span></p><p className={`mt-1 text-sm font-semibold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>{item.change7d == null ? 'Latest value' : `${positive ? '+' : ''}${item.change7d.toFixed(2)}% (7D)`}</p><p className="mt-1 text-xs text-slate-500">30D {item.change30d == null ? '—' : `${item.change30d >= 0 ? '+' : ''}${item.change30d.toFixed(2)}%`}</p></div>{item.history.length > 1 && <Sparkline data={item.history} positive={positive} />}</div><p className="mt-3 truncate border-t border-slate-800 pt-2 text-[10px] text-slate-500">{item.source} · {new Date(item.asOf).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}</p></Link>; })}</div></section>}
      <section className={`grid gap-5 ${signals.length > 0 && stories.length > 0 ? 'lg:grid-cols-[1.1fr_1.6fr]' : ''}`}>
        {signals.length > 0 && <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h2 className="text-lg font-semibold">Market movers</h2><div className="mt-3 grid grid-cols-[1.5rem_1fr_auto_auto] gap-3 border-b border-slate-800 pb-2 text-[10px] uppercase tracking-wide text-slate-500"><span>#</span><span>Instrument</span><span>7D</span><span>30D</span></div><div className="divide-y divide-slate-800">{signals.slice(0, 7).map((item, index) => <Link href={item.href} key={`mover-${item.key}`} className="grid grid-cols-[1.5rem_1fr_auto_auto] items-center gap-3 py-3 text-sm"><span className="text-xs text-slate-600">{index + 1}</span><span className="truncate text-slate-300">{item.name}</span><span className={(item.change7d ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{item.change7d == null ? '—' : `${item.change7d >= 0 ? '+' : ''}${item.change7d.toFixed(2)}%`}</span><span className={(item.change30d ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{item.change30d == null ? '—' : `${item.change30d >= 0 ? '+' : ''}${item.change30d.toFixed(2)}%`}</span></Link>)}</div></div>}
        {stories.length > 0 && <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-semibold"><Newspaper className="h-5 w-5 text-blue-400" /> Top stories</h2><Link href="/knowledge-centre" className="text-sm text-blue-400">Knowledge centre</Link></div><div className="space-y-3">{stories.map((story, index) => <a href={story.link} target="_blank" rel="noreferrer" key={story.link} className="grid gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 hover:border-blue-500/50 sm:grid-cols-[8rem_1fr]">{story.imageUrl ? <div className="h-24 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${story.imageUrl})` }} /> : <div className="flex h-24 items-center justify-center rounded-lg bg-slate-900"><Newspaper className="h-6 w-6 text-slate-600" /></div>}<div><p className="line-clamp-2 text-sm font-semibold">{story.title}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{story.description}</p><p className="mt-2 text-[11px] text-slate-500">{story.source}{index === 0 ? ' · Lead story' : ''}</p></div></a>)}</div></div>}
      </section>
      {(signals.length > 0 || stories.length > 0) && <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h2 className="text-lg font-semibold">What this means for procurement</h2><div className="mt-4 grid gap-3 md:grid-cols-3"><BriefAction icon={Eye} title="Monitor exposure">Review the largest market movements against active purchasing categories.</BriefAction><BriefAction icon={FileText} title="Review contracts">Check indexation and currency clauses where tracked prices have moved materially.</BriefAction><BriefAction icon={CalendarDays} title="Plan ahead">Use verified source detail before making timing or supplier decisions.</BriefAction></div></section>}
    </div>
  </main>;
}

function BriefAction({ icon: Icon, title, children }: { icon: typeof Eye; title: string; children: string }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><Icon className="h-5 w-5 text-blue-400" /><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-1 text-sm text-slate-400">{children}</p></div>;
}
