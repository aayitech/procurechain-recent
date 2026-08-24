'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';
import { CostBreakdownChart } from '../CostBreakdownChart';

export function RfqEfficiencyCalculator() {
  const [rfqsPerMonth, setRfqsPerMonth] = useState(25);
  const [hoursPerRfq, setHoursPerRfq] = useState(6);
  const [buyers, setBuyers] = useState(4);
  const [hourlyCost, setHourlyCost] = useState(45);
  const [digitizationEfficiencyPct, setDigitizationEfficiencyPct] = useState(40);

  const results = useMemo(() => {
    const annualRfqs = rfqsPerMonth * 12;
    const currentAnnualHours = annualRfqs * hoursPerRfq;
    const currentAnnualCost = currentAnnualHours * hourlyCost;
    const potentialHoursSaved = currentAnnualHours * (digitizationEfficiencyPct / 100);
    const potentialCostSaved = potentialHoursSaved * hourlyCost;
    const hoursPerBuyer = buyers > 0 ? currentAnnualHours / buyers : 0;
    return { annualRfqs, currentAnnualHours, currentAnnualCost, potentialHoursSaved, potentialCostSaved, hoursPerBuyer };
  }, [rfqsPerMonth, hoursPerRfq, buyers, hourlyCost, digitizationEfficiencyPct]);

  return (
    <CalculatorShell
      title="RFQ Efficiency Calculator"
      description="Estimate how much buyer time and cost your current RFQ process consumes, and the opportunity if part of it were digitized."
      slug="rfq-efficiency"
      csvFilename="rfq-efficiency.csv"
      getCsvRows={() => [
        { metric: 'RFQs per year', value: results.annualRfqs },
        { metric: 'Current annual effort (hours)', value: results.currentAnnualHours.toFixed(0) },
        { metric: 'Current annual process cost', value: results.currentAnnualCost.toFixed(0) },
        { metric: 'Estimated hours saved (opportunity)', value: results.potentialHoursSaved.toFixed(0) },
        { metric: 'Estimated cost saved (opportunity)', value: results.potentialCostSaved.toFixed(0) },
      ]}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField label="RFQs per month" value={rfqsPerMonth} onChange={setRfqsPerMonth} min={0} />
          <NumberField label="Hours per RFQ" value={hoursPerRfq} onChange={setHoursPerRfq} suffix="hrs" min={0} />
          <NumberField label="Number of buyers" value={buyers} onChange={setBuyers} min={1} />
          <NumberField label="Average hourly cost" value={hourlyCost} onChange={setHourlyCost} suffix="$/hr" min={0} />
          <NumberField
            label="Expected digitization efficiency"
            value={digitizationEfficiencyPct}
            onChange={setDigitizationEfficiencyPct}
            suffix="%"
            min={0}
          />
        </div>

        <div>
          <div className="card p-5">
            <p className="text-xs text-ink-faint">Current annual RFQ process cost</p>
            <p className="mt-1 font-mono text-3xl text-ink">
              ${results.currentAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              {results.currentAnnualHours.toLocaleString(undefined, { maximumFractionDigits: 0 })} hours/year across{' '}
              {results.annualRfqs.toLocaleString()} RFQs ({results.hoursPerBuyer.toFixed(0)} hrs/buyer)
            </p>
          </div>
          <div className="card mt-4 p-5">
            <p className="text-xs text-ink-faint">Estimated opportunity — not a guaranteed outcome</p>
            <p className="mt-1 font-mono text-2xl text-positive">
              ${results.potentialCostSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              {results.potentialHoursSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })} buyer-hours/year if{' '}
              {digitizationEfficiencyPct}% of manual RFQ effort were digitized
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 card p-5">
        <p className="mb-2 text-sm font-medium text-ink">Current effort vs. estimated opportunity</p>
        <CostBreakdownChart
          data={[
            { name: 'Current annual cost', value: Math.round(results.currentAnnualCost) },
            { name: 'Estimated opportunity', value: Math.round(results.potentialCostSaved) },
          ]}
        />
      </div>

      <div className="mt-6 card p-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">What this means</p>
        <p className="text-sm text-ink-muted">
          Your team is spending an estimated {results.currentAnnualHours.toLocaleString(undefined, { maximumFractionDigits: 0 })} hours a
          year on RFQ administration — manual creation, chasing supplier responses, and comparing quotations. Digitizing part of
          that workflow is an estimated opportunity, not a guaranteed saving; actual results depend on adoption and process
          discipline.
        </p>
      </div>
    </CalculatorShell>
  );
}
