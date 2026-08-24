'use client';

import { DollarSign } from 'lucide-react';
import { usePreferencesStore } from '@/store/preferences-store';
import { COUNTRY_OPTIONS, TRACKED_CURRENCY_CODES } from '@/lib/currencies';

export function CurrencySelector() {
  const { currencyCode, country, setCurrencyCode, setCountry } = usePreferencesStore();

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
        aria-label="Preferred currency"
        className="appearance-none rounded-md bg-transparent py-1.5 pl-7 pr-2 text-sm text-ink-muted hover:text-ink focus:outline-none"
      >
        {TRACKED_CURRENCY_CODES.map((code) => (
          <option key={code} value={code} className="bg-canvas-raised text-ink">
            {code}
          </option>
        ))}
      </select>
    </div>
  );
}
