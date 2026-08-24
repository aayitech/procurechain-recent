import type { PortCondition } from './logistics';

export const MARKET_BRIEF_SECTION_ORDER = [
  'Executive Summary',
  'Commodity Markets',
  'FX',
  'Freight & Logistics',
  'Fuel',
  'Supplier Developments',
  'Industry Developments',
  'Africa Procurement Watch',
  'Procurement Risks',
  'What Procurement Should Watch',
  'Recommended Actions',
] as const;

export interface MarketBriefListEntry {
  id: string;
  slug: string;
  weekOf: string;
  publishedAt: string | null;
}

export interface MarketBriefTopStory {
  title: string;
  whyItMatters: string;
  url: string;
  imageUrl: string | null;
  source: string;
  publishedAt: string;
}

export interface MarketBriefDeepDive {
  title: string;
  whatHappened: string;
  whyItMatters: string;
  whatToWatch: string;
  procurementExposure: string;
  url: string;
  imageUrl: string | null;
  source: string;
}

export interface MarketBriefPulseTile {
  key: string;
  label: string;
  value: number;
  unit: string;
  change7d: number | null;
  sparkline: Array<{ asOf: string; price: number }>;
}

export interface MarketBriefHeadlineRef {
  title: string;
  url: string;
  source: string;
}

export interface MarketBriefAfricaEntry {
  country: string;
  flag: string;
  signals: Array<{ label: string; value: string }>;
}

export interface MarketBriefVolatilityEntry {
  label: string;
  category: string;
  stddevPct: number;
  bucket: 'Low' | 'Moderate' | 'Elevated';
}

export interface MarketBriefContent {
  sections: Record<string, string>;
  topStories: MarketBriefTopStory[];
  deepDive: MarketBriefDeepDive | null;
  marketPulse: MarketBriefPulseTile[];
  categoryIntelligence: Record<string, MarketBriefHeadlineRef[]>;
  africaWatch: MarketBriefAfricaEntry[];
  logisticsFreight: { headline: MarketBriefHeadlineRef | null; portConditions: PortCondition[] };
  volatilityOutlook: MarketBriefVolatilityEntry[];
}

export interface MarketBriefDetail {
  id: string;
  weekOf: string;
  status: 'DRAFT' | 'PUBLISHED';
  content: MarketBriefContent;
  model: string;
  generatedAt: string;
  publishedAt: string | null;
}
