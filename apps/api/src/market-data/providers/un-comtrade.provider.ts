import { Injectable, Logger } from '@nestjs/common';
import { SOURCE_NAMES } from '../source-registry';

const COMTRADE_URL = 'https://comtradeapi.un.org/public/v1/preview/C/A/HS';
const SOUTH_AFRICA_REPORTER_CODE = 710;
const HISTORY_YEARS = 8;

type ComtradeResponse = {
  data?: Array<{ period?: string; primaryValue?: number }>;
  error?: string;
};

export type ComtradeSeries = {
  symbol: string;
  name: string;
  unit: string;
  category: string;
  points: Array<{ asOf: Date; price: number }>;
  source: string;
};

const FLOWS = [
  { flowCode: 'M', symbol: 'TRADE_IMPORTS_ZAF', name: 'South Africa Merchandise Imports' },
  { flowCode: 'X', symbol: 'TRADE_EXPORTS_ZAF', name: 'South Africa Merchandise Exports' },
] as const;

@Injectable()
export class UnComtradeProvider {
  private readonly logger = new Logger(UnComtradeProvider.name);

  async fetchAllSeries(): Promise<ComtradeSeries[]> {
    const latestCompleteYear = new Date().getUTCFullYear() - 1;
    const years = Array.from({ length: HISTORY_YEARS }, (_, index) => latestCompleteYear - HISTORY_YEARS + index + 1);

    const results: ComtradeSeries[] = [];
    for (const flow of FLOWS) {
      const observations = await Promise.all(years.map((year) => this.fetchYear(year, flow.flowCode)));
      const points = observations
        .filter((point): point is { asOf: Date; price: number } => point !== null)
        .sort((a, b) => a.asOf.getTime() - b.asOf.getTime());

      if (points.length > 0) {
        results.push({
          symbol: flow.symbol,
          name: flow.name,
          unit: 'current USD',
          category: 'Trade',
          points,
          source: SOURCE_NAMES.unComtrade,
        });
      }
    }
    return results;
  }

  private async fetchYear(year: number, flowCode: string): Promise<{ asOf: Date; price: number } | null> {
    const params = new URLSearchParams({
      period: String(year),
      reporterCode: String(SOUTH_AFRICA_REPORTER_CODE),
      cmdCode: 'TOTAL',
      flowCode,
      partnerCode: '0',
      partner2Code: '0',
      customsCode: 'C00',
      motCode: '0',
      maxRecords: '10',
    });

    try {
      const response = await fetch(`${COMTRADE_URL}?${params.toString()}`, { headers: { Accept: 'application/json' } });
      if (!response.ok) {
        this.logger.warn(`UN Comtrade request failed for ${flowCode} ${year}: ${response.status}`);
        return null;
      }
      const body = (await response.json()) as ComtradeResponse;
      if (body.error) {
        this.logger.warn(`UN Comtrade error for ${flowCode} ${year}: ${body.error}`);
        return null;
      }
      const row = body.data?.[0];
      const value = Number(row?.primaryValue);
      if (!Number.isFinite(value) || value <= 0) return null;
      return { asOf: new Date(Date.UTC(year, 11, 31)), price: value };
    } catch (error) {
      this.logger.error(`UN Comtrade fetch failed for ${flowCode} ${year}`, error as Error);
      return null;
    }
  }
}
