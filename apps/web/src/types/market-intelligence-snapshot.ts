export type ImpactLevel = 'High' | 'Medium' | 'Watch';

export interface SnapshotMeta {
  generatedAt: string;
  sourcesCount: number;
  marketsTracked: number;
  newsSourcesCount: number;
}

export interface TopStory {
  title: string;
  summary: string;
  url: string;
  imageUrl: string | null;
  source: string;
  category: string;
  publishedAt: string;
  impact: ImpactLevel;
}

export interface PulseTile {
  key: string;
  label: string;
  value: number;
  unit: string;
  changeShort: number | null;
  changeLong: number | null;
  periodShortLabel: string;
  periodLongLabel: string | null;
  sparkline: Array<{ asOf: string; price: number }>;
}

export interface SupplyChainWatchItem {
  category: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  impact: ImpactLevel;
}

export interface AfricaWatchEntry {
  country: string;
  flag: string;
  signals: Array<{ label: string; value: string }>;
  headline: { title: string; url: string; source: string } | null;
}

export interface EconomicContextEntry {
  label: string;
  value: number;
  unit: string;
  periodLabel: string;
  change: number | null;
  asOf: string;
  source: string;
  frequency: 'daily' | 'monthly' | 'annual';
}

export interface AlertEntry {
  label: string;
  category: string;
  changePct: number;
  periodLabel: string;
  severity: ImpactLevel;
}

export interface WatchEntry {
  label: string;
  severity: ImpactLevel;
}

export interface MarketIntelligenceSnapshot {
  meta: SnapshotMeta;
  topAlert: TopStory | null;
  marketPulse: PulseTile[];
  topStories: TopStory[];
  supplyChainWatch: SupplyChainWatchItem[];
  africaWatch: AfricaWatchEntry[];
  economicContext: EconomicContextEntry[];
  alerts: AlertEntry[];
  whatToWatch: WatchEntry[];
}
