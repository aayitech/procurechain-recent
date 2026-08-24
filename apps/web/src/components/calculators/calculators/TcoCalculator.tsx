'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';
import { CostBreakdownChart } from '../CostBreakdownChart';

export function TcoCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(50000);
  const [installationCost, setInstallationCost] = useState(5000);
  const [annualMaintenance, setAnnualMaintenance] = useState(3000);
  const [annualOperating, setAnnualOperating] = useState(4000);
  const [lifespanYears, setLifespanYears] = useState(7);
  const [disposalCost, setDisposalCost] = useState(1500);

  const results = useMemo(() => {
    const maintenanceTotal = annualMaintenance * lifespanYears;
    const operatingTotal = annualOperating * lifespanYears;
    const totalTco = purchasePrice + installationCost + maintenanceTotal + operatingTotal + disposalCost;
    const perYear = lifespanYears > 0 ? totalTco / lifespanYears : 0;
    return { maintenanceTotal, operatingTotal, totalTco, perYear };
  }, [purchasePrice, installationCost, annualMaintenance, annualOperating, lifespanYears, disposalCost]);

  const breakdown = [
    { name: 'Purchase', value: purchasePrice },
    { name: 'Installation', value: installationCost },
    { name: 'Maintenance', value: results.maintenanceTotal },
    { name: 'Operating', value: results.operatingTotal },
    { name: 'Disposal', value: disposalCost },
  ];

  return (
    <CalculatorShell
      title="Total Cost of Ownership Calculator"
      description="Compare the full lifecycle cost of an asset or contract — not just the purchase price — including installation, maintenance, operating cost, and disposal."
      slug="tco"
      csvFilename="tco-calculator.csv"
      getCsvRows={() => [
        { metric: 'Purchase Price', value: purchasePrice },
        { metric: 'Installation Cost', value: installationCost },
        { metric: 'Annual Maintenance', value: annualMaintenance },
        { metric: 'Annual Operating Cost', value: annualOperating },
        { metric: 'Lifespan (years)', value: lifespanYears },
        { metric: 'Disposal Cost', value: disposalCost },
        { metric: 'Total TCO', value: results.totalTco.toFixed(2) },
        { metric: 'TCO per Year', value: results.perYear.toFixed(2) },
      ]}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField label="Purchase price" value={purchasePrice} onChange={setPurchasePrice} suffix="$" />
          <NumberField label="Installation cost" value={installationCost} onChange={setInstallationCost} suffix="$" />
          <NumberField label="Annual maintenance" value={annualMaintenance} onChange={setAnnualMaintenance} suffix="$/yr" />
          <NumberField label="Annual operating cost" value={annualOperating} onChange={setAnnualOperating} suffix="$/yr" />
          <NumberField label="Expected lifespan" value={lifespanYears} onChange={setLifespanYears} suffix="years" min={1} />
          <NumberField label="Disposal cost" value={disposalCost} onChange={setDisposalCost} suffix="$" />
        </div>

        <div>
          <div className="card p-5">
            <p className="text-xs text-ink-faint">Total Cost of Ownership</p>
            <p className="mt-1 font-mono text-3xl text-ink">
              ${results.totalTco.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              ${results.perYear.toLocaleString(undefined, { maximumFractionDigits: 0 })} / year over {lifespanYears} years
            </p>
          </div>
          <div className="card mt-4 p-5">
            <CostBreakdownChart data={breakdown} />
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
