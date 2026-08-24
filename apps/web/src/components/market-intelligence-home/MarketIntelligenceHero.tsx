import Link from 'next/link';
import { ArrowRight, Database, Newspaper, Radio } from 'lucide-react';
import { HeroGlobe } from '@/components/home/HeroGlobe';
import { ImpactBadge } from './ImpactBadge';
import type { SnapshotMeta, TopStory } from '@/types/market-intelligence-snapshot';

function formatUpdated(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function MarketIntelligenceHero({ meta, topAlert }: { meta: SnapshotMeta | undefined; topAlert: TopStory | null | undefined }) {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle bg-gradient-to-b from-[rgb(10,14,20)] to-[rgb(17,23,34)] py-14 text-[rgb(230,233,239)]">
      <div className="container-page relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">Procurement Market Intelligence</p>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
            Understand the market. Make better procurement decisions.
          </h1>
          <p className="mt-3 max-w-lg text-[rgb(139,147,167)]">
            Real-time market movements, supply chain intelligence and procurement insights that
            matter.
          </p>

          {meta && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[rgb(91,100,120)]">
              <span className="flex items-center gap-1.5">
                <Radio size={12} />
                Last updated {formatUpdated(meta.generatedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Database size={12} />
                Sources: {meta.sourcesCount}
              </span>
              <span className="flex items-center gap-1.5">
                <Newspaper size={12} />
                Markets tracked: {meta.marketsTracked}
              </span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/market-brief"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              View This Week&apos;s Market Brief
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/health-check"
              className="inline-flex items-center gap-2 rounded-lg border border-[rgb(35,43,59)] px-5 py-2.5 text-sm font-medium text-[rgb(230,233,239)] transition-colors hover:border-accent"
            >
              Check Your Procurement Health
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative">
            <div className="opacity-60">
              <HeroGlobe />
            </div>
            {topAlert && (
              <div className="absolute inset-x-0 bottom-0 rounded-xl2 border border-[rgb(35,43,59)] bg-[rgb(17,23,34)]/90 p-4 backdrop-blur">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-negative">
                  <span className="h-1.5 w-1.5 rounded-full bg-negative" />
                  Top Alert
                </div>
                <p className="text-sm font-medium text-[rgb(230,233,239)]">{topAlert.title}</p>
                <p className="mt-1 text-xs text-[rgb(139,147,167)]">{topAlert.summary}</p>
                <div className="mt-2 flex items-center justify-between">
                  <ImpactBadge level={topAlert.impact} />
                  <a href={topAlert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
                    Read more →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
