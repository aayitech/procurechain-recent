'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Lock, Target } from 'lucide-react';
import { loadHealthCheckResult, type StoredHealthCheckResult } from '@/lib/health-check-storage';
import { DimensionRadarChart } from '@/components/health-check/DimensionRadarChart';

const ROADMAP_TIERS = ['Industry benchmark', 'Country benchmark', 'Regional benchmark', 'Company-size benchmark', 'Top-quartile comparison'];

function scoreColor(score: number) {
  if (score >= 75) return 'text-positive';
  if (score >= 40) return 'text-warning';
  return 'text-negative';
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Target size={22} />
      </div>
      <h1 className="text-2xl font-semibold text-ink sm:text-3xl">How does your procurement operation perform?</h1>
      <p className="mt-3 text-ink-muted">
        Understand your procurement maturity across the capabilities that matter most. Take the
        Procurement Health Check to see your personal benchmark here.
      </p>
      <Link
        href="/health-check"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Check Your Procurement Health
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export function BenchmarkingView() {
  const [stored, setStored] = useState<StoredHealthCheckResult | null | undefined>(undefined);

  useEffect(() => {
    setStored(loadHealthCheckResult());
  }, []);

  if (stored === undefined) {
    return <div className="card mx-auto h-64 max-w-3xl animate-pulse" />;
  }

  if (!stored) {
    return <EmptyState />;
  }

  const { result, savedAt } = stored;
  const strongest = [...result.dimensions].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">Your Procurement Performance</p>
        <p className={`mt-2 text-6xl font-semibold ${scoreColor(result.overallScore)}`}>{Math.round(result.overallScore)}</p>
        <p className="text-sm text-ink-faint">out of 100</p>
        <span className="mt-3 inline-block rounded-full bg-canvas-overlay px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink">
          {result.maturity.label}
        </span>
        <p className="mt-2 text-xs text-ink-faint">
          From your Health Check on {new Date(savedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <p className="mb-2 text-sm font-medium text-ink">Your seven dimensions</p>
          <DimensionRadarChart dimensions={result.dimensions} />
        </div>
        <div className="card flex flex-col justify-center gap-3 p-5">
          {result.dimensions.map((d) => (
            <div key={d.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink-muted">{d.label}</span>
                <span className="font-mono text-ink">{Math.round(d.score)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-overlay">
                <div className={`h-full rounded-full ${d.key === strongest.key ? 'bg-positive' : 'bg-accent'}`} style={{ width: `${d.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {strongest && (
        <div className="mt-6 card flex items-center gap-3 p-4">
          <Award size={16} className="shrink-0 text-positive" />
          <p className="text-sm text-ink-muted">
            Your strongest capability is <span className="font-medium text-ink">{strongest.label}</span> at{' '}
            <span className="font-mono text-ink">{Math.round(strongest.score)}</span>.
          </p>
        </div>
      )}

      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-ink">Your optimization opportunities</p>
        <div className="flex flex-col gap-3">
          {result.topOpportunities.map((opp, i) => (
            <div key={opp.key} className="card p-5">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-sm font-medium text-ink">
                  {i === 0 ? 'Biggest opportunity: ' : i === 1 ? 'Second opportunity: ' : 'Third opportunity: '}
                  {opp.label}
                </p>
                <span className="font-mono text-sm text-ink-muted">{Math.round(opp.score)} / 100</span>
              </div>
              <p className="text-xs text-ink-muted">{opp.opportunityLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {opp.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1 text-xs text-ink-muted hover:border-accent hover:text-ink"
                  >
                    {link.label}
                    <ArrowRight size={11} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center gap-1.5">
          <Lock size={13} className="text-ink-faint" />
          <p className="text-sm font-medium text-ink">Comparative benchmarks</p>
        </div>
        <p className="mb-3 text-xs text-ink-faint">
          We only show a comparison once there&apos;s enough verified assessment data to make it meaningful —
          never invented numbers.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAP_TIERS.map((tier) => (
            <div key={tier} className="card p-4 text-xs text-ink-faint">
              <p className="mb-1 font-medium text-ink-muted">{tier}</p>
              Coming soon — available once sufficient verified data exists.
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-10 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink">Ready to see the details behind your score?</p>
        <Link
          href="/health-check"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Retake the Health Check
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
