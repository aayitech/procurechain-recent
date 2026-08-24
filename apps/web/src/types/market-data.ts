export interface HistoryPoint {
  asOf: string;
  price: number;
}

export interface CommodityListEntry {
  symbol: string;
  name: string;
  unit: string;
  category: string;
  latestPrice: number;
  currency: string;
  asOf: string;
  change7d: number | null;
  change30d: number | null;
  // What change7d/change30d actually represent — "7d"/"30d" for daily
  // data, "MoM"/"YoY" for monthly indicators, or "YoY"/null for annual
  // ones. Always use this instead of assuming "7d"/"30d".
  periodShortLabel: string;
  periodLongLabel: string | null;
  frequency: 'daily' | 'monthly' | 'annual';
  source: string;
  sparkline: HistoryPoint[];
}

export interface CommodityDetail extends CommodityListEntry {
  history: HistoryPoint[];
}

export interface FxListEntry {
  baseCode: string;
  quoteCode: string;
  latestRate: number;
  asOf: string;
  change7d: number | null;
  change30d: number | null;
  periodShortLabel: string;
  periodLongLabel: string | null;
  source: string;
  sparkline: HistoryPoint[];
}

export interface FxDetail extends FxListEntry {
  history: HistoryPoint[];
}

export interface DashboardPayload {
  fx: FxListEntry[];
  commodities: CommodityListEntry[];
  commodityDataAvailable: boolean;
  generatedAt: string;
}
