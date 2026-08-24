'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useMarketBriefDetail } from '@/hooks/useMarketBrief';
import { MarketPulseStrip } from './MarketPulseStrip';
import { TopStoriesGrid } from './TopStoriesGrid';
import { DeepDiveSection } from './DeepDiveSection';
import { AfricaWatchSection } from './AfricaWatchSection';
import { CategoryIntelligence } from './CategoryIntelligence';
import { LogisticsFreightSection } from './LogisticsFreightSection';
import { VolatilityOutlook } from './VolatilityOutlook';

function formatWeekOf(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function parseActions(raw: string): string[] {
  const matches = [...raw.matchAll(/\d+\.\s*(.+?)(?=(?:\s*\d+\.)|$)/gs)].map((m) => m[1].trim());
  return matches.length > 0 ? matches : [raw];
}

export function MarketBriefDetailView({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useMarketBriefDetail(slug);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="card h-24 animate-pulse" />
        <div className="card h-64 animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card p-6 text-sm text-ink-muted">
        We don&apos;t have a Market Brief for &ldquo;{slug}&rdquo;.{' '}
        <Link href="/market-brief" className="text-accent hover:underline">
          Back to the archive
        </Link>
      </div>
    );
  }

  const { sections, topStories, deepDive, marketPulse, categoryIntelligence, africaWatch, logisticsFreight, volatilityOutlook } = data.content;
  const actions = parseActions(sections['Recommended Actions'] ?? '');

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/market-brief" className="text-sm text-ink-muted hover:text-ink">
        ← All Market Briefs
      </Link>

      <div className="mt-4 mb-8">
        <p className="mb-1 text-sm font-medium uppercase tracking-wide text-accent">
          ProcureChain Procurement Market Brief — Week of {formatWeekOf(data.weekOf)}
        </p>
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">What changed in procurement this week?</h1>
        <p className="mt-1 text-xs text-ink-faint">
          AI-assisted, grounded in real tracked market data and trade-press headlines. Generated{' '}
          {new Date(data.generatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <p className="text-base leading-relaxed text-ink-muted">{sections['Executive Summary']}</p>

        <TopStoriesGrid stories={topStories} />
        <MarketPulseStrip tiles={marketPulse} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink">Commodity Markets</h2>
            <p className="text-sm leading-relaxed text-ink-muted">{sections['Commodity Markets']}</p>
          </div>
          <div className="card p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink">FX</h2>
            <p className="text-sm leading-relaxed text-ink-muted">{sections['FX']}</p>
          </div>
        </div>

        <LogisticsFreightSection headline={logisticsFreight.headline} portConditions={logisticsFreight.portConditions} />
        <AfricaWatchSection entries={africaWatch} />
        <CategoryIntelligence categories={categoryIntelligence} />

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">What This Means for Procurement</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {actions.map((action, i) => (
              <div key={i} className="card p-4">
                <span className="mb-2 inline-block font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-sm text-ink-muted">{action}</p>
              </div>
            ))}
          </div>
        </div>

        <DeepDiveSection deepDive={deepDive} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink">Fuel</h2>
            <p className="text-sm leading-relaxed text-ink-muted">{sections['Fuel']}</p>
          </div>
          <div className="card p-5">
            <h2 className="mb-2 text-sm font-semibold text-ink">Procurement Risks</h2>
            <p className="text-sm leading-relaxed text-ink-muted">{sections['Procurement Risks']}</p>
          </div>
        </div>

        <VolatilityOutlook entries={volatilityOutlook} />
      </div>

      <div className="card mt-10 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="shrink-0 text-accent" />
          <p className="text-sm text-ink">What does this mean for your procurement operation?</p>
        </div>
        <Link
          href="/health-check"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Check Your Procurement Health
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
