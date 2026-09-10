'use client';

import { useCallback, useMemo } from 'react';
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
  sourceCurrencyCode: string;
}

export function useCurrencyConversion() {
  const currencyCode = usePreferencesStore((s) => s.currencyCode);
  const { data: fxList, isLoading: currenciesLoading } = useFxList();

  const usdRates = useMemo(() => {
    const rates = new Map<string, { rate: number; asOf: string }>();
    rates.set('USD', { rate: 1, asOf: '' });
    for (const entry of fxList ?? []) {
      if (entry.baseCode === 'USD' && Number.isFinite(entry.latestRate) && entry.latestRate > 0) {
        rates.set(entry.quoteCode, { rate: entry.latestRate, asOf: entry.asOf });
      }
    }
    return rates;
  }, [fxList]);

  const convert = useCallback((amount: number, sourceCurrencyCode = 'USD'): ConversionResult => {
    const sourceCode = sourceCurrencyCode.toUpperCase();
    const targetRate = usdRates.get(currencyCode);
    const sourceRate = usdRates.get(sourceCode);

    if (sourceCode === currencyCode) {
      return { amount, currencyCode, rate: 1, isUsd: currencyCode === 'USD', isTracked: true, rateAsOf: null, sourceCurrencyCode: sourceCode };
    }

    if (!isCurrencyTracked(currencyCode) || !targetRate || !sourceRate) {
      // Keep the verified source currency when a cross-rate is unavailable.
      return { amount, currencyCode: sourceCode, rate: null, isUsd: sourceCode === 'USD', isTracked: false, rateAsOf: null, sourceCurrencyCode: sourceCode };
    }

    const crossRate = targetRate.rate / sourceRate.rate;
    return {
      amount: amount * crossRate,
      currencyCode,
      rate: crossRate,
      isUsd: currencyCode === 'USD',
      isTracked: true,
      rateAsOf: targetRate.asOf || sourceRate.asOf || null,
      sourceCurrencyCode: sourceCode,
    };
  }, [currencyCode, usdRates]);

  return { currencyCode, convert, availableCurrencyCodes: new Set(usdRates.keys()), currenciesLoading };
}
