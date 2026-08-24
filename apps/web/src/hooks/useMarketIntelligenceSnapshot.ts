'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MarketIntelligenceSnapshot } from '@/types/market-intelligence-snapshot';

export function useMarketIntelligenceSnapshot() {
  return useQuery({
    queryKey: ['market-intelligence', 'snapshot'],
    queryFn: () => apiClient.get<MarketIntelligenceSnapshot>('/market-intelligence/snapshot'),
    retry: false,
    refetchInterval: 5 * 60 * 1000,
  });
}
