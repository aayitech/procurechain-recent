'use client';

import { useMemo } from 'react';
import { useMarketDashboard } from '@/hooks/useMarketDashboard';
import { computeRiskScore } from '@/lib/risk-index';
import { RiskGauge } from '@/components/shared/RiskGauge';

export function IllustrativeIndices() {
  const { data } = useMarketDashboard();

  const riskScore = useMemo(() => {
    if (!data) return null;
    return computeRiskScore([...data.fx, ...data.commodities]);
  }, [data]);

  return (
    <section className="container-page py-16">
      <h2 className="mb-1 text-2xl font-semibold text-ink">Procurement Indices</h2>
      <p className="mb-6 text-sm text-ink-muted">
        Composite indicators derived from the market data on this page — early and
        methodology-light, so treat as directional, not authoritative.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-6 p-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-ink">Procurement Risk Index</p>
              <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">
                Beta
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-faint">
              Derived from average 7-day price movement across the commodities and FX pairs
              tracked above. Not a validated risk model — a simple volatility proxy.
            </p>
          </div>
          {riskScore !== null && (
            <RiskGauge score={riskScore} label="Volatility this week" />
          )}
        </div>

        <div className="card p-6 opacity-70">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Supplier Confidence Score</p>
            <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">
              Coming soon
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-faint">
            Requires real supplier response and performance data, which this standalone platform
            doesn&apos;t have yet — shown here as planned, not with an invented number.
          </p>
        </div>
      </div>
    </section>
  );
}
