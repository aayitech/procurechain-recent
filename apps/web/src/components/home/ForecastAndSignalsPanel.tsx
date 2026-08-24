'use client';

import Link from 'next/link';
import { Globe2, TrendingUp } from 'lucide-react';
import { usePortConditions } from '@/hooks/useLogistics';
import { COUNTRY_SIGNAL_DEFS } from '@/lib/country-signals';
import { CountrySignalRow } from './CountrySignalRow';

export function ForecastAndSignalsPanel() {
  const { data: ports } = usePortConditions();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="card p-6">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp size={16} className="text-accent" />
          <p className="text-sm font-medium text-ink">Trend Projection</p>
        </div>
        <p className="text-xs text-ink-muted">
          Real available now, on any commodity page: a transparent linear-regression extrapolation
          of actual price history, with its R² fit shown alongside — not an &quot;AI forecast&quot;
          with an invented confidence score.
        </p>
        <Link href="/market-intelligence" className="mt-3 inline-block text-xs text-accent hover:underline">
          Try it on a commodity page →
        </Link>
      </div>

      <div className="card p-6">
        <div className="mb-1 flex items-center gap-2">
          <Globe2 size={16} className="text-accent" />
          <p className="text-sm font-medium text-ink">Country & Trade Route Signals</p>
        </div>
        <p className="mb-3 text-[11px] text-ink-faint">
          Combines two real, independently-tracked signals per country — FX volatility (stddev of
          daily % change, last 30 days) and live port/chokepoint weather. Not a comprehensive
          political or credit risk score — just what we actually track, shown honestly.
        </p>
        <div>
          {COUNTRY_SIGNAL_DEFS.map((def) => (
            <CountrySignalRow key={def.country} def={def} ports={ports} />
          ))}
        </div>
      </div>
    </div>
  );
}
