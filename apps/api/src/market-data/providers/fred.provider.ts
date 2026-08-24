import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const FRED_URL = 'https://api.stlouisfed.org/fred/series/observations';
const MAX_HISTORY_POINTS = 36;

// FRED (Federal Reserve Economic Data) — free with a personal API key.
// These are real US macro indicators, not a global PMI (ISM's real PMI
// survey is proprietary and not freely republishable — Industrial
// Production Index is used here as an honestly-labeled proxy instead).
export const FRED_SERIES = [
  { seriesId: 'CPIAUCSL', symbol: 'CPI_US', name: 'US Consumer Price Index (CPI)', unit: 'Index (1982-84=100)', category: 'Economic Indicators' },
  { seriesId: 'PPIACO', symbol: 'PPI_US', name: 'US Producer Price Index (PPI)', unit: 'Index (1982=100)', category: 'Economic Indicators' },
  { seriesId: 'FEDFUNDS', symbol: 'FED_FUNDS_RATE', name: 'US Federal Funds Rate', unit: '% (effective rate)', category: 'Economic Indicators' },
  { seriesId: 'INDPRO', symbol: 'INDUSTRIAL_PRODUCTION_US', name: 'US Industrial Production Index', unit: 'Index (2017=100)', category: 'Economic Indicators' },
] as const;

export interface FredPricePoint {
  asOf: Date;
  price: number;
}

export interface FredSeries {
  symbol: string;
  name: string;
  unit: string;
  category: string;
  points: FredPricePoint[];
  source: string;
}

interface FredObservationsResponse {
  observations?: Array<{ date: string; value: string }>;
  error_message?: string;
}

@Injectable()
export class FredProvider {
  private readonly logger = new Logger(FredProvider.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('FRED_API_KEY'));
  }

  async fetchSeries(def: (typeof FRED_SERIES)[number]): Promise<FredSeries | null> {
    const apiKey = this.config.get<string>('FRED_API_KEY');
    if (!apiKey) return null;

    const url = `${FRED_URL}?series_id=${def.seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${MAX_HISTORY_POINTS}`;
    const response = await fetch(url);

    if (!response.ok) {
      this.logger.warn(`FRED request failed for ${def.seriesId}: ${response.status}`);
      return null;
    }

    const body = (await response.json()) as FredObservationsResponse;
    if (body.error_message) {
      this.logger.warn(`FRED error for ${def.seriesId}: ${body.error_message}`);
      return null;
    }

    const points = (body.observations ?? [])
      .filter((obs) => obs.value !== '.' && !Number.isNaN(Number(obs.value)))
      .map((obs) => ({ asOf: new Date(`${obs.date}T00:00:00.000Z`), price: Number(obs.value) }))
      .sort((a, b) => a.asOf.getTime() - b.asOf.getTime());

    if (points.length === 0) return null;

    return {
      symbol: def.symbol,
      name: def.name,
      unit: def.unit,
      category: def.category,
      points,
      source: 'FRED (Federal Reserve Bank of St. Louis)',
    };
  }

  async fetchAllSeries(): Promise<FredSeries[]> {
    const results: FredSeries[] = [];
    for (const def of FRED_SERIES) {
      try {
        const series = await this.fetchSeries(def);
        if (series) results.push(series);
      } catch (error) {
        this.logger.error(`FRED fetch failed for ${def.symbol}`, error as Error);
      }
    }
    return results;
  }
}
