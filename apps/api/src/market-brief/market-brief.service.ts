import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Prisma } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MarketDataService } from '../market-data/market-data.service';
import { NewsService, type NewsArticle } from '../news/news.service';
import { LogisticsService } from '../logistics/logistics.service';
import { GeminiProvider } from '../assistant/gemini.provider';
import {
  CATEGORY_KEYWORDS,
  DEEP_DIVE_INSTRUCTION,
  MARKET_BRIEF_SECTIONS,
  MARKET_BRIEF_SYSTEM_INSTRUCTION,
  SIGNIFICANT_CHANGE_THRESHOLD_PCT,
  TOP_STORIES_INSTRUCTION,
} from './market-brief.config';

const TOP_STORIES_COUNT = 3;
const VOLATILITY_LOW = 0.8;
const VOLATILITY_MODERATE = 1.8;

function mostRecentMonday(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
}

function slugFor(weekOf: Date): string {
  return weekOf.toISOString().slice(0, 10);
}

function parseSections(raw: string): Record<string, string> {
  const parts = raw.split(/^### /m).filter(Boolean);
  const content: Record<string, string> = {};
  for (const part of parts) {
    const [heading, ...rest] = part.split('\n');
    content[heading.trim()] = rest.join('\n').trim();
  }
  for (const section of MARKET_BRIEF_SECTIONS) {
    if (!content[section]) content[section] = 'Not covered in this brief.';
  }
  return content;
}

function parseTopStoryReasons(raw: string): Map<string, string> {
  const map = new Map<string, string>();
  const blocks = raw.split(/^TITLE: /m).filter(Boolean);
  for (const block of blocks) {
    const titleMatch = /^(.*)\nWHY: (.*)$/s.exec(block.trim());
    if (titleMatch) {
      map.set(titleMatch[1].trim(), titleMatch[2].trim());
    }
  }
  return map;
}

function parseDeepDive(raw: string) {
  const get = (label: string) => {
    const re = new RegExp(`${label}:\\s*(.*?)(?=\\n[A-Z ]+:|$)`, 's');
    const match = re.exec(raw);
    return match ? match[1].trim() : '';
  };
  return {
    whatHappened: get('WHAT HAPPENED'),
    whyItMatters: get('WHY IT MATTERS'),
    whatToWatch: get('WHAT TO WATCH'),
    procurementExposure: get('PROCUREMENT EXPOSURE'),
  };
}

/** Standard deviation of period-over-period % change across a short sparkline — a real, disclosed volatility measure, not an AI confidence score. */
function computeVolatilityPct(points: Array<{ price: number }>): number | null {
  if (points.length < 2) return null;
  const changes: number[] = [];
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1].price;
    if (prev === 0) continue;
    changes.push(((points[i].price - prev) / prev) * 100);
  }
  if (changes.length === 0) return null;
  const mean = changes.reduce((s, v) => s + v, 0) / changes.length;
  const variance = changes.reduce((s, v) => s + (v - mean) ** 2, 0) / changes.length;
  return Math.sqrt(variance);
}

function volatilityBucket(stddevPct: number): 'Low' | 'Moderate' | 'Elevated' {
  if (stddevPct < VOLATILITY_LOW) return 'Low';
  if (stddevPct < VOLATILITY_MODERATE) return 'Moderate';
  return 'Elevated';
}

function categorizeHeadlines(articles: NewsArticle[]): Record<string, Array<{ title: string; url: string; source: string }>> {
  const result: Record<string, Array<{ title: string; url: string; source: string }>> = {};
  for (const article of articles) {
    const haystack = `${article.title} ${article.description}`.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      // Word-boundary match — a plain .includes() would match "ore" inside
      // "more" or "store" and mis-categorize unrelated headlines.
      if (keywords.some((k) => new RegExp(`\\b${k}`, 'i').test(haystack))) {
        result[category] = result[category] ?? [];
        if (result[category].length < 4) {
          result[category].push({ title: article.title, url: article.link, source: article.source });
        }
        break;
      }
    }
  }
  return result;
}

@Injectable()
export class MarketBriefService {
  private readonly logger = new Logger(MarketBriefService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly marketData: MarketDataService,
    private readonly news: NewsService,
    private readonly logistics: LogisticsService,
    private readonly gemini: GeminiProvider,
    private readonly config: ConfigService,
  ) {}

  requiresApproval(): boolean {
    const raw = this.config.get<string>('MARKET_BRIEF_REQUIRES_APPROVAL');
    return raw === undefined ? true : raw !== 'false';
  }

  @Cron(CronExpression.EVERY_WEEK)
  async generateDraft() {
    if (!this.gemini.isConfigured()) {
      this.logger.warn('Skipping market brief generation: GEMINI_API_KEY not set');
      return null;
    }

    const weekOf = mostRecentMonday(new Date());

    const existing = await this.prisma.marketBrief.findUnique({ where: { weekOf } });
    if (existing?.status === 'PUBLISHED') {
      throw new ConflictException(`Market brief for week of ${slugFor(weekOf)} is already published`);
    }

    const [dashboard, articles, portConditions] = await Promise.all([
      this.marketData.getDashboard(),
      this.news.getLatest().catch(() => [] as NewsArticle[]),
      this.logistics.getPortConditions().catch(() => null),
    ]);

    const significant = [
      ...dashboard.commodities
        .filter((c) => c.change7d !== null && Math.abs(c.change7d) >= SIGNIFICANT_CHANGE_THRESHOLD_PCT)
        .map((c) => ({ label: c.name, change7d: c.change7d })),
      ...dashboard.fx
        .filter((f) => f.change7d !== null && Math.abs(f.change7d) >= SIGNIFICANT_CHANGE_THRESHOLD_PCT)
        .map((f) => ({ label: `${f.baseCode}/${f.quoteCode}`, change7d: f.change7d })),
    ];

    const commodityLines = dashboard.commodities
      .map((c) => `- ${c.name} [${c.category}]: ${c.latestPrice.toFixed(2)} ${c.currency}/${c.unit} · 7d: ${this.fmtPct(c.change7d)} · 30d: ${this.fmtPct(c.change30d)} · source: ${c.source}`)
      .join('\n');
    const fxLines = dashboard.fx
      .map((f) => `- ${f.baseCode}/${f.quoteCode}: ${f.latestRate.toFixed(4)} · 7d: ${this.fmtPct(f.change7d)} · 30d: ${this.fmtPct(f.change30d)}`)
      .join('\n');
    const significantLines = significant.length > 0
      ? significant.map((s) => `- ${s.label}: 7d change ${this.fmtPct(s.change7d)} (threshold ${SIGNIFICANT_CHANGE_THRESHOLD_PCT}%)`).join('\n')
      : `- None of the tracked commodities or exchange rates moved more than ${SIGNIFICANT_CHANGE_THRESHOLD_PCT}% in the last 7 days.`;
    const headlineLines = articles
      .slice(0, 20)
      .map((a) => `- [${a.source}, ${a.publishedAt.slice(0, 10)}] ${a.title}`)
      .join('\n');

    const snapshotText = `Snapshot generated at ${dashboard.generatedAt}. Week of ${slugFor(weekOf)}.

Significant moves this week (|change| >= ${SIGNIFICANT_CHANGE_THRESHOLD_PCT}%):
${significantLines}

All tracked commodities:
${commodityLines || 'None tracked yet.'}

All tracked exchange rates (base USD):
${fxLines}

Recent trade-press headlines:
${headlineLines || 'No headlines available.'}`;

    // Call 1: the main 11-section prose brief.
    const raw = await this.gemini.generate(MARKET_BRIEF_SYSTEM_INSTRUCTION, snapshotText, 4096);
    const sections = parseSections(raw);

    // Real, computed (not AI) selections below — Gemini is only used for
    // the two grounded narrative touches (top-story reasons, deep dive).
    const topStoryArticles = articles.slice(0, TOP_STORIES_COUNT);
    const deepDiveArticle = this.pickDeepDiveArticle(articles, significant);

    let topStories: Array<{ title: string; whyItMatters: string; url: string; imageUrl: string | null; source: string; publishedAt: string }> = [];
    if (topStoryArticles.length > 0) {
      const prompt = topStoryArticles.map((a) => `TITLE: ${a.title}\nDESCRIPTION: ${a.description}\nSOURCE: ${a.source}`).join('\n\n');
      try {
        const response = await this.gemini.generate(TOP_STORIES_INSTRUCTION, prompt, 1024);
        const reasons = parseTopStoryReasons(response);
        topStories = topStoryArticles.map((a) => ({
          title: a.title,
          whyItMatters: reasons.get(a.title) ?? 'See the full story for details.',
          url: a.link,
          imageUrl: a.imageUrl,
          source: a.source,
          publishedAt: a.publishedAt,
        }));
      } catch (error) {
        this.logger.warn(`Top stories generation failed: ${(error as Error).message}`);
        topStories = topStoryArticles.map((a) => ({ title: a.title, whyItMatters: a.description, url: a.link, imageUrl: a.imageUrl, source: a.source, publishedAt: a.publishedAt }));
      }
    }

    let deepDive = null;
    if (deepDiveArticle) {
      try {
        const prompt = `Headline: ${deepDiveArticle.title}\nDescription: ${deepDiveArticle.description}\nSource: ${deepDiveArticle.source}\n\nMarket snapshot for context:\n${snapshotText}`;
        const response = await this.gemini.generate(DEEP_DIVE_INSTRUCTION, prompt, 1024);
        deepDive = { title: deepDiveArticle.title, ...parseDeepDive(response), url: deepDiveArticle.link, imageUrl: deepDiveArticle.imageUrl, source: deepDiveArticle.source };
      } catch (error) {
        this.logger.warn(`Deep dive generation failed: ${(error as Error).message}`);
      }
    }

    const marketPulse = this.computeMarketPulse(dashboard);
    const categoryIntelligence = categorizeHeadlines(articles);
    const africaWatch = this.computeAfricaWatch(dashboard, portConditions);
    const logisticsFreight = {
      headline: categoryIntelligence.Logistics?.[0] ?? null,
      portConditions: portConditions?.points ?? [],
    };
    const volatilityOutlook = dashboard.commodities
      .map((c) => {
        const stddev = computeVolatilityPct(c.sparkline);
        return stddev !== null ? { label: c.name, category: c.category, stddevPct: Math.round(stddev * 100) / 100, bucket: volatilityBucket(stddev) } : null;
      })
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .sort((a, b) => b.stddevPct - a.stddevPct)
      .slice(0, 6);

    const content = {
      sections,
      topStories,
      deepDive,
      marketPulse,
      categoryIntelligence,
      africaWatch,
      logisticsFreight,
      volatilityOutlook,
    };

    const contentJson = content as unknown as Prisma.InputJsonValue;
    const brief = await this.prisma.marketBrief.upsert({
      where: { weekOf },
      update: { content: contentJson, model: 'gemini-flash-latest', generatedAt: new Date() },
      create: { weekOf, content: contentJson, model: 'gemini-flash-latest', status: 'DRAFT' },
    });

    if (!this.requiresApproval()) {
      return this.publish(brief.id);
    }

    this.logger.log(`Generated market brief draft for week of ${slugFor(weekOf)}`);
    return brief;
  }

  private pickDeepDiveArticle(articles: NewsArticle[], significant: Array<{ label: string; change7d: number | null }>): NewsArticle | null {
    if (articles.length === 0) return null;
    const topMoverLabel = significant.sort((a, b) => Math.abs(b.change7d ?? 0) - Math.abs(a.change7d ?? 0))[0]?.label?.toLowerCase();
    if (topMoverLabel) {
      const keyword = topMoverLabel.split(' ')[0];
      const match = articles.find((a) => `${a.title} ${a.description}`.toLowerCase().includes(keyword));
      if (match) return match;
    }
    return articles[0];
  }

  private computeMarketPulse(dashboard: Awaited<ReturnType<MarketDataService['getDashboard']>>) {
    const pick = (symbol: string) => dashboard.commodities.find((c) => c.symbol === symbol);
    const wti = pick('WTI');
    const copper = pick('COPPER');
    const aluminium = pick('ALUMINUM');
    const topFx = [...dashboard.fx].sort((a, b) => Math.abs(b.change7d ?? 0) - Math.abs(a.change7d ?? 0))[0];

    const tiles: Array<{ key: string; label: string; value: number; unit: string; change7d: number | null; sparkline: Array<{ asOf: string; price: number }> }> = [];
    if (wti) tiles.push({ key: 'oil', label: 'Oil (WTI)', value: wti.latestPrice, unit: wti.currency, change7d: wti.change7d, sparkline: wti.sparkline });
    if (copper) tiles.push({ key: 'copper', label: 'Copper', value: copper.latestPrice, unit: copper.currency, change7d: copper.change7d, sparkline: copper.sparkline });
    if (aluminium) tiles.push({ key: 'aluminium', label: 'Aluminium', value: aluminium.latestPrice, unit: aluminium.currency, change7d: aluminium.change7d, sparkline: aluminium.sparkline });
    if (topFx) tiles.push({ key: 'fx', label: `USD/${topFx.quoteCode}`, value: topFx.latestRate, unit: topFx.quoteCode, change7d: topFx.change7d, sparkline: topFx.sparkline });
    return tiles;
  }

  private computeAfricaWatch(
    dashboard: Awaited<ReturnType<MarketDataService['getDashboard']>>,
    ports: Awaited<ReturnType<LogisticsService['getPortConditions']>> | null,
  ) {
    const zar = dashboard.fx.find((f) => f.quoteCode === 'ZAR');
    const durban = ports?.points.find((p) => p.id === 'PORT_DURBAN');
    const suez = ports?.points.find((p) => p.id === 'SUEZ_CANAL');

    const southAfrica = {
      country: 'South Africa',
      flag: '🇿🇦',
      signals: [
        ...(zar ? [{ label: 'USD/ZAR', value: `${zar.latestRate.toFixed(4)} (7d ${this.fmtPct(zar.change7d)})` }] : []),
        ...(durban ? [{ label: 'Durban port', value: durban.operationalFlag === 'unavailable' ? 'no live data' : durban.operationalFlag }] : []),
      ],
    };
    const egypt = {
      country: 'Egypt',
      flag: '🇪🇬',
      signals: [
        ...(suez ? [{ label: 'Suez Canal', value: suez.operationalFlag === 'unavailable' ? 'no live data' : suez.operationalFlag }] : []),
      ],
    };
    return [southAfrica, egypt].filter((c) => c.signals.length > 0);
  }

  async publish(id: string) {
    const brief = await this.prisma.marketBrief.findUnique({ where: { id } });
    if (!brief) throw new NotFoundException('Market brief not found');
    return this.prisma.marketBrief.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });
  }

  async list() {
    const briefs = await this.prisma.marketBrief.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { weekOf: 'desc' },
    });
    return briefs.map((b) => ({ id: b.id, slug: slugFor(b.weekOf), weekOf: b.weekOf, publishedAt: b.publishedAt }));
  }

  async listDrafts() {
    return this.prisma.marketBrief.findMany({ where: { status: 'DRAFT' }, orderBy: { weekOf: 'desc' } });
  }

  async getBySlug(slug: string) {
    const briefs = await this.prisma.marketBrief.findMany({ where: { status: 'PUBLISHED' } });
    const brief = briefs.find((b) => slugFor(b.weekOf) === slug);
    if (!brief) throw new NotFoundException('Market brief not found');
    return brief;
  }

  private fmtPct(value: number | null): string {
    if (value === null) return 'n/a';
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  }
}
