'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';

export function WorkingCapitalCalculator() {
  const [annualSpend, setAnnualSpend] = useState(2400000);
  const [currentTermsDays, setCurrentTermsDays] = useState(30);
  const [newTermsDays, setNewTermsDays] = useState(60);

  const results = useMemo(() => {
    const dailySpend = annualSpend / 365;
    const cashFreed = dailySpend * (newTermsDays - currentTermsDays);
    return { dailySpend, cashFreed };
  }, [annualSpend, currentTermsDays, newTermsDays]);

  return (
    <CalculatorShell
      title="Working Capital Calculator"
      description="See how changing supplier payment terms ripples through working capital."
      slug="working-capital"
      csvFilename="working-capital.csv"
      getCsvRows={() => [
        { metric: 'Annual Spend', value: annualSpend },
        { metric: 'Current Payment Terms', value: `${currentTermsDays} days` },
        { metric: 'New Payment Terms', value: `${newTermsDays} days` },
        { metric: 'Working Capital Impact', value: results.cashFreed.toFixed(2) },
      ]}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <NumberField label="Annual spend with this supplier" value={annualSpend} onChange={setAnnualSpend} suffix="$" />
          <NumberField label="Current payment terms" value={currentTermsDays} onChange={setCurrentTermsDays} suffix="days" />
          <NumberField label="New payment terms" value={newTermsDays} onChange={setNewTermsDays} suffix="days" />
        </div>

        <div className="card p-5">
          <p className="text-xs text-ink-faint">
            {results.cashFreed >= 0 ? 'Working capital freed up' : 'Additional working capital required'}
          </p>
          <p className={`mt-1 font-mono text-3xl ${results.cashFreed >= 0 ? 'text-positive' : 'text-negative'}`}>
            ${Math.abs(results.cashFreed).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="mt-2 text-xs text-ink-faint">
            Based on ${results.dailySpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}/day average spend and a{' '}
            {newTermsDays - currentTermsDays >= 0 ? '+' : ''}
            {newTermsDays - currentTermsDays}-day change in payment terms.
          </p>
        </div>
      </div>
    </CalculatorShell>
  );
}
