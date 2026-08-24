'use client';

import { useMemo, useState } from 'react';
import { CalculatorShell } from '../CalculatorShell';
import { NumberField } from '../NumberField';
import { useFxDetail } from '@/hooks/useMarketIntelligence';

const CURRENCIES = ['EUR', 'GBP', 'ZAR', 'CNY', 'NGN', 'KES', 'EGP', 'GHS'];

export function CurrencyImpactCalculator() {
  const [currency, setCurrency] = useState('EUR');
  const [contractValue, setContractValue] = useState(100000);
  const [sensitivityPct, setSensitivityPct] = useState(10);
  const { data: fx, isLoading } = useFxDetail(currency);

  const results = useMemo(() => {
    if (!fx) return null;
    const rate = fx.latestRate;
    const baseUsd = contractValue / rate;
    const worseRate = rate * (1 + sensitivityPct / 100);
    const betterRate = rate * (1 - sensitivityPct / 100);
    const worseUsd = contractValue / worseRate;
    const betterUsd = contractValue / betterRate;
    return { rate, baseUsd, worseUsd, betterUsd, impact: worseUsd - baseUsd };
  }, [fx, contractValue, sensitivityPct]);

  return (
    <CalculatorShell
      title="Currency Impact Calculator"
      description="See how FX movement affects a foreign-currency contract's value in USD, using live exchange rate data."
      slug="currency-impact"
      csvFilename="currency-impact.csv"
      getCsvRows={() =>
        results
          ? [
              { metric: 'Currency', value: currency },
              { metric: 'Current Rate (USD base)', value: results.rate.toFixed(4) },
              { metric: 'Contract Value (foreign)', value: contractValue },
              { metric: 'USD Value at Current Rate', value: results.baseUsd.toFixed(2) },
              { metric: `USD Value if rate weakens ${sensitivityPct}%`, value: results.worseUsd.toFixed(2) },
              { metric: `USD Value if rate strengthens ${sensitivityPct}%`, value: results.betterUsd.toFixed(2) },
            ]
          : []
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <label className="block">
            <span className="text-xs font-medium text-ink-muted">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  USD / {code}
                </option>
              ))}
            </select>
          </label>
          <NumberField label={`Contract value (${currency})`} value={contractValue} onChange={setContractValue} />
          <NumberField label="Sensitivity range" value={sensitivityPct} onChange={setSensitivityPct} suffix="%" />
        </div>

        <div>
          {isLoading && <div className="card h-40 animate-pulse" />}
          {results && (
            <div className="card p-5">
              <p className="text-xs text-ink-faint">Current USD value</p>
              <p className="mt-1 font-mono text-2xl text-ink">
                ${results.baseUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="mt-1 text-xs text-ink-faint">at rate {results.rate.toFixed(4)}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-negative">If {currency} weakens {sensitivityPct}%</p>
                  <p className="font-mono text-lg text-ink">
                    ${results.worseUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-positive">If {currency} strengthens {sensitivityPct}%</p>
                  <p className="font-mono text-lg text-ink">
                    ${results.betterUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-ink-faint">
                Exchange rate source: {fx?.source}, updated {fx && new Date(fx.asOf).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
