import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

// How much history to keep per commodity. Alpha Vantage's free monthly
// series goes back decades in a single response; capping at 36 points
// (3 years) keeps charts meaningful without storing data nobody will chart.
const MAX_HISTORY_POINTS = 36;

// Alpha Vantage's free-tier commodity functions. Each maps to one of the
// procurement-relevant commodity categories called out in the spec.
export const TRACKED_COMMODITIES = [
  { symbol: 'WTI', name: 'Crude Oil (WTI)', unit: 'USD/barrel', category: 'Fuel & Energy', function: 'WTI' },
  { symbol: 'BRENT', name: 'Crude Oil (Brent)', unit: 'USD/barrel', category: 'Fuel & Energy', function: 'BRENT' },
  { symbol: 'NATURAL_GAS', name: 'Natural Gas', unit: 'USD/MMBtu', category: 'Fuel & Energy', function: 'NATURAL_GAS' },
  { symbol: 'COPPER', name: 'Copper', unit: 'USD/lb', category: 'Metals', function: 'COPPER' },
  { symbol: 'ALUMINUM', name: 'Aluminium', unit: 'USD/tonne', category: 'Metals', function: 'ALUMINUM' },
  { symbol: 'WHEAT', name: 'Wheat', unit: 'USD/bushel', category: 'Agriculture', function: 'WHEAT' },
] as const;

export interface CommodityPricePoint {
  price: number;
  asOf: Date;
}

export interface CommodityPriceSeries {
  symbol: string;
  name: string;
  unit: string;
  category: string;
  points: CommodityPricePoint[];
  source: string;
}

interface AlphaVantageSeriesResponse {
  data?: Array<{ date: string; value: string }>;
  Information?: string;
  Note?: string;
}

@Injectable()
export class AlphaVantageProvider {
  private readonly logger = new Logger(AlphaVantageProvider.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('ALPHA_VANTAGE_API_KEY'));
  }

  async fetchPriceSeries(commodity: (typeof TRACKED_COMMODITIES)[number]): Promise<CommodityPriceSeries | null> {
    const apiKey = this.config.get<string>('ALPHA_VANTAGE_API_KEY');
    if (!apiKey) {
      return null;
    }

    const url = `${ALPHA_VANTAGE_URL}?function=${commodity.function}&interval=monthly&apikey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      this.logger.warn(`Alpha Vantage request failed for ${commodity.symbol}: ${response.status}`);
      return null;
    }

    const body = (await response.json()) as AlphaVantageSeriesResponse;

    if (body.Information || body.Note) {
      // Rate limit or plan message from Alpha Vantage — not a hard error,
      // just means this commodity sits out this refresh cycle.
      this.logger.warn(`Alpha Vantage message for ${commodity.symbol}: ${body.Information ?? body.Note}`);
      return null;
    }

    const points = (body.data ?? [])
      .filter((entry) => entry.value !== '.' && !Number.isNaN(Number(entry.value)))
      .slice(0, MAX_HISTORY_POINTS)
      .map((entry) => ({
        price: Number(entry.value),
        asOf: new Date(`${entry.date}T00:00:00.000Z`),
      }));

    if (points.length === 0) {
      return null;
    }

    return {
      symbol: commodity.symbol,
      name: commodity.name,
      unit: commodity.unit,
      category: commodity.category,
      points,
      source: 'Alpha Vantage',
    };
  }
}
