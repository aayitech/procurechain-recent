import { Injectable, Logger } from '@nestjs/common';

const IMF_BASE = 'https://www.imf.org/external/datamapper/api/v1';
const MAX_HISTORY_POINTS = 20;

// IMF World Economic Outlook, via the free, no-key DataMapper API. Real
// figures published by the IMF, including their own forward-looking
// projections for the current and upcoming years — clearly labeled as such
// (never presented as our own forecast).
export const IMF_INDICATORS = [
  { metric: 'PCPIPCH', symbolPrefix: 'INFLATION', label: 'Inflation (CPI, avg)' },
  { metric: 'NGDP_RPCH', symbolPrefix: 'GDP_GROWTH', label: 'Real GDP Growth' },
] as const;

export const IMF_COUNTRIES = [
  { iso3: 'ZAF', name: 'South Africa' },
  { iso3: 'EGY', name: 'Egypt' },
  { iso3: 'CHN', name: 'China' },
  { iso3: 'NLD', name: 'Netherlands' },
  { iso3: 'GBR', name: 'United Kingdom' },
  { iso3: 'BRA', name: 'Brazil' },
  { iso3: 'SGP', name: 'Singapore' },
  { iso3: 'USA', name: 'United States' },
] as const;

export interface ImfPricePoint {
  asOf: Date;
  price: number;
}

export interface ImfSeries {
  symbol: string;
  name: string;
  unit: string;
  category: string;
  points: ImfPricePoint[];
  source: string;
}

interface DataMapperResponse {
  values?: Record<string, Record<string, Record<string, number>>>;
}

@Injectable()
export class ImfProvider {
  private readonly logger = new Logger(ImfProvider.name);

  async fetchAllSeries(): Promise<ImfSeries[]> {
    const results: ImfSeries[] = [];
    const currentYear = new Date().getUTCFullYear();

    for (const indicator of IMF_INDICATORS) {
      try {
        const response = await fetch(`${IMF_BASE}/${indicator.metric}`);
        if (!response.ok) {
          this.logger.warn(`IMF DataMapper request failed for ${indicator.metric}: ${response.status}`);
          continue;
        }

        const body = (await response.json()) as DataMapperResponse;
        const byCountry = body.values?.[indicator.metric];
        if (!byCountry) continue;

        for (const country of IMF_COUNTRIES) {
          const yearly = byCountry[country.iso3];
          if (!yearly) continue;

          const points: ImfPricePoint[] = Object.entries(yearly)
            .map(([year, value]) => ({ year: Number(year), value }))
            .filter((p) => Number.isFinite(p.value))
            .sort((a, b) => a.year - b.year)
            .slice(-MAX_HISTORY_POINTS)
            .map((p) => ({ asOf: new Date(Date.UTC(p.year, 5, 30)), price: p.value }));

          if (points.length === 0) continue;

          results.push({
            symbol: `${indicator.symbolPrefix}_${country.iso3}`,
            name: `${indicator.label} — ${country.name}`,
            unit: `% year-over-year (IMF WEO; ${currentYear} onward is IMF's own projection, not ours)`,
            category: 'Economic Indicators',
            points,
            source: 'IMF World Economic Outlook (DataMapper API)',
          });
        }
      } catch (error) {
        this.logger.error(`IMF fetch failed for ${indicator.metric}`, error as Error);
      }
    }

    return results;
  }
}
