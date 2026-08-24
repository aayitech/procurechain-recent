export interface CountryOption {
  name: string;
  currencyCode: string;
}

// Currencies we can actually convert to — matches what MarketDataService
// tracks (real ECB rates + labeled sample rates for NGN/KES/EGP/GHS).
export const TRACKED_CURRENCY_CODES = ['USD', 'EUR', 'GBP', 'ZAR', 'NGN', 'KES', 'EGP', 'GHS', 'CNY'];

export const COUNTRY_OPTIONS: CountryOption[] = [
  { name: 'South Africa', currencyCode: 'ZAR' },
  { name: 'Nigeria', currencyCode: 'NGN' },
  { name: 'Kenya', currencyCode: 'KES' },
  { name: 'Egypt', currencyCode: 'EGP' },
  { name: 'Ghana', currencyCode: 'GHS' },
  { name: 'United Kingdom', currencyCode: 'GBP' },
  { name: 'United States', currencyCode: 'USD' },
  { name: 'European Union', currencyCode: 'EUR' },
  { name: 'China', currencyCode: 'CNY' },
  // Listed for completeness — we don't have a real FX source for these yet,
  // so they fall back to USD display rather than a fabricated rate.
  { name: 'Republic of Congo', currencyCode: 'CDF' },
  { name: 'Angola', currencyCode: 'AOA' },
  { name: 'Namibia', currencyCode: 'NAD' },
  { name: 'Botswana', currencyCode: 'BWP' },
  { name: 'Zambia', currencyCode: 'ZMW' },
];

export function isCurrencyTracked(code: string): boolean {
  return TRACKED_CURRENCY_CODES.includes(code);
}
