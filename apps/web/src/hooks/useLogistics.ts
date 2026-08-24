'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { fetchFallbackPortConditions } from '@/lib/logistics-fallback';
import type { PortConditionsPayload } from '@/types/logistics';

export function usePortConditions() {
  return useQuery({
    queryKey: ['logistics', 'port-conditions'],
    queryFn: async () => {
      try {
        const payload = await apiClient.get<PortConditionsPayload>('/logistics/port-conditions');
        return payload.points.length > 0 ? payload : await fetchFallbackPortConditions();
      } catch {
        return fetchFallbackPortConditions();
      }
    },
    refetchInterval: 30 * 60 * 1000,
  });
}
