import { Inject, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';
import { MarketDataService } from '../market-data/market-data.service';
import { NewsService } from '../news/news.service';
import { LocalLlmProvider } from './local-llm.provider';

const SYSTEM_INSTRUCTION = `You are the ProcureChain AI Procurement Assistant, embedded in a procurement intelligence platform.

You will be given a snapshot of REAL, currently-tracked market data (commodity prices, exchange rates, with 7-day and 30-day % changes). Ground your answer in this data wherever it's relevant.

Rules you must follow:
- Answer the user's question first, then provide supporting context when useful.
- Use verified ProcureChain data whenever it is relevant to the question.
- If the data snapshot doesn't cover something the user asks about (a specific supplier, a specific shipping line, a specific country's trade statistics, a price forecast, etc.), say plainly that you don't have that data — never invent specific numbers, company names, events, or statistics that aren't in the snapshot.
- Never state a specific future price, percentage forecast, or "confidence score" — you can describe recent trends from the data, but do not predict.
- Never give unqualified financial/trading advice ("buy now", "sell now"). You can offer balanced, general procurement considerations if asked, clearly framed as considerations, not directives.
- Clearly distinguish verified facts from general procurement context or AI interpretation.
- Be concise, specific, and cite the actual numbers from the snapshot when you use them.
- When appropriate, recommend the most useful next action the user can take in ProcureChain, such as reviewing a relevant commodity, checking market data, using a calculator, or opening a relevant feature. Do not force a recommendation when it isn't useful.
- If asked something entirely unrelated to procurement/markets, answer briefly and redirect to what you can help with.
- Never claim to have performed an action, accessed data, or used a ProcureChain feature unless that information is actually provided in the context.`;
const MARKET_STORY_INSTRUCTION = `You are the ProcureChain AI Procurement Assistant, generating a short "Market Story" for one commodity or currency pair, embedded on its detail page.

You will be given: the item's real current price and real 7-day/30-day % change, and a list of real recent headlines from tracked trade-press feeds (which may or may not actually relate to this item).

Write a short structured story with exactly these four headers, each 1-3 sentences:
### What happened
State the real price movement using the real numbers given. Do not round away the sign or invent a different figure.
### Why
Only reference a headline if it is genuinely and specifically relevant to this item. If none of the provided headlines are actually relevant, say plainly "No linked headlines in our tracked feeds right now" — never invent a cause.
### Why it matters
One or two sentences of standard, general procurement context for this category (e.g. how this kind of cost typically flows into landed cost or input costs). Keep this generic domain knowledge, not a specific claim about today's market.
### What to watch
Balanced, general considerations a procurement professional might weigh — never a directive ("buy now"), never a specific price prediction or confidence score.

Keep the whole thing under 180 words total.`;

export interface AssistantAnswer {
  answer: string;
  dataAsOf: string | null;
  model: string;
}

export interface MarketStoryResult {
  symbol: string;
  story: string;
  dataAsOf: string;
  generatedAt: string;
  model: string;
}

const MARKET_STORY_CACHE_TTL_SECONDS = 12 * 60 * 60;

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(
    private readonly localLlm: LocalLlmProvider,
    private readonly marketData: MarketDataService,
    private readonly news: NewsService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async ask(question: string): Promise<AssistantAnswer> {
    if (!this.localLlm.isConfigured()) {
      throw new ServiceUnavailableException('AI Assistant is not configured (Ollama is unavailable)');
    }

    let dataAsOf: string | null = null;
    let snapshotText = 'No market data snapshot is available right now.';

    try {
      const dashboard = await this.marketData.getDashboard();
      dataAsOf = dashboard.generatedAt;
      const fxLines = dashboard.fx
        .map((f) => `${f.baseCode}/${f.quoteCode}: ${f.latestRate.toFixed(4)} (7d: ${this.fmtPct(f.change7d)}, 30d: ${this.fmtPct(f.change30d)})`)
        .join('\n');
      const commodityLines = dashboard.commodities
        .map((c) => `${c.name} [${c.category}]: ${c.latestPrice.toFixed(2)} ${c.currency} per ${c.unit} (7d: ${this.fmtPct(c.change7d)}, 30d: ${this.fmtPct(c.change30d)}) — source: ${c.source}`)
        .join('\n');
      snapshotText = `Snapshot generated at ${dashboard.generatedAt}.\n\nExchange rates (base USD):\n${fxLines || 'none available'}\n\nCommodities:\n${commodityLines || 'none available'}`;
    } catch (error) {
      this.logger.warn(`Could not load market data for assistant context: ${(error as Error).message}`);
    }

    const userMessage = `Market data snapshot:\n${snapshotText}\n\nUser question: ${question}`;

    const answer = await this.localLlm.generate(SYSTEM_INSTRUCTION, userMessage);

    return { answer, dataAsOf, model: this.localLlm.modelName };
  }

  async getMarketStory(type: 'commodity' | 'fx', symbol: string): Promise<MarketStoryResult> {
    if (!this.localLlm.isConfigured()) {
      throw new ServiceUnavailableException('AI Assistant is not configured (Ollama is unavailable)');
    }

    const cacheKey = `market-story:${type}:${symbol.toUpperCase()}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as MarketStoryResult;
    }

    const item =
      type === 'commodity'
        ? await this.marketData.getCommodityDetail(symbol).catch(() => null)
        : await this.marketData.getFxDetail(symbol).catch(() => null);

    if (!item) {
      throw new NotFoundException(`No data available for ${symbol}`);
    }

    const label = type === 'commodity' ? (item as { name: string }).name : `${(item as { baseCode: string }).baseCode}/${(item as { quoteCode: string }).quoteCode}`;
    const price = type === 'commodity' ? (item as { latestPrice: number }).latestPrice : (item as { latestRate: number }).latestRate;

    let headlinesText = 'No headlines available.';
    try {
      const articles = await this.news.getLatest();
      headlinesText = articles
        .slice(0, 15)
        .map((a) => `- [${a.source}, ${a.publishedAt.slice(0, 10)}] ${a.title}`)
        .join('\n');
    } catch (error) {
      this.logger.warn(`Could not load news for market story: ${(error as Error).message}`);
    }

    const userMessage = `Item: ${label}
Current value: ${price}
7-day change: ${this.fmtPct(item.change7d)}
30-day change: ${this.fmtPct(item.change30d)}
Data as of: ${item.asOf}

Recent headlines from tracked feeds:
${headlinesText}`;

    const story = await this.localLlm.generate(MARKET_STORY_INSTRUCTION, userMessage);
    const result: MarketStoryResult = {
      symbol: symbol.toUpperCase(),
      story,
      dataAsOf: item.asOf,
      generatedAt: new Date().toISOString(),
      model: this.localLlm.modelName,
    };

    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', MARKET_STORY_CACHE_TTL_SECONDS);
    return result;
  }

  private fmtPct(value: number | null): string {
    if (value === null) return 'n/a';
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  }
}
