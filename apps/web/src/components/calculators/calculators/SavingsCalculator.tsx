'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';

export function SavingsCalculator() {
  const [baselinePrice, setBaselinePrice] = useState(18.5);
  const [negotiatedPrice, setNegotiatedPrice] = useState(16.2);
  const [annualVolume, setAnnualVolume] = useState(24000);

  const results = useMemo(() => {
    const unitSavings = baselinePrice - negotiatedPrice;
    const totalSavings = unitSavings * annualVolume;
    const pctSavings = baselinePrice !== 0 ? (unitSavings / baselinePrice) * 100 : 0;
    return { unitSavings, totalSavings, pctSavings };
  }, [baselinePrice, negotiatedPrice, annualVolume]);

  return (
    <CalculatorShell
      title="Savings Calculator"
      description="Track negotiated savings against a baseline price across your annual volume."
      slug="savings"
      csvFilename="savings-calculator.csv"
      getCsvRows={() => [
        { metric: 'Baseline Price', value: baselinePrice },
        { metric: 'Negotiated Price', value: negotiatedPrice },
        { metric: 'Annual Volume', value: annualVolume },
        { metric: 'Unit Savings', value: results.unitSavings.toFixed(2) },
        { metric: 'Savings %', value: results.pctSavings.toFixed(1) },
        { metric: 'Total Annual Savings', value: results.totalSavings.toFixed(2) },
      ]}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <NumberField label="Baseline price" value={baselinePrice} onChange={setBaselinePrice} suffix="$/unit" />
          <NumberField label="Negotiated price" value={negotiatedPrice} onChange={setNegotiatedPrice} suffix="$/unit" />
          <NumberField label="Annual volume" value={annualVolume} onChange={setAnnualVolume} suffix="units" />
        </div>

        <div className="card p-5">
          <p className="text-xs text-ink-faint">Total Annual Savings</p>
          <p className={`mt-1 font-mono text-3xl ${results.totalSavings >= 0 ? 'text-positive' : 'text-negative'}`}>
            ${Math.abs(results.totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            {results.totalSavings < 0 && ' over baseline'}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-ink-faint">Unit savings</p>
              <p className="font-mono text-lg text-ink">${results.unitSavings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Savings %</p>
              <p className="font-mono text-lg text-ink">{results.pctSavings.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
