'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { LearningPathDetail, LearningPathListEntry, RecommendedPath } from '@/types/knowledge';

export function useLearningPaths() {
  return useQuery({
    queryKey: ['knowledge', 'paths'],
    queryFn: () => apiClient.get<LearningPathListEntry[]>('/knowledge/paths'),
    retry: false,
    staleTime: Infinity,
  });
}

export function useLearningPath(slug: string) {
  return useQuery({
    queryKey: ['knowledge', 'paths', slug],
    queryFn: () => apiClient.get<LearningPathDetail>(`/knowledge/paths/${slug}`),
    enabled: Boolean(slug),
    retry: false,
  });
}

export function useRecommendedPaths(dimension: string | undefined) {
  return useQuery({
    queryKey: ['knowledge', 'recommended', dimension],
    queryFn: () => apiClient.get<RecommendedPath[]>(`/knowledge/recommended/${dimension}`),
    enabled: Boolean(dimension),
    retry: false,
  });
}
