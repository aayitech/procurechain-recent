import { HeroSearch } from '@/components/home/HeroSearch';
import { HeroBackground } from '@/components/home/HeroBackground';
import { ProcurementAITeaser } from '@/components/home/ProcurementAITeaser';
import { LiveMarketPulse } from '@/components/home/LiveMarketPulse';
import { MarketSignalPanel } from '@/components/home/MarketSignalPanel';
import { CategoryIntelligence } from '@/components/home/CategoryIntelligence';
import { MarketOverviewTable } from '@/components/home/MarketOverviewTable';
import { ForecastAndSignalsPanel } from '@/components/home/ForecastAndSignalsPanel';
import { NewsFeedCard } from '@/components/home/NewsFeedCard';
import { FeaturedCalculators } from '@/components/home/FeaturedCalculators';
import { HealthCheckPromo } from '@/components/home/HealthCheckPromo';
import { MarketBriefSection } from '@/components/home/MarketBriefSection';
import { TransformCTA } from '@/components/home/TransformCTA';
import { DemoCTA } from '@/components/home/DemoCTA';

export default function HomePage() {
  return (
    <>
      {/* 01 — Hero */}
      <section className="relative overflow-hidden border-b border-border-subtle bg-gradient-to-b from-canvas-raised to-canvas py-16">
        <HeroBackground />
        <div className="container-page">
          <HeroSearch />
        </div>
      </section>

      {/* 02 — AI Procurement Copilot */}
      <ProcurementAITeaser />

      {/* 03 — Live Market Pulse */}
      <LiveMarketPulse />

      {/* 04 — Market Signals */}
      <MarketSignalPanel />

      {/* 05 — Category Intelligence */}
      <CategoryIntelligence />

      {/* 06 — Market Intelligence */}
      <section id="dashboard" className="container-page py-16">
        <h2 className="mb-1 text-2xl font-semibold text-ink">Market Intelligence</h2>
        <p className="mb-6 max-w-2xl text-sm text-ink-muted">
          Live commodity, currency, and freight data — updated continuously from real market
          sources.
        </p>
        <MarketOverviewTable />
      </section>

      {/* 07 — Forecast & Global Risk */}
      <section className="container-page py-16">
        <h2 className="mb-1 text-2xl font-semibold text-ink">Forecast & Global Risk</h2>
        <p className="mb-6 text-sm text-ink-muted">
          Computed from real, live-tracked data — not AI-generated and not a fabricated risk score.
        </p>
        <ForecastAndSignalsPanel />
      </section>

      {/* 08 — Market News */}
      <section className="container-page pb-16">
        <h2 className="mb-1 text-2xl font-semibold text-ink">Market News</h2>
        <p className="mb-6 max-w-2xl text-sm text-ink-muted">
          Real procurement, supply chain, and commodity news — pulled from live sources.
        </p>
        <div className="max-w-2xl">
          <NewsFeedCard />
        </div>
      </section>

      {/* 09 — Calculators & Benchmarking */}
      <FeaturedCalculators />

      {/* 10 — Procurement Health Check */}
      <HealthCheckPromo />

      {/* 11 — Market Brief & Reports */}
      <MarketBriefSection />

      {/* 12 — Final CTA */}
      <TransformCTA />
      <section className="container-page py-16">
        <DemoCTA />
      </section>
    </>
  );
}
