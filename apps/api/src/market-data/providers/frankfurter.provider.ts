import { Injectable } from '@nestjs/common';

const FRANKFURTER_BASE = 'https://api.frankfurter.dev/v1';
const HISTORY_DAYS = 180;

// Currencies most relevant to African procurement teams pricing in or
// against USD. Frankfurter (ECB reference rates) needs no API key.
export const TRACKED_CURRENCIES = ['EUR', 'GBP', 'ZAR', 'NGN', 'KES', 'EGP', 'GHS', 'CNY', 'BRL', 'SGD'] as const;

export interface FxRatePoint {
  quoteCode: string;
  rate: number;
  asOf: Date;
}

export interface FxRateSeries {
  baseCode: string;
  points: FxRatePoint[];
  source: string;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

@Injectable()
export class FrankfurterProvider {
  /**
   * Pulls the last HISTORY_DAYS of daily ECB reference rates in a single
   * request. Cheap to call on every refresh (Frankfurter has no documented
   * rate limit) and gives real historical chart data for free, instead of
   * only ever storing "today".
   */
  async fetchTimeSeries(base = 'USD', days = HISTORY_DAYS): Promise<FxRateSeries> {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - days);

    const url = `${FRANKFURTER_BASE}/${formatDate(start)}..${formatDate(end)}?from=${base}&to=${TRACKED_CURRENCIES.join(',')}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Frankfurter request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      base: string;
      rates: Record<string, Record<string, number>>;
    };

    // NGN, KES, GHS, EGP are not covered by the ECB reference set Frankfurter
    // publishes; only rates actually returned are stored, so the dashboard
    // gracefully shows whatever the free feed supports.
    const points: FxRatePoint[] = [];
    for (const [dateStr, ratesForDate] of Object.entries(data.rates)) {
      const asOf = new Date(`${dateStr}T00:00:00.000Z`);
      for (const [quoteCode, rate] of Object.entries(ratesForDate)) {
        points.push({ quoteCode, rate, asOf });
      }
    }

    return {
      baseCode: base,
      points,
      source: 'frankfurter.dev (ECB reference rates)',
    };
  }
}
