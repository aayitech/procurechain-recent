'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { DataSourceRegistryEntry } from '@/types/data-source';

export function useDataSources() {
  return useQuery({
    queryKey: ['market-data', 'sources'],
    queryFn: () => apiClient.get<DataSourceRegistryEntry[]>('/market-data/sources'),
    staleTime: 10 * 60 * 1000,
  });
}
