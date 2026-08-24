'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';

// Illustrative, rounded factors for rough estimation only — not sourced
// from an audited LCA/EPD database. Real ESG reporting needs supplier- or
// product-specific verified figures, not a generic lookup like this.
const MATERIALS = [
  { name: 'Steel', factor: 2.0 },
  { name: 'Aluminium', factor: 11.0 },
  { name: 'Plastic (generic)', factor: 3.0 },
  { name: 'Paper / Cardboard', factor: 1.0 },
  { name: 'Cement / Concrete', factor: 0.9 },
  { name: 'Timber', factor: 0.5 },
];

export function CarbonFootprintCalculator() {
  const [materialIndex, setMaterialIndex] = useState(0);
  const [quantityKg, setQuantityKg] = useState(5000);
  const [transportKm, setTransportKm] = useState(800);

  const material = MATERIALS[materialIndex];
  const transportFactorPerTonneKm = 0.1; // kg CO2e per tonne-km, road freight, illustrative

  const results = useMemo(() => {
    const materialEmissions = quantityKg * material.factor;
    const transportEmissions = (quantityKg / 1000) * transportKm * transportFactorPerTonneKm;
    const totalKg = materialEmissions + transportEmissions;
    return { materialEmissions, transportEmissions, totalKg, totalTonnes: totalKg / 1000 };
  }, [quantityKg, transportKm, material.factor]);

  return (
    <CalculatorShell
      title="Carbon Footprint Calculator"
      description="Rough estimate of embodied + transport emissions for a material purchase. Uses illustrative emission factors — not a substitute for audited LCA data."
      slug="carbon-footprint"
      csvFilename="carbon-footprint.csv"
      getCsvRows={() => [
        { metric: 'Material', value: material.name },
        { metric: 'Quantity', value: `${quantityKg} kg` },
        { metric: 'Transport Distance', value: `${transportKm} km` },
        { metric: 'Material Emissions (illustrative)', value: `${results.materialEmissions.toFixed(0)} kg CO2e` },
        { metric: 'Transport Emissions (illustrative)', value: `${results.transportEmissions.toFixed(0)} kg CO2e` },
        { metric: 'Total Estimated Emissions', value: `${results.totalTonnes.toFixed(2)} t CO2e` },
      ]}
    >
      <div className="mb-4 rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs text-ink-muted">
        Emission factors here are illustrative, rounded estimates for directional use only — not
        audited. For compliance or supplier scorecards, use verified LCA/EPD data.
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <label className="block">
            <span className="text-xs font-medium text-ink-muted">Material</span>
            <select
              value={materialIndex}
              onChange={(e) => setMaterialIndex(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            >
              {MATERIALS.map((m, i) => (
                <option key={m.name} value={i}>
                  {m.name} (~{m.factor} kg CO2e/kg, illustrative)
                </option>
              ))}
            </select>
          </label>
          <NumberField label="Quantity" value={quantityKg} onChange={setQuantityKg} suffix="kg" />
          <NumberField label="Transport distance (road)" value={transportKm} onChange={setTransportKm} suffix="km" />
        </div>

        <div className="card p-5">
          <p className="text-xs text-ink-faint">Estimated Total Emissions</p>
          <p className="mt-1 font-mono text-3xl text-ink">{results.totalTonnes.toFixed(2)} t CO₂e</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-ink-faint">Material</p>
              <p className="font-mono text-lg text-ink">{(results.materialEmissions / 1000).toFixed(2)} t</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Transport</p>
              <p className="font-mono text-lg text-ink">{(results.transportEmissions / 1000).toFixed(2)} t</p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
