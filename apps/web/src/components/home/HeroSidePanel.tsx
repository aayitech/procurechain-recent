'use client';

import { useMemo } from 'react';
import { useCommodityList, useFxList } from '@/hooks/useMarketIntelligence';
import { computeRiskScore } from '@/lib/risk-index';
import { TopMovers } from '@/components/market-intelligence/TopMovers';

function riskBand(score: number): { label: string; color: string } {
  if (score < 25) return { label: 'Low', color: 'text-positive' };
  if (score < 50) return { label: 'Moderate', color: 'text-warning' };
  return { label: 'Elevated', color: 'text-negative' };
}

export function HeroSidePanel() {
  const { data: commodities } = useCommodityList();
  const { data: fx } = useFxList();

  const riskScore = useMemo(() => {
    if (!commodities || !fx) return null;
    return computeRiskScore([...commodities, ...fx]);
  }, [commodities, fx]);

  return (
    <div className="flex flex-col gap-4">
      <div className="card p-4">
        <p className="text-xs text-ink-faint">Procurement Risk Index</p>
        {riskScore === null ? (
          <p className="mt-1 text-sm text-ink-faint">Loading…</p>
        ) : (
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl text-ink">{riskScore}</span>
            <span className="text-xs text-ink-faint">/100</span>
            <span className={`text-sm font-medium ${riskBand(riskScore).color}`}>{riskBand(riskScore).label}</span>
          </div>
        )}
        <p className="mt-1 text-[10px] text-ink-faint">Derived from real 7-day volatility (Beta)</p>
      </div>
      <TopMovers commodities={commodities ?? []} fx={fx ?? []} />
    </div>
  );
}
