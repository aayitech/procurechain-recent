'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { AskInput, AskResponse, MarketStoryResponse } from '@/types/assistant';

export function useAskAssistant() {
  return useMutation({
    mutationFn: (input: AskInput) => apiClient.post<AskResponse>('/assistant/ask', input),
  });
}

export function useMarketStory(type: 'commodity' | 'fx', symbol: string | undefined) {
  return useQuery({
    queryKey: ['assistant', 'market-story', type, symbol],
    queryFn: () => apiClient.get<MarketStoryResponse>(`/assistant/market-story/${type}/${symbol}`),
    enabled: Boolean(symbol),
    retry: false,
    staleTime: 60 * 60 * 1000,
  });
}
