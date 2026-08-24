import { Inject, Injectable, Logger } from '@nestjs/common';
import type Redis from 'ioredis';
import { XMLParser } from 'fast-xml-parser';
import { REDIS_CLIENT } from '../redis/redis.module';

const NEWS_CACHE_KEY = 'news:latest';
const NEWS_CACHE_TTL_SECONDS = 15 * 60;

export interface NewsArticle {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  description: string;
  imageUrl: string | null;
}

interface FeedDefinition {
  url: string;
  source: string;
}

// Publisher-owned RSS feeds intended for syndication — not Google News'
// aggregation feed, whose terms restrict use to personal, non-commercial
// feed readers. These are real trade-press feeds published by the outlets
// themselves.
const FEEDS: FeedDefinition[] = [
  { url: 'https://www.supplychaindive.com/feeds/news/', source: 'Supply Chain Dive' },
  { url: 'https://www.supplychainbrain.com/rss/articles', source: 'SupplyChainBrain' },
  { url: 'https://www.xeneta.com/blog/rss.xml', source: 'Xeneta' },
];

function stripHtml(input: string | undefined): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Some feeds (e.g. Supply Chain Dive) embed a real photo as an <img> tag
// inside the HTML description rather than a proper <enclosure>/<media:*>
// tag — real image, just needs pulling out before we strip the HTML.
function extractImageUrl(input: string | undefined): string | null {
  if (!input) return null;
  const match = /<img[^>]+src="([^"]+)"/i.exec(input);
  return match ? match[1] : null;
}

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private readonly parser = new XMLParser({ ignoreAttributes: false });

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async getLatest(): Promise<NewsArticle[]> {
    const cached = await this.redis.get(NEWS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as NewsArticle[];
    }

    const results = await Promise.allSettled(FEEDS.map((feed) => this.fetchFeed(feed)));
    const articles = results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));

    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const trimmed = articles.slice(0, 40);

    if (trimmed.length > 0) {
      await this.redis.set(NEWS_CACHE_KEY, JSON.stringify(trimmed), 'EX', NEWS_CACHE_TTL_SECONDS);
    }

    return trimmed;
  }

  private async fetchFeed(feed: FeedDefinition): Promise<NewsArticle[]> {
    try {
      const response = await fetch(feed.url, {
        headers: { 'User-Agent': 'ProcureChainIntelligenceHub/0.1 (+news aggregator)' },
      });
      if (!response.ok) {
        this.logger.warn(`Feed request failed for ${feed.source}: ${response.status}`);
        return [];
      }

      const xml = await response.text();
      const parsed = this.parser.parse(xml);
      const items = parsed?.rss?.channel?.item ?? [];
      const itemArray = Array.isArray(items) ? items : [items];

      return itemArray
        .filter((item) => item?.title && item?.link)
        .map((item) => ({
          title: stripHtml(String(item.title)),
          link: String(item.link),
          source: feed.source,
          publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          description: stripHtml(String(item.description ?? '')).slice(0, 220),
          imageUrl: extractImageUrl(item.description ? String(item.description) : undefined),
        }));
    } catch (error) {
      this.logger.warn(`Feed fetch threw for ${feed.source}: ${(error as Error).message}`);
      return [];
    }
  }
}
