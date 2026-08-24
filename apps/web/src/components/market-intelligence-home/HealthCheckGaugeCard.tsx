'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { loadHealthCheckResult, type StoredHealthCheckResult } from '@/lib/health-check-storage';

const SIZE = 96;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function scoreColor(score: number) {
  if (score >= 75) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

export function HealthCheckGaugeCard() {
  const [stored, setStored] = useState<StoredHealthCheckResult | null | undefined>(undefined);

  useEffect(() => {
    setStored(loadHealthCheckResult());
  }, []);

  if (stored === undefined) return <div className="card h-40 animate-pulse" />;

  if (!stored) {
    return (
      <div className="card p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-positive">How Healthy Is Your Procurement?</p>
        <p className="mb-3 text-xs text-ink-muted">Benchmark your procurement operation in 3 minutes.</p>
        <Link
          href="/health-check"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-hover"
        >
          Take Health Check
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  const score = Math.max(0, Math.min(100, stored.result.overallScore));
  const color = scoreColor(score);
  const filled = (score / 100) * CIRCUMFERENCE;

  return (
    <div className="card p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-positive">How Healthy Is Your Procurement?</p>
      <div className="flex items-center gap-3">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="rgb(var(--color-canvas-overlay))" strokeWidth={STROKE} />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          />
        </svg>
        <div>
          <p className="font-mono text-2xl text-ink">{Math.round(score)}</p>
          <p className="text-[11px] text-ink-faint">/100</p>
          <p className="text-xs font-medium" style={{ color }}>
            {stored.result.maturity.label}
          </p>
        </div>
      </div>
      <Link href="/health-check" className="mt-3 inline-block text-xs text-accent hover:underline">
        Retake Health Check →
      </Link>
    </div>
  );
}
