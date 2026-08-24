'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useMarketIntelligenceSnapshot } from '@/hooks/useMarketIntelligenceSnapshot';
import { MarketIntelligenceHero } from '@/components/market-intelligence-home/MarketIntelligenceHero';
import { MarketPulseSection } from '@/components/market-intelligence-home/MarketPulseSection';
import { TopStoriesSection } from '@/components/market-intelligence-home/TopStoriesSection';
import { SupplyChainWatchSection } from '@/components/market-intelligence-home/SupplyChainWatchSection';
import { AfricaProcurementWatch } from '@/components/market-intelligence-home/AfricaProcurementWatch';
import { EconomicContextSection } from '@/components/market-intelligence-home/EconomicContextSection';
import { WhatToWatchCard } from '@/components/market-intelligence-home/WhatToWatchCard';
import { HealthCheckGaugeCard } from '@/components/market-intelligence-home/HealthCheckGaugeCard';
import { RelatedToolsCard } from '@/components/market-intelligence-home/RelatedToolsCard';
import { CommodityList } from '@/components/market-intelligence/CommodityList';
import { FxList } from '@/components/market-intelligence/FxList';
import { ComingSoonCategories } from '@/components/market-intelligence/ComingSoonCategories';
import { TradeRouteConditions } from '@/components/market-intelligence/TradeRouteConditions';

export default function MarketIntelligencePage() {
  const { data, isLoading, isError } = useMarketIntelligenceSnapshot();

  return (
    <div>
      <MarketIntelligenceHero meta={data?.meta} topAlert={data?.topAlert} />

      {isLoading && (
        <div className="container-page py-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card h-28 animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className="container-page py-10">
          <div className="card p-6 text-sm text-ink-muted">
            Couldn&apos;t load live market intelligence right now — this needs the API server
            running. The commodity and FX explorer below still works from cached/live sources.
          </div>
        </div>
      )}

      {data && (
        <>
          <MarketPulseSection tiles={data.marketPulse} />

          <section className="container-page py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
              <TopStoriesSection stories={data.topStories} />
              <div className="flex flex-col gap-4 pt-10 lg:pt-0">
                <WhatToWatchCard entries={data.whatToWatch} />
                <HealthCheckGaugeCard />
                <RelatedToolsCard />
              </div>
            </div>
          </section>

          <SupplyChainWatchSection items={data.supplyChainWatch} />
          <AfricaProcurementWatch entries={data.africaWatch} />
          <EconomicContextSection entries={data.economicContext} />
        </>
      )}

      <div className="container-page py-8">
        <section id="commodities" className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-ink">Commodity Watch — All Markets</h2>
          <CommodityList />
        </section>

        <section id="fx" className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-ink">Exchange Rates (base USD)</h2>
          <FxList />
        </section>

        <section className="mb-12">
          <TradeRouteConditions />
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-ink">More categories</h2>
          <ComingSoonCategories />
        </section>
      </div>

      <div className="container-page pb-16">
        <div className="card flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="shrink-0 text-accent" />
            <p className="text-sm text-ink">
              Use your market intelligence together with a 3-minute assessment of your procurement operation.
            </p>
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
    </div>
  );
}
