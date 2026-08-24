'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MarketBriefDetail, MarketBriefListEntry } from '@/types/market-brief';

export function useMarketBriefList() {
  return useQuery({
    queryKey: ['market-brief', 'list'],
    queryFn: () => apiClient.get<MarketBriefListEntry[]>('/market-brief'),
    retry: false,
  });
}

export function useMarketBriefDetail(slug: string) {
  return useQuery({
    queryKey: ['market-brief', slug],
    queryFn: () => apiClient.get<MarketBriefDetail>(`/market-brief/${slug}`),
    enabled: Boolean(slug),
    retry: false,
  });
}
