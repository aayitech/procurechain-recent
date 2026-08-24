import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';

const LISTING_PAGE_URL = 'https://www.worldbank.org/en/research/commodity-markets';
const MAX_HISTORY_POINTS = 36;

// World Bank's "Pink Sheet" — free, no API key, updated monthly, published
// as a direct Excel download whose URL rotates (contains a content hash),
// so we scrape the current link off the listing page rather than hardcode it.
export const WORLD_BANK_COMMODITIES = [
  { column: 'Maize', symbol: 'CORN', name: 'Corn (Maize)', unit: 'USD/tonne', category: 'Agriculture' },
  { column: 'Iron ore, cfr spot', symbol: 'IRON_ORE', name: 'Iron Ore', unit: 'USD/dmtu', category: 'Metals' },
  { column: 'Coal, Australian', symbol: 'COAL', name: 'Coal (Australian)', unit: 'USD/tonne', category: 'Fuel & Energy' },
  { column: 'Zinc', symbol: 'ZINC', name: 'Zinc', unit: 'USD/tonne', category: 'Metals' },
  { column: 'Nickel', symbol: 'NICKEL', name: 'Nickel', unit: 'USD/tonne', category: 'Metals' },
  { column: 'Urea  ', symbol: 'UREA', name: 'Urea (Fertilizer)', unit: 'USD/tonne', category: 'Chemicals' },
  { column: 'Cotton, A Index', symbol: 'COTTON', name: 'Cotton', unit: 'USD/kg', category: 'Agriculture' },
  { column: 'Sugar, world', symbol: 'SUGAR', name: 'Sugar', unit: 'USD/kg', category: 'Agriculture' },
  { column: 'Palm oil', symbol: 'PALM_OIL', name: 'Palm Oil', unit: 'USD/tonne', category: 'Agriculture' },
  { column: 'Gold', symbol: 'GOLD', name: 'Gold', unit: 'USD/troy oz', category: 'Metals' },
] as const;

export interface WorldBankPricePoint {
  asOf: Date;
  price: number;
}

export interface WorldBankSeries {
  symbol: string;
  name: string;
  unit: string;
  category: string;
  points: WorldBankPricePoint[];
  source: string;
}

function excelMonthLabelToDate(label: string): Date | null {
  // Format is "1960M01" — year + "M" + month.
  const match = /^(\d{4})M(\d{2})$/.exec(label);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  return new Date(Date.UTC(year, month - 1, 1));
}

@Injectable()
export class WorldBankProvider {
  private readonly logger = new Logger(WorldBankProvider.name);

  async fetchAllSeries(): Promise<WorldBankSeries[]> {
    const fileUrl = await this.resolveCurrentFileUrl();
    if (!fileUrl) {
      this.logger.warn('Could not locate current Pink Sheet download link');
      return [];
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      this.logger.warn(`Pink Sheet download failed: ${response.status}`);
      return [];
    }

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets['Monthly Prices'];
    if (!sheet) {
      this.logger.warn('Pink Sheet workbook missing "Monthly Prices" sheet');
      return [];
    }

    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, range: 0 });
    const headerRow = rows[4] as string[] | undefined;
    if (!headerRow) return [];

    const columnIndexByName = new Map<string, number>();
    headerRow.forEach((name, i) => {
      if (typeof name === 'string') columnIndexByName.set(name.trim(), i);
    });

    const dataRows = rows.slice(6).filter((row) => typeof row[0] === 'string');

    const series: WorldBankSeries[] = [];
    for (const def of WORLD_BANK_COMMODITIES) {
      const colIndex = columnIndexByName.get(def.column.trim());
      if (colIndex === undefined) {
        this.logger.warn(`Pink Sheet column not found for ${def.symbol}: "${def.column}"`);
        continue;
      }

      const points: WorldBankPricePoint[] = [];
      for (const row of dataRows) {
        const label = row[0] as string;
        const value = row[colIndex];
        if (typeof value !== 'number') continue;
        const asOf = excelMonthLabelToDate(label);
        if (!asOf) continue;
        points.push({ asOf, price: value });
      }

      if (points.length === 0) continue;
      series.push({
        symbol: def.symbol,
        name: def.name,
        unit: def.unit,
        category: def.category,
        points: points.slice(-MAX_HISTORY_POINTS),
        source: 'World Bank Commodity Markets (Pink Sheet)',
      });
    }

    return series;
  }

  private async resolveCurrentFileUrl(): Promise<string | null> {
    try {
      const response = await fetch(LISTING_PAGE_URL);
      if (!response.ok) return null;
      const html = await response.text();
      const match = /https:\/\/[^"]*CMO-Historical-Data-Monthly\.xlsx/.exec(html);
      return match ? match[0] : null;
    } catch (error) {
      this.logger.warn(`Failed to resolve Pink Sheet URL: ${(error as Error).message}`);
      return null;
    }
  }
}
