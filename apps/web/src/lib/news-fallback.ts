import type { NewsArticle } from '@/types/news';

// Only feeds that actually send Access-Control-Allow-Origin can be fetched
// directly from the browser. SupplyChainBrain doesn't, so it's only
// available via our own backend, not this fallback.
const BROWSER_FETCHABLE_FEEDS = [
  { url: 'https://www.supplychaindive.com/feeds/news/', source: 'Supply Chain Dive' },
  { url: 'https://www.xeneta.com/blog/rss.xml', source: 'Xeneta' },
];

function stripHtml(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImageUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const match = /<img[^>]+src="([^"]+)"/i.exec(input);
  return match ? match[1] : null;
}

async function fetchFeed(feed: { url: string; source: string }): Promise<NewsArticle[]> {
  try {
    const response = await fetch(feed.url);
    if (!response.ok) return [];

    const xml = await response.text();
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    if (doc.querySelector('parsererror')) return [];

    return Array.from(doc.querySelectorAll('item')).map((item) => {
      const title = stripHtml(item.querySelector('title')?.textContent);
      const link = item.querySelector('link')?.textContent?.trim() ?? '';
      const pubDate = item.querySelector('pubDate')?.textContent;
      const rawDescription = item.querySelector('description')?.textContent;
      const description = stripHtml(rawDescription).slice(0, 220);
      return {
        title,
        link,
        source: feed.source,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        description,
        imageUrl: extractImageUrl(rawDescription),
      };
    }).filter((article) => article.title && article.link);
  } catch {
    return [];
  }
}

export async function fetchFallbackNews(): Promise<NewsArticle[]> {
  const results = await Promise.all(BROWSER_FETCHABLE_FEEDS.map(fetchFeed));
  const merged = results.flat();
  merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return merged;
}
