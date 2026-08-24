'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';
import { CostBreakdownChart } from '../CostBreakdownChart';

export function LandedCostCalculator() {
  const [unitPrice, setUnitPrice] = useState(25);
  const [quantity, setQuantity] = useState(1000);
  const [freightCost, setFreightCost] = useState(2200);
  const [insurancePct, setInsurancePct] = useState(0.5);
  const [dutyPct, setDutyPct] = useState(8);
  const [otherFees, setOtherFees] = useState(400);

  const results = useMemo(() => {
    const goodsValue = unitPrice * quantity;
    const insurance = goodsValue * (insurancePct / 100);
    const duty = (goodsValue + freightCost + insurance) * (dutyPct / 100);
    const totalLandedCost = goodsValue + freightCost + insurance + duty + otherFees;
    const perUnit = quantity > 0 ? totalLandedCost / quantity : 0;
    return { goodsValue, insurance, duty, totalLandedCost, perUnit };
  }, [unitPrice, quantity, freightCost, insurancePct, dutyPct, otherFees]);

  const breakdown = [
    { name: 'Goods', value: results.goodsValue },
    { name: 'Freight', value: freightCost },
    { name: 'Insurance', value: results.insurance },
    { name: 'Duty', value: results.duty },
    { name: 'Other fees', value: otherFees },
  ];

  return (
    <CalculatorShell
      title="Landed Cost Calculator"
      description="Work out the true cost of an imported shipment once freight, insurance, duty, and fees are added on top of goods value."
      slug="landed-cost"
      csvFilename="landed-cost-calculator.csv"
      getCsvRows={() => [
        { metric: 'Unit Price', value: unitPrice },
        { metric: 'Quantity', value: quantity },
        { metric: 'Goods Value', value: results.goodsValue.toFixed(2) },
        { metric: 'Freight Cost', value: freightCost },
        { metric: 'Insurance', value: results.insurance.toFixed(2) },
        { metric: 'Duty', value: results.duty.toFixed(2) },
        { metric: 'Other Fees', value: otherFees },
        { metric: 'Total Landed Cost', value: results.totalLandedCost.toFixed(2) },
        { metric: 'Landed Cost per Unit', value: results.perUnit.toFixed(2) },
      ]}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField label="Unit price" value={unitPrice} onChange={setUnitPrice} suffix="$" />
          <NumberField label="Quantity" value={quantity} onChange={setQuantity} min={0} />
          <NumberField label="Freight cost (total)" value={freightCost} onChange={setFreightCost} suffix="$" />
          <NumberField label="Insurance" value={insurancePct} onChange={setInsurancePct} suffix="%" />
          <NumberField label="Customs duty" value={dutyPct} onChange={setDutyPct} suffix="%" />
          <NumberField label="Other fees" value={otherFees} onChange={setOtherFees} suffix="$" />
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-5">
              <p className="text-xs text-ink-faint">Total Landed Cost</p>
              <p className="mt-1 font-mono text-2xl text-ink">
                ${results.totalLandedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-xs text-ink-faint">Per Unit</p>
              <p className="mt-1 font-mono text-2xl text-ink">${results.perUnit.toFixed(2)}</p>
            </div>
          </div>
          <div className="card mt-4 p-5">
            <CostBreakdownChart data={breakdown} />
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
