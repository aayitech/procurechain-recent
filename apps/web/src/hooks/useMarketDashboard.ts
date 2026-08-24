'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { buildFallbackDashboard } from '@/lib/market-fallback';
import type { DashboardPayload } from '@/types/market-data';

export function useMarketDashboard() {
  return useQuery({
    queryKey: ['market-data', 'dashboard'],
    queryFn: async () => {
      try {
        const payload = await apiClient.get<DashboardPayload>('/market-data/dashboard');
        if (payload.fx.length > 0 || payload.commodities.length > 0) {
          return payload;
        }
        // Our API answered but has nothing cached yet (e.g. fresh DB,
        // refresh cron hasn't run) — fall back rather than show an empty page.
        return buildFallbackDashboard();
      } catch {
        // Our API is unreachable entirely — same fallback.
        return buildFallbackDashboard();
      }
    },
    refetchInterval: 5 * 60 * 1000,
  });
}
