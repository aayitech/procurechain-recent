import { Injectable, Logger } from '@nestjs/common';
import { SOURCE_NAMES } from '../source-registry';

const SARB_BASE_URL = 'https://custom.resbank.co.za/SarbWebApi/WebIndicators/Shared/GetTimeseriesObservations';
const LOOKBACK_DAYS = 400;

type SarbObservation = {
  Period?: string;
  Value?: number;
};

export type SarbFxSeries = {
  baseCode: string;
  quoteCode: string;
  points: Array<{ asOf: Date; rate: number }>;
  source: string;
};

export type SarbIndicatorSeries = {
  symbol: string;
  name: string;
  unit: string;
  category: string;
  frequency: 'daily' | 'monthly';
  points: Array<{ asOf: Date; price: number }>;
  source: string;
};

const FX_SERIES = [
  { timeseriesCode: 'EXCX135D', baseCode: 'USD', quoteCode: 'ZAR', invert: false },
  { timeseriesCode: 'EXCZ001D', baseCode: 'GBP', quoteCode: 'ZAR', invert: false },
  { timeseriesCode: 'EXCZ002D', baseCode: 'EUR', quoteCode: 'ZAR', invert: false },
  { timeseriesCode: 'EXCB121D', baseCode: 'CNY', quoteCode: 'ZAR', invert: true },
  { timeseriesCode: 'EXCB120D', baseCode: 'JPY', quoteCode: 'ZAR', invert: true },
  { timeseriesCode: 'EXCB031D', baseCode: 'CAD', quoteCode: 'ZAR', invert: true },
  { timeseriesCode: 'EXCB080D', baseCode: 'AUD', quoteCode: 'ZAR', invert: true },
] as const;

const INDICATOR_SERIES = [
  { timeseriesCode: 'CPI1000F', symbol: 'CPI_ZAF', name: 'South Africa Consumer Price Inflation', unit: '% year-over-year', frequency: 'monthly' as const },
  { timeseriesCode: 'PPI1000F', symbol: 'PPI_ZAF', name: 'South Africa Producer Price Inflation', unit: '% year-over-year', frequency: 'monthly' as const },
  { timeseriesCode: 'MMRD002A', symbol: 'SARB_POLICY_RATE', name: 'South African Reserve Bank Policy Rate', unit: '%', frequency: 'daily' as const },
] as const;

function dateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

@Injectable()
export class SarbProvider {
  private readonly logger = new Logger(SarbProvider.name);

  async fetchFxSeries(): Promise<SarbFxSeries[]> {
    const results: Array<SarbFxSeries | null> = await Promise.all(
      FX_SERIES.map(async (definition): Promise<SarbFxSeries | null> => {
        const observations = await this.fetchObservations(definition.timeseriesCode);
        const points = observations
          .map((observation) => {
            const value = Number(observation.Value);
            const rate = definition.invert && value !== 0 ? 1 / value : value;
            return { asOf: new Date(observation.Period ?? ''), rate };
          })
          .filter((point) => !Number.isNaN(point.asOf.getTime()) && Number.isFinite(point.rate) && point.rate > 0)
          .sort((a, b) => a.asOf.getTime() - b.asOf.getTime());

        return points.length > 0
          ? { baseCode: definition.baseCode, quoteCode: definition.quoteCode, points, source: SOURCE_NAMES.sarb }
          : null;
      }),
    );

    return results.filter((series): series is SarbFxSeries => series !== null);
  }

  async fetchIndicatorSeries(): Promise<SarbIndicatorSeries[]> {
    const results: Array<SarbIndicatorSeries | null> = await Promise.all(
      INDICATOR_SERIES.map(async (definition): Promise<SarbIndicatorSeries | null> => {
        const observations = await this.fetchObservations(definition.timeseriesCode);
        const points = observations
          .map((observation) => ({ asOf: new Date(observation.Period ?? ''), price: Number(observation.Value) }))
          .filter((point) => !Number.isNaN(point.asOf.getTime()) && Number.isFinite(point.price))
          .sort((a, b) => a.asOf.getTime() - b.asOf.getTime());

        return points.length > 0
          ? { symbol: definition.symbol, name: definition.name, unit: definition.unit, frequency: definition.frequency, category: 'Economic Indicators', points, source: SOURCE_NAMES.sarb }
          : null;
      }),
    );

    return results.filter((series): series is SarbIndicatorSeries => series !== null);
  }

  private async fetchObservations(timeseriesCode: string): Promise<SarbObservation[]> {
    const end = new Date();
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - LOOKBACK_DAYS);
    const url = `${SARB_BASE_URL}/${timeseriesCode}/${dateOnly(start)}/${dateOnly(end)}`;

    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) {
        this.logger.warn(`SARB request failed for ${timeseriesCode}: ${response.status}`);
        return [];
      }
      const body = (await response.json()) as unknown;
      return Array.isArray(body) ? body as SarbObservation[] : [];
    } catch (error) {
      this.logger.error(`SARB fetch failed for ${timeseriesCode}`, error as Error);
      return [];
    }
  }
}
