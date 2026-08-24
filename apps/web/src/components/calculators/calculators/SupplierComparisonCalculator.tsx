'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';
import { CostBreakdownChart } from '../CostBreakdownChart';

interface Supplier {
  name: string;
  price: number;
  quality: number;
  leadTimeDays: number;
  riskScore: number;
}

const DEFAULT_SUPPLIERS: Supplier[] = [
  { name: 'Supplier A', price: 42, quality: 82, leadTimeDays: 14, riskScore: 20 },
  { name: 'Supplier B', price: 38, quality: 70, leadTimeDays: 21, riskScore: 35 },
  { name: 'Supplier C', price: 45, quality: 90, leadTimeDays: 10, riskScore: 15 },
];

function normalize(values: number[], invert: boolean): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 100);
  return values.map((v) => {
    const norm = ((v - min) / (max - min)) * 100;
    return invert ? 100 - norm : norm;
  });
}

export function SupplierComparisonCalculator() {
  const [suppliers, setSuppliers] = useState(DEFAULT_SUPPLIERS);
  const [weights, setWeights] = useState({ price: 35, quality: 30, leadTime: 15, risk: 20 });

  function updateSupplier(index: number, key: keyof Supplier, value: number) {
    setSuppliers((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));
  }

  const scored = useMemo(() => {
    const priceScores = normalize(suppliers.map((s) => s.price), true);
    const qualityScores = normalize(suppliers.map((s) => s.quality), false);
    const leadTimeScores = normalize(suppliers.map((s) => s.leadTimeDays), true);
    const riskScores = normalize(suppliers.map((s) => s.riskScore), true);
    const weightSum = weights.price + weights.quality + weights.leadTime + weights.risk || 1;

    return suppliers.map((s, i) => {
      const total =
        (priceScores[i] * weights.price +
          qualityScores[i] * weights.quality +
          leadTimeScores[i] * weights.leadTime +
          riskScores[i] * weights.risk) /
        weightSum;
      return { name: s.name, score: total };
    });
  }, [suppliers, weights]);

  const winner = [...scored].sort((a, b) => b.score - a.score)[0];

  return (
    <CalculatorShell
      title="Supplier Comparison Calculator"
      description="Weighted scoring across price, quality, lead time, and risk — set the weights that matter to your category."
      slug="supplier-comparison"
      csvFilename="supplier-comparison.csv"
      getCsvRows={() =>
        suppliers.map((s, i) => ({
          supplier: s.name,
          price: s.price,
          quality: s.quality,
          leadTimeDays: s.leadTimeDays,
          riskScore: s.riskScore,
          weightedScore: scored[i].score.toFixed(1),
        }))
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <NumberField label="Price weight" value={weights.price} onChange={(v) => setWeights((w) => ({ ...w, price: v }))} suffix="%" />
        <NumberField label="Quality weight" value={weights.quality} onChange={(v) => setWeights((w) => ({ ...w, quality: v }))} suffix="%" />
        <NumberField label="Lead time weight" value={weights.leadTime} onChange={(v) => setWeights((w) => ({ ...w, leadTime: v }))} suffix="%" />
        <NumberField label="Risk weight" value={weights.risk} onChange={(v) => setWeights((w) => ({ ...w, risk: v }))} suffix="%" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {suppliers.map((supplier, i) => (
          <div key={supplier.name} className="card p-4">
            <p className="mb-3 text-sm font-semibold text-ink">{supplier.name}</p>
            <div className="flex flex-col gap-3">
              <NumberField label="Price" value={supplier.price} onChange={(v) => updateSupplier(i, 'price', v)} suffix="$/unit" />
              <NumberField label="Quality score" value={supplier.quality} onChange={(v) => updateSupplier(i, 'quality', v)} suffix="/100" />
              <NumberField label="Lead time" value={supplier.leadTimeDays} onChange={(v) => updateSupplier(i, 'leadTimeDays', v)} suffix="days" />
              <NumberField label="Risk score" value={supplier.riskScore} onChange={(v) => updateSupplier(i, 'riskScore', v)} suffix="/100 (lower better)" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 card p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Weighted Scores</p>
          {winner && <p className="text-xs text-positive">Highest: {winner.name}</p>}
        </div>
        <CostBreakdownChart data={scored.map((s) => ({ name: s.name, value: Number(s.score.toFixed(1)) }))} />
      </div>
    </CalculatorShell>
  );
}
