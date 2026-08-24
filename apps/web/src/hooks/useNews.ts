'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { fetchFallbackNews } from '@/lib/news-fallback';
import type { NewsArticle } from '@/types/news';

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const articles = await apiClient.get<NewsArticle[]>('/news');
        return articles.length > 0 ? articles : await fetchFallbackNews();
      } catch {
        return fetchFallbackNews();
      }
    },
    refetchInterval: 15 * 60 * 1000,
    retry: 1,
  });
}
