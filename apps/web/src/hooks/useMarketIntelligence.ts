'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  fetchFallbackFxDetail,
  fetchFallbackFxList,
  getSampleCommodityDetail,
  getSampleCommodityList,
} from '@/lib/market-fallback';
import type { CommodityDetail, CommodityListEntry, FxDetail, FxListEntry } from '@/types/market-data';

export function useCommodityList() {
  return useQuery({
    queryKey: ['market-data', 'commodities'],
    queryFn: async () => {
      try {
        const list = await apiClient.get<CommodityListEntry[]>('/market-data/commodities');
        return list.length > 0 ? list : getSampleCommodityList();
      } catch {
        return getSampleCommodityList();
      }
    },
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useCommodityDetail(symbol: string) {
  return useQuery({
    queryKey: ['market-data', 'commodities', symbol],
    queryFn: async () => {
      try {
        return await apiClient.get<CommodityDetail>(`/market-data/commodities/${symbol}`);
      } catch {
        const sample = getSampleCommodityDetail(symbol);
        if (!sample) throw new Error(`No data for ${symbol}`);
        return sample;
      }
    },
    enabled: Boolean(symbol),
  });
}

export function useFxList() {
  return useQuery({
    queryKey: ['market-data', 'fx-list'],
    queryFn: async () => {
      try {
        const list = await apiClient.get<FxListEntry[]>('/market-data/fx');
        return list.length > 0 ? list : await fetchFallbackFxList();
      } catch {
        return fetchFallbackFxList();
      }
    },
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useFxDetail(code: string) {
  return useQuery({
    queryKey: ['market-data', 'fx', code],
    queryFn: async () => {
      try {
        return await apiClient.get<FxDetail>(`/market-data/fx/${code}`);
      } catch {
        const fallback = await fetchFallbackFxDetail(code);
        if (!fallback) throw new Error(`No data for ${code}`);
        return fallback;
      }
    },
    enabled: Boolean(code),
  });
}
