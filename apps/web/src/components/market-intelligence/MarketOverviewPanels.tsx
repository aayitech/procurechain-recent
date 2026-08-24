'use client';

import { useMemo } from 'react';
import { useCommodityList, useFxList } from '@/hooks/useMarketIntelligence';
import { computeRiskScore } from '@/lib/risk-index';
import { RiskGauge } from '@/components/shared/RiskGauge';
import { TopMovers } from './TopMovers';
import { RecentNews } from './RecentNews';
import { IndexedPerformanceChart } from './IndexedPerformanceChart';

export function MarketOverviewPanels() {
  const { data: commodities } = useCommodityList();
  const { data: fx } = useFxList();

  const riskScore = useMemo(() => {
    if (!commodities || !fx) return null;
    return computeRiskScore([...commodities, ...fx]);
  }, [commodities, fx]);

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card flex flex-col items-center justify-center p-5">
          <p className="mb-2 text-sm font-medium text-ink">Procurement Risk Index</p>
          {riskScore !== null ? (
            <RiskGauge score={riskScore} label="Derived from 7-day volatility (Beta)" />
          ) : (
            <p className="text-sm text-ink-faint">Loading…</p>
          )}
        </div>
        <TopMovers commodities={commodities ?? []} fx={fx ?? []} />
        <RecentNews />
      </div>

      {commodities && commodities.length > 0 && (
        <div className="mt-4">
          <IndexedPerformanceChart entries={commodities} />
        </div>
      )}
    </div>
  );
}
