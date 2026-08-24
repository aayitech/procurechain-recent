'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';
import { CostBreakdownChart } from '../CostBreakdownChart';

export function ProcurementRoiCalculator() {
  const [annualSpend, setAnnualSpend] = useState(5_000_000);
  const [expectedSavingsPct, setExpectedSavingsPct] = useState(6);
  const [technologyCost, setTechnologyCost] = useState(60_000);
  const [implementationCost, setImplementationCost] = useState(40_000);

  const results = useMemo(() => {
    const annualSavings = annualSpend * (expectedSavingsPct / 100);
    const totalInvestment = technologyCost + implementationCost;
    const netBenefitYear1 = annualSavings - totalInvestment;
    const roiPct = totalInvestment > 0 ? (netBenefitYear1 / totalInvestment) * 100 : 0;
    const paybackMonths = annualSavings > 0 ? (totalInvestment / annualSavings) * 12 : Infinity;
    return { annualSavings, totalInvestment, netBenefitYear1, roiPct, paybackMonths };
  }, [annualSpend, expectedSavingsPct, technologyCost, implementationCost]);

  return (
    <CalculatorShell
      title="Procurement ROI Calculator"
      description="Estimate the return on investment for a procurement technology or transformation initiative — assumptions labeled clearly, nothing guaranteed."
      slug="procurement-roi"
      csvFilename="procurement-roi.csv"
      getCsvRows={() => [
        { metric: 'Annual procurement spend', value: annualSpend },
        { metric: 'Expected savings %', value: expectedSavingsPct },
        { metric: 'Technology cost', value: technologyCost },
        { metric: 'Implementation cost', value: implementationCost },
        { metric: 'Estimated annual savings', value: results.annualSavings.toFixed(0) },
        { metric: 'Total investment', value: results.totalInvestment.toFixed(0) },
        { metric: 'Net benefit (year 1)', value: results.netBenefitYear1.toFixed(0) },
        { metric: 'ROI %', value: results.roiPct.toFixed(1) },
        { metric: 'Payback period (months)', value: Number.isFinite(results.paybackMonths) ? results.paybackMonths.toFixed(1) : 'n/a' },
      ]}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField label="Annual procurement spend" value={annualSpend} onChange={setAnnualSpend} suffix="$" min={0} />
          <NumberField label="Expected savings" value={expectedSavingsPct} onChange={setExpectedSavingsPct} suffix="%" min={0} />
          <NumberField label="Technology cost" value={technologyCost} onChange={setTechnologyCost} suffix="$" min={0} />
          <NumberField label="Implementation cost" value={implementationCost} onChange={setImplementationCost} suffix="$" min={0} />
        </div>

        <div>
          <div className="card p-5">
            <p className="text-xs text-ink-faint">Year 1 ROI</p>
            <p className={`mt-1 font-mono text-3xl ${results.roiPct >= 0 ? 'text-positive' : 'text-negative'}`}>
              {results.roiPct >= 0 ? '+' : ''}
              {results.roiPct.toFixed(0)}%
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              Payback: {Number.isFinite(results.paybackMonths) ? `${results.paybackMonths.toFixed(1)} months` : 'not reached within savings assumptions'}
            </p>
          </div>
          <div className="card mt-4 p-5">
            <p className="text-xs text-ink-faint">Net benefit (year 1)</p>
            <p className="mt-1 font-mono text-2xl text-ink">
              ${results.netBenefitYear1.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              ${results.annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} estimated savings − $
              {results.totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })} total investment
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 card p-5">
        <p className="mb-2 text-sm font-medium text-ink">Estimated savings vs. total investment</p>
        <CostBreakdownChart
          data={[
            { name: 'Estimated annual savings', value: Math.round(results.annualSavings) },
            { name: 'Total investment', value: Math.round(results.totalInvestment) },
          ]}
        />
      </div>

      <div className="mt-6 card p-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">What this means</p>
        <p className="text-sm text-ink-muted">
          All figures depend entirely on the savings % assumption you enter — this calculator does not know your
          category mix or negotiation leverage. Use it to stress-test different savings scenarios, not as a
          guaranteed business case.
        </p>
      </div>
    </CalculatorShell>
  );
}
