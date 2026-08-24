'use client';

import { useMemo } from 'react';
import { usePreferencesStore } from '@/store/preferences-store';
import { useFxList } from './useMarketIntelligence';
import { isCurrencyTracked } from '@/lib/currencies';

export interface ConversionResult {
  amount: number;
  currencyCode: string;
  rate: number | null;
  isUsd: boolean;
  isTracked: boolean;
  rateAsOf: string | null;
}

export function useCurrencyConversion() {
  const currencyCode = usePreferencesStore((s) => s.currencyCode);
  const { data: fxList } = useFxList();

  const rateEntry = useMemo(
    () => (fxList ?? []).find((f) => f.quoteCode === currencyCode),
    [fxList, currencyCode],
  );

  function convert(usdAmount: number): ConversionResult {
    if (currencyCode === 'USD') {
      return { amount: usdAmount, currencyCode: 'USD', rate: 1, isUsd: true, isTracked: true, rateAsOf: null };
    }
    if (!isCurrencyTracked(currencyCode) || !rateEntry) {
      // No real rate for this currency — stay in USD rather than fabricate one.
      return { amount: usdAmount, currencyCode: 'USD', rate: null, isUsd: true, isTracked: false, rateAsOf: null };
    }
    return {
      amount: usdAmount * rateEntry.latestRate,
      currencyCode,
      rate: rateEntry.latestRate,
      isUsd: false,
      isTracked: true,
      rateAsOf: rateEntry.asOf,
    };
  }

  return { currencyCode, convert };
}
