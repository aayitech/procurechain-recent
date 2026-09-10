'use client';

import { useEffect } from 'react';
import { usePreferencesStore } from '@/store/preferences-store';
import { COUNTRY_OPTIONS, TRACKED_CURRENCY_CODES } from '@/lib/currencies';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';

export function CurrencySelector() {
  const { currencyCode, country, setCurrencyCode, setCountry } = usePreferencesStore();
  const { availableCurrencyCodes, currenciesLoading } = useCurrencyConversion();
  const availableCurrencies = TRACKED_CURRENCY_CODES.filter((code) => availableCurrencyCodes.has(code));
  const currencySymbol: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', ZAR: 'R', CNY: '¥' };

  useEffect(() => {
    if (!currenciesLoading && !availableCurrencyCodes.has(currencyCode)) setCurrencyCode('USD');
  }, [availableCurrencyCodes, currenciesLoading, currencyCode, setCurrencyCode]);

  return (
    <div className="relative flex items-center">
      <span aria-hidden="true" className="pointer-events-none absolute left-2 min-w-4 text-center text-xs font-semibold text-ink-faint">
        {currencySymbol[currencyCode] ?? currencyCode}
      </span>
      <select
        value={currencyCode}
        onChange={(e) => {
          setCurrencyCode(e.target.value);
          const match = COUNTRY_OPTIONS.find((c) => c.currencyCode === e.target.value);
          if (match && !country) setCountry(match.name);
        }}
        aria-label="Display currency"
        title="Display currency (verified rates only)"
        className="appearance-none rounded-lg border border-transparent bg-transparent py-1.5 pl-7 pr-2 text-xs font-medium text-ink-muted transition hover:border-border hover:bg-canvas-overlay hover:text-ink focus:border-accent focus:outline-none 2xl:text-sm"
      >
        {availableCurrencies.map((code) => (
          <option key={code} value={code} className="bg-canvas-raised text-ink">
            {code}
          </option>
        ))}
        <option value="coming-soon" disabled className="bg-canvas-raised text-ink-faint">
          More currencies coming soon
        </option>
      </select>
    </div>
  );
}
