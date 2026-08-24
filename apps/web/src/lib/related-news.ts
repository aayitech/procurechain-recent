import type { NewsArticle } from '@/types/news';

const STOP_WORDS = new Set(['the', 'and', 'for', 'usd', 'per']);

export function keywordsFrom(...phrases: string[]): string[] {
  const words = phrases
    .join(' ')
    .toLowerCase()
    .replace(/[()/,&-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
  return Array.from(new Set(words));
}

export function filterNewsByKeywords(articles: NewsArticle[], keywords: string[], limit = 6): NewsArticle[] {
  if (keywords.length === 0) return [];
  return articles
    .filter((article) => {
      const haystack = `${article.title} ${article.description}`.toLowerCase();
      return keywords.some((kw) => haystack.includes(kw));
    })
    .slice(0, limit);
}
