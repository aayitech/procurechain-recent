import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SOURCE_NAMES } from '../source-registry';

const EIA_BASE_URL = 'https://api.eia.gov/v2/seriesid';
const MAX_HISTORY_POINTS = 180;

// EIA documents these series IDs in its official petroleum dashboard. API v2
// retains legacy IDs through the supported /seriesid route.
export const EIA_SERIES = [
  { seriesId: 'PET.RBRTE.D', symbol: 'BRENT', name: 'Crude Oil (Brent)', unit: 'USD/barrel', category: 'Fuel & Energy' },
  { seriesId: 'PET.RWTC.D', symbol: 'WTI', name: 'Crude Oil (WTI)', unit: 'USD/barrel', category: 'Fuel & Energy' },
] as const;

interface EiaResponse {
  response?: { data?: Array<{ period?: string; value?: string | number }> };
  error?: string;
}

export interface EiaSeries {
  symbol: string;
  name: string;
  unit: string;
  category: string;
  points: Array<{ asOf: Date; price: number }>;
  source: string;
}

@Injectable()
export class EiaProvider {
  private readonly logger = new Logger(EiaProvider.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('EIA_API_KEY'));
  }

  async fetchAllSeries(): Promise<EiaSeries[]> {
    const apiKey = this.config.get<string>('EIA_API_KEY');
    if (!apiKey) return [];

    const results: EiaSeries[] = [];
    for (const def of EIA_SERIES) {
      try {
        const url = `${EIA_BASE_URL}/${def.seriesId}?api_key=${encodeURIComponent(apiKey)}&length=${MAX_HISTORY_POINTS}`;
        const response = await fetch(url);
        if (!response.ok) {
          this.logger.warn(`EIA request failed for ${def.seriesId}: ${response.status}`);
          continue;
        }

        const body = (await response.json()) as EiaResponse;
        if (body.error) {
          this.logger.warn(`EIA error for ${def.seriesId}: ${body.error}`);
          continue;
        }

        const points = (body.response?.data ?? [])
          .map((row) => ({ asOf: new Date(`${row.period ?? ''}T00:00:00.000Z`), price: Number(row.value) }))
          .filter((point) => !Number.isNaN(point.asOf.getTime()) && Number.isFinite(point.price))
          .sort((a, b) => a.asOf.getTime() - b.asOf.getTime());

        if (points.length > 0) results.push({ ...def, points, source: SOURCE_NAMES.eia });
      } catch (error) {
        this.logger.error(`EIA fetch failed for ${def.symbol}`, error as Error);
      }
    }

    return results;
  }
}
