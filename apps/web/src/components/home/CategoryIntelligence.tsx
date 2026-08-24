'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { useCommodityList } from '@/hooks/useMarketIntelligence';
import { INDUSTRY_TO_CATEGORIES } from '@/lib/industries';
import type { CommodityListEntry } from '@/types/market-data';

interface ComputedCategory {
  industry: string;
  score: number;
  trend: 'up' | 'down' | 'flat';
  costDriver: string;
}

// Real, disclosed formula: average |7-day change| across the real tracked
// commodities mapped to this industry, scaled into a 0-100 "pressure"
// score. Industries with zero real tracked commodities behind them are
// shown as "coming soon" instead of a fabricated number.
function computeCategory(industry: string, commodities: CommodityListEntry[]): ComputedCategory | null {
  const categories = INDUSTRY_TO_CATEGORIES[industry] ?? [];
  const relevant = commodities.filter((c) => categories.includes(c.category) && c.change7d !== null);
  if (relevant.length === 0) return null;

  const avgAbs = relevant.reduce((sum, c) => sum + Math.abs(c.change7d as number), 0) / relevant.length;
  const avgSigned = relevant.reduce((sum, c) => sum + (c.change7d as number), 0) / relevant.length;
  const score = Math.min(100, Math.round(avgAbs * 8));
  const trend: ComputedCategory['trend'] = avgSigned > 0.5 ? 'up' : avgSigned < -0.5 ? 'down' : 'flat';
  const costDriver = [...relevant].sort((a, b) => Math.abs(b.change7d as number) - Math.abs(a.change7d as number))[0];

  return { industry, score, trend, costDriver: costDriver.name };
}

const TREND_ICON = {
  up: <ArrowUpRight size={14} className="text-positive" />,
  down: <ArrowDownRight size={14} className="text-negative" />,
  flat: <Minus size={14} className="text-ink-faint" />,
};

export function CategoryIntelligence() {
  const { data: commodities } = useCommodityList();

  const computed = useMemo(() => {
    const list = commodities ?? [];
    return Object.keys(INDUSTRY_TO_CATEGORIES).map((industry) => ({
      industry,
      result: computeCategory(industry, list),
    }));
  }, [commodities]);

  return (
    <section id="categories" className="container-page py-16">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink">Category Intelligence</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-muted">
          A cost-pressure score computed from the real commodities tracked within each
          procurement category — average 7-day movement, scaled 0-100. Categories with no real
          tracked commodities yet are shown honestly as not available, never a guessed score.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {computed.map(({ industry, result }) =>
          result ? (
            <div key={industry} className="card p-4 transition-colors hover:border-accent">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">{industry}</p>
                {TREND_ICON[result.trend]}
              </div>
              <p className="mt-2 font-mono text-lg text-ink">{result.score}</p>
              <p className="text-[11px] text-ink-faint">Cost pressure score (computed)</p>
              <p className="mt-2 text-xs text-ink-muted">Key watch item: {result.costDriver}</p>
            </div>
          ) : (
            <div key={industry} className="card flex flex-col justify-between p-4 opacity-60">
              <p className="text-sm font-medium text-ink-muted">{industry}</p>
              <p className="mt-4 text-[11px] uppercase tracking-wide text-ink-faint">Awaiting live category data</p>
            </div>
          ),
        )}
      </div>

      <Link href="/market-intelligence" className="mt-5 inline-block text-xs text-accent hover:underline">
        Explore full Market Intelligence →
      </Link>
    </section>
  );
}
