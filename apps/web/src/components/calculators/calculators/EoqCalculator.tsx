'use client';

import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';

export function EoqCalculator() {
  const [annualDemand, setAnnualDemand] = useState(12000);
  const [orderCost, setOrderCost] = useState(75);
  const [holdingCostPerUnit, setHoldingCostPerUnit] = useState(4);

  const results = useMemo(() => {
    const eoq = Math.sqrt((2 * annualDemand * orderCost) / Math.max(holdingCostPerUnit, 0.01));
    const ordersPerYear = eoq > 0 ? annualDemand / eoq : 0;
    const totalCost = (annualDemand / eoq) * orderCost + (eoq / 2) * holdingCostPerUnit;

    const curve = Array.from({ length: 20 }).map((_, i) => {
      const q = Math.max(1, Math.round((eoq * 2 * (i + 1)) / 20));
      const cost = (annualDemand / q) * orderCost + (q / 2) * holdingCostPerUnit;
      return { quantity: q, cost: Number(cost.toFixed(2)) };
    });

    return { eoq, ordersPerYear, totalCost, curve };
  }, [annualDemand, orderCost, holdingCostPerUnit]);

  return (
    <CalculatorShell
      title="Economic Order Quantity (EOQ) Calculator"
      description="Find the order quantity that minimizes total inventory cost — balancing ordering cost against holding cost."
      slug="eoq"
      csvFilename="eoq-calculator.csv"
      getCsvRows={() => [
        { metric: 'Annual Demand', value: annualDemand },
        { metric: 'Order Cost', value: orderCost },
        { metric: 'Holding Cost per Unit', value: holdingCostPerUnit },
        { metric: 'Economic Order Quantity', value: results.eoq.toFixed(1) },
        { metric: 'Orders per Year', value: results.ordersPerYear.toFixed(1) },
        { metric: 'Total Annual Cost', value: results.totalCost.toFixed(2) },
      ]}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <NumberField label="Annual demand" value={annualDemand} onChange={setAnnualDemand} suffix="units/yr" />
          <NumberField label="Order cost" value={orderCost} onChange={setOrderCost} suffix="$/order" />
          <NumberField label="Holding cost per unit" value={holdingCostPerUnit} onChange={setHoldingCostPerUnit} suffix="$/unit/yr" />

          <div className="card p-5">
            <p className="text-xs text-ink-faint">Economic Order Quantity</p>
            <p className="mt-1 font-mono text-3xl text-ink">{Math.round(results.eoq)} units</p>
            <p className="mt-2 text-xs text-ink-faint">
              ≈ {results.ordersPerYear.toFixed(1)} orders/year · total annual cost $
              {results.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="card p-5">
          <p className="mb-2 text-xs text-ink-faint">Total cost vs. order quantity</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.curve} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232b3b" vertical={false} />
                <XAxis dataKey="quantity" tick={{ fill: '#5b6478', fontSize: 11 }} axisLine={{ stroke: '#232b3b' }} tickLine={false} />
                <YAxis tick={{ fill: '#5b6478', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
                <Tooltip
                  contentStyle={{ background: '#161d2b', border: '1px solid #232b3b', fontSize: 12 }}
                  labelStyle={{ color: '#8b93a7' }}
                />
                <ReferenceLine x={Math.round(results.eoq)} stroke="#22c55e" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
