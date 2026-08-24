'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';
import { CostBreakdownChart } from '../CostBreakdownChart';

interface Bid {
  name: string;
  mandatoryPass: boolean;
  technical: number;
  commercial: number;
  risk: number;
}

const DEFAULT_BIDS: Bid[] = [
  { name: 'Supplier A', mandatoryPass: true, technical: 78, commercial: 70, risk: 25 },
  { name: 'Supplier B', mandatoryPass: true, technical: 65, commercial: 85, risk: 40 },
  { name: 'Supplier C', mandatoryPass: false, technical: 90, commercial: 60, risk: 15 },
];

export function BidEvaluationCalculator() {
  const [bids, setBids] = useState(DEFAULT_BIDS);
  const [weights, setWeights] = useState({ technical: 45, commercial: 40, risk: 15 });

  function updateBid<K extends keyof Bid>(index: number, key: K, value: Bid[K]) {
    setBids((prev) => prev.map((b, i) => (i === index ? { ...b, [key]: value } : b)));
  }

  const scored = useMemo(() => {
    const weightSum = weights.technical + weights.commercial + weights.risk || 1;
    return bids.map((b) => {
      if (!b.mandatoryPass) return { name: b.name, mandatoryPass: false, score: null as number | null };
      const score =
        (b.technical * weights.technical + b.commercial * weights.commercial + (100 - b.risk) * weights.risk) / weightSum;
      return { name: b.name, mandatoryPass: true, score };
    });
  }, [bids, weights]);

  const ranked = [...scored].filter((s) => s.score !== null).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const winner = ranked[0];

  return (
    <CalculatorShell
      title="Bid Evaluation Calculator"
      description="A weighted scorecard that clearly separates mandatory pass/fail compliance from scored technical, commercial, and risk criteria."
      slug="bid-evaluation"
      csvFilename="bid-evaluation.csv"
      getCsvRows={() =>
        bids.map((b, i) => ({
          supplier: b.name,
          mandatoryRequirementsMet: b.mandatoryPass ? 'Pass' : 'Fail',
          technical: b.technical,
          commercial: b.commercial,
          risk: b.risk,
          weightedScore: scored[i].score !== null ? (scored[i].score as number).toFixed(1) : 'Excluded (failed mandatory)',
        }))
      }
    >
      <div className="mb-6 grid grid-cols-3 gap-4">
        <NumberField label="Technical weight" value={weights.technical} onChange={(v) => setWeights((w) => ({ ...w, technical: v }))} suffix="%" />
        <NumberField label="Commercial weight" value={weights.commercial} onChange={(v) => setWeights((w) => ({ ...w, commercial: v }))} suffix="%" />
        <NumberField label="Risk weight" value={weights.risk} onChange={(v) => setWeights((w) => ({ ...w, risk: v }))} suffix="%" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {bids.map((bid, i) => (
          <div key={bid.name} className={`card p-4 ${!bid.mandatoryPass ? 'opacity-60' : ''}`}>
            <p className="mb-3 text-sm font-semibold text-ink">{bid.name}</p>
            <label className="mb-3 flex items-center gap-2 text-xs text-ink-muted">
              <input
                type="checkbox"
                checked={bid.mandatoryPass}
                onChange={(e) => updateBid(i, 'mandatoryPass', e.target.checked)}
                className="accent-accent"
              />
              Meets mandatory requirements
            </label>
            <div className="flex flex-col gap-3">
              <NumberField label="Technical score" value={bid.technical} onChange={(v) => updateBid(i, 'technical', v)} suffix="/100" />
              <NumberField label="Commercial score" value={bid.commercial} onChange={(v) => updateBid(i, 'commercial', v)} suffix="/100" />
              <NumberField label="Risk score" value={bid.risk} onChange={(v) => updateBid(i, 'risk', v)} suffix="/100 (lower better)" />
            </div>
            {!bid.mandatoryPass && <p className="mt-2 text-[11px] text-negative">Excluded — mandatory requirements not met</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 card p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Weighted scores (mandatory-compliant bids only)</p>
          {winner && <p className="text-xs text-positive">Highest: {winner.name}</p>}
        </div>
        {ranked.length > 0 ? (
          <CostBreakdownChart data={ranked.map((s) => ({ name: s.name, value: Number((s.score ?? 0).toFixed(1)) }))} />
        ) : (
          <p className="text-xs text-ink-faint">No bids currently meet mandatory requirements.</p>
        )}
      </div>

      <div className="mt-6 card p-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">What this means</p>
        <p className="text-sm text-ink-muted">
          Mandatory compliance is evaluated first and independently of scoring — a bid that fails it is excluded
          from ranking regardless of technical or commercial strength. Only compliant bids are compared on the
          weighted criteria you&apos;ve set.
        </p>
      </div>
    </CalculatorShell>
  );
}
