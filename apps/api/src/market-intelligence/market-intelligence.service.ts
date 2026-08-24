import { Injectable, Logger } from '@nestjs/common';
import { MarketDataService, type CommodityListEntry, type FxListEntry } from '../market-data/market-data.service';
import { NewsService, type NewsArticle } from '../news/news.service';
import { LogisticsService } from '../logistics/logistics.service';
import { AFRICA_COUNTRIES, STORY_CATEGORY_KEYWORDS, classifyImpact, type ImpactLevel } from './market-intelligence.config';

type Mover = { label: string; symbol: string; changePct: number; periodLabel: string; category: string };

function categorize(text: string): string | null {
  const haystack = text.toLowerCase();
  for (const [category, keywords] of Object.entries(STORY_CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => new RegExp(`\\b${k}`, 'i').test(haystack))) return category;
  }
  return null;
}

function matchingMoverFor(text: string, movers: Mover[]): Mover | null {
  const haystack = text.toLowerCase();
  return movers.find((m) => haystack.includes(m.label.toLowerCase().split(' ')[0]) || haystack.includes(m.symbol.toLowerCase())) ?? null;
}

@Injectable()
export class MarketIntelligenceService {
  private readonly logger = new Logger(MarketIntelligenceService.name);

  constructor(
    private readonly marketData: MarketDataService,
    private readonly news: NewsService,
    private readonly logistics: LogisticsService,
  ) {}

  async getSnapshot() {
    const [dashboard, articles, ports] = await Promise.all([
      this.marketData.getDashboard(),
      this.news.getLatest().catch(() => [] as NewsArticle[]),
      this.logistics.getPortConditions().catch(() => null),
    ]);

    const nonEconomic = dashboard.commodities.filter((c) => c.category !== 'Economic Indicators');
    const economic = dashboard.commodities.filter((c) => c.category === 'Economic Indicators');

    const movers: Mover[] = [
      ...nonEconomic
        .filter((c) => c.change7d !== null)
        .map((c) => ({ label: c.name, symbol: c.symbol, changePct: c.change7d as number, periodLabel: c.periodShortLabel, category: categorize(c.name) ?? c.category })),
      ...dashboard.fx
        .filter((f) => f.change7d !== null)
        .map((f) => ({ label: `${f.baseCode}/${f.quoteCode}`, symbol: f.quoteCode, changePct: f.change7d as number, periodLabel: f.periodShortLabel, category: 'FX & Economy' })),
    ].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));

    const sources = new Set<string>([...dashboard.commodities.map((c) => c.source), ...dashboard.fx.map((f) => f.source)]);
    const newsSources = new Set(articles.map((a) => a.source));

    const meta = {
      generatedAt: dashboard.generatedAt,
      sourcesCount: sources.size,
      marketsTracked: dashboard.commodities.length + dashboard.fx.length,
      newsSourcesCount: newsSources.size,
    };

    const topStories = this.buildTopStories(articles, movers);
    const topAlert = topStories[0] ?? null;
    const marketPulse = this.buildMarketPulse(nonEconomic, dashboard.fx, ports);
    const supplyChainWatch = this.buildSupplyChainWatch(articles, movers);
    const africaWatch = this.buildAfricaWatch(dashboard.fx, ports, articles);
    const economicContext = this.buildEconomicContext(economic);
    const alerts = this.buildAlerts(movers);
    const whatToWatch = alerts.slice(0, 5).map((a) => ({ label: a.label, severity: a.severity }));

    return { meta, topAlert, marketPulse, topStories, supplyChainWatch, africaWatch, economicContext, alerts, whatToWatch };
  }

  private buildTopStories(articles: NewsArticle[], movers: Mover[]) {
    // Only stories that actually match a real procurement-relevant
    // category — defaulting an unmatched story to "Trade & Policy" would
    // mislabel general business news (e.g. a warehouse opening) as policy
    // news it has nothing to do with.
    return articles
      .map((a) => ({ article: a, category: categorize(`${a.title} ${a.description}`) }))
      .filter((x): x is { article: NewsArticle; category: string } => x.category !== null)
      .slice(0, 6)
      .map(({ article: a, category }) => {
        const mover = matchingMoverFor(`${a.title} ${a.description}`, movers);
        return {
          title: a.title,
          summary: a.description,
          url: a.link,
          imageUrl: a.imageUrl,
          source: a.source,
          category,
          publishedAt: a.publishedAt,
          impact: classifyImpact(mover ? Math.abs(mover.changePct) : null) as ImpactLevel,
        };
    });
  }

  private buildMarketPulse(commodities: CommodityListEntry[], fx: FxListEntry[], ports: Awaited<ReturnType<LogisticsService['getPortConditions']>> | null) {
    const pick = (symbol: string) => commodities.find((c) => c.symbol === symbol);
    const brent = pick('BRENT') ?? pick('WTI');
    const copper = pick('COPPER');
    const aluminium = pick('ALUMINUM');
    const ironOre = pick('IRON_ORE');
    const zar = fx.find((f) => f.quoteCode === 'ZAR');

    type Tile = {
      key: string;
      label: string;
      value: number;
      unit: string;
      changeShort: number | null;
      changeLong: number | null;
      periodShortLabel: string;
      periodLongLabel: string | null;
      sparkline: CommodityListEntry['sparkline'];
    };
    const tiles: Tile[] = [];
    const pushCommodity = (c: CommodityListEntry) =>
      tiles.push({
        key: c.symbol,
        label: c.name,
        value: c.latestPrice,
        unit: c.currency,
        changeShort: c.change7d,
        changeLong: c.change30d,
        periodShortLabel: c.periodShortLabel,
        periodLongLabel: c.periodLongLabel,
        sparkline: c.sparkline,
      });
    if (brent) pushCommodity(brent);
    if (copper) pushCommodity(copper);
    if (aluminium) pushCommodity(aluminium);
    if (ironOre) pushCommodity(ironOre);
    if (zar) {
      tiles.push({
        key: zar.quoteCode,
        label: `USD/${zar.quoteCode}`,
        value: zar.latestRate,
        unit: zar.quoteCode,
        changeShort: zar.change7d,
        changeLong: zar.change30d,
        periodShortLabel: zar.periodShortLabel,
        periodLongLabel: zar.periodLongLabel,
        sparkline: zar.sparkline,
      });
    }

    // Real substitute for a "Freight Index" we have no data source for —
    // the count of tracked shipping chokepoints currently flagged
    // elevated, out of the total tracked. A different real metric, not a
    // fabricated index number standing in for one we don't have.
    if (ports) {
      const elevated = ports.points.filter((p) => p.operationalFlag === 'elevated').length;
      tiles.push({
        key: 'port-conditions',
        label: 'Port Conditions',
        value: elevated,
        unit: `of ${ports.points.length} elevated`,
        changeShort: null,
        changeLong: null,
        periodShortLabel: 'Live',
        periodLongLabel: null,
        sparkline: [],
      });
    }

    return tiles;
  }

  private buildSupplyChainWatch(articles: NewsArticle[], movers: Mover[]) {
    const byCategory: Record<string, { title: string; summary: string; url: string; source: string; impact: ImpactLevel }> = {};
    for (const a of articles) {
      const category = categorize(`${a.title} ${a.description}`);
      if (!category || category === 'FX & Economy' || byCategory[category]) continue;
      const mover = matchingMoverFor(`${a.title} ${a.description}`, movers);
      byCategory[category] = {
        title: a.title,
        summary: a.description,
        url: a.link,
        source: a.source,
        impact: classifyImpact(mover ? Math.abs(mover.changePct) : null),
      };
    }
    return Object.entries(byCategory).map(([category, item]) => ({ category, ...item }));
  }

  private buildAfricaWatch(fx: FxListEntry[], ports: Awaited<ReturnType<LogisticsService['getPortConditions']>> | null, articles: NewsArticle[]) {
    return AFRICA_COUNTRIES.map((c) => {
      const fxEntry = c.fxQuoteCode ? fx.find((f) => f.quoteCode === c.fxQuoteCode) : undefined;
      const port = c.portId ? ports?.points.find((p) => p.id === c.portId) : undefined;
      const headline = articles.find((a) => `${a.title} ${a.description}`.toLowerCase().includes(c.country.toLowerCase()));

      const signals: Array<{ label: string; value: string }> = [];
      if (fxEntry) signals.push({ label: `USD/${fxEntry.quoteCode}`, value: `${fxEntry.latestRate.toFixed(4)} (${fxEntry.periodShortLabel} ${fxEntry.change7d !== null ? `${fxEntry.change7d >= 0 ? '+' : ''}${fxEntry.change7d.toFixed(1)}%` : 'n/a'})` });
      if (port) signals.push({ label: port.name, value: port.operationalFlag === 'unavailable' ? 'no live data' : port.operationalFlag });

      return {
        country: c.country,
        flag: c.flag,
        signals,
        headline: headline ? { title: headline.title, url: headline.link, source: headline.source } : null,
      };
    }).filter((c) => c.signals.length > 0);
  }

  private buildEconomicContext(economic: CommodityListEntry[]) {
    return economic.map((c) => ({
      label: c.name,
      value: c.latestPrice,
      unit: c.unit,
      periodLabel: c.periodShortLabel,
      change: c.change7d,
      asOf: c.asOf,
      source: c.source,
      frequency: c.frequency,
    }));
  }

  private buildAlerts(movers: Mover[]) {
    return movers.slice(0, 5).map((m) => ({
      label: m.label,
      category: m.category,
      changePct: m.changePct,
      periodLabel: m.periodLabel,
      severity: classifyImpact(Math.abs(m.changePct)),
    }));
  }
}
