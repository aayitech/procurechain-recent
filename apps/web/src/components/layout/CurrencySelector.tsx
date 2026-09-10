'use client';

import { DollarSign } from 'lucide-react';
import { usePreferencesStore } from '@/store/preferences-store';
import { COUNTRY_OPTIONS, TRACKED_CURRENCY_CODES } from '@/lib/currencies';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';

export function CurrencySelector() {
  const { currencyCode, country, setCurrencyCode, setCountry } = usePreferencesStore();
  const { availableCurrencyCodes } = useCurrencyConversion();

  return (
    <div className="relative flex items-center">
      <DollarSign size={16} className="pointer-events-none absolute left-2 text-ink-faint" />
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
        {TRACKED_CURRENCY_CODES.map((code) => (
          <option key={code} value={code} disabled={!availableCurrencyCodes.has(code)} className="bg-canvas-raised text-ink">
            {code}{availableCurrencyCodes.has(code) ? '' : ' — unavailable'}
          </option>
        ))}
      </select>
    </div>
  );
}
