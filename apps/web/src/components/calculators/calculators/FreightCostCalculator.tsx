'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';

export function FreightCostCalculator() {
  const [weightKg, setWeightKg] = useState(1200);
  const [volumeM3, setVolumeM3] = useState(4.5);
  const [volumetricFactor, setVolumetricFactor] = useState(167);
  const [ratePerKg, setRatePerKg] = useState(3.2);
  const [fuelSurchargePct, setFuelSurchargePct] = useState(15);
  const [handlingFee, setHandlingFee] = useState(120);

  const results = useMemo(() => {
    const volumetricWeight = volumeM3 * volumetricFactor;
    const chargeableWeight = Math.max(weightKg, volumetricWeight);
    const baseFreight = chargeableWeight * ratePerKg;
    const withSurcharge = baseFreight * (1 + fuelSurchargePct / 100);
    const total = withSurcharge + handlingFee;
    return { volumetricWeight, chargeableWeight, baseFreight, total };
  }, [weightKg, volumeM3, volumetricFactor, ratePerKg, fuelSurchargePct, handlingFee]);

  return (
    <CalculatorShell
      title="Freight Cost Calculator"
      description="Estimate freight spend using chargeable weight (the greater of actual and volumetric weight), fuel surcharge, and handling fees."
      slug="freight-cost"
      csvFilename="freight-cost.csv"
      getCsvRows={() => [
        { metric: 'Actual Weight', value: `${weightKg} kg` },
        { metric: 'Volume', value: `${volumeM3} m3` },
        { metric: 'Volumetric Weight', value: `${results.volumetricWeight.toFixed(1)} kg` },
        { metric: 'Chargeable Weight', value: `${results.chargeableWeight.toFixed(1)} kg` },
        { metric: 'Rate per kg', value: ratePerKg },
        { metric: 'Base Freight', value: results.baseFreight.toFixed(2) },
        { metric: 'Fuel Surcharge %', value: fuelSurchargePct },
        { metric: 'Handling Fee', value: handlingFee },
        { metric: 'Total Freight Cost', value: results.total.toFixed(2) },
      ]}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField label="Actual weight" value={weightKg} onChange={setWeightKg} suffix="kg" />
          <NumberField label="Volume" value={volumeM3} onChange={setVolumeM3} suffix="m³" />
          <NumberField label="Volumetric factor" value={volumetricFactor} onChange={setVolumetricFactor} suffix="kg/m³" />
          <NumberField label="Rate per kg" value={ratePerKg} onChange={setRatePerKg} suffix="$/kg" />
          <NumberField label="Fuel surcharge" value={fuelSurchargePct} onChange={setFuelSurchargePct} suffix="%" />
          <NumberField label="Handling fee" value={handlingFee} onChange={setHandlingFee} suffix="$" />
        </div>

        <div className="card p-5">
          <p className="text-xs text-ink-faint">Chargeable weight</p>
          <p className="mt-1 font-mono text-xl text-ink">{results.chargeableWeight.toFixed(1)} kg</p>
          <p className="mt-1 text-[11px] text-ink-faint">
            (Volumetric: {results.volumetricWeight.toFixed(1)} kg vs. Actual: {weightKg} kg)
          </p>

          <div className="mt-4 border-t border-border-subtle pt-4">
            <p className="text-xs text-ink-faint">Total Freight Cost</p>
            <p className="mt-1 font-mono text-3xl text-ink">
              ${results.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
