'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { HealthCheckQuestion, HealthCheckScoreResult, SubmitHealthCheckInput } from '@/types/health-check';
import { FALLBACK_HEALTH_CHECK_QUESTIONS, computeHealthCheckScoreFallback } from '@/lib/health-check-fallback';

export function useHealthCheckQuestions() {
  return useQuery({
    queryKey: ['health-check', 'questions'],
    queryFn: async () => {
      try {
        const questions = await apiClient.get<HealthCheckQuestion[]>('/health-check/questions');
        return questions.length > 0 ? questions : FALLBACK_HEALTH_CHECK_QUESTIONS;
      } catch {
        return FALLBACK_HEALTH_CHECK_QUESTIONS;
      }
    },
    staleTime: Infinity,
  });
}

export function useScoreHealthCheck() {
  return useMutation({
    mutationFn: async (answers: Record<string, string>) => {
      try {
        return await apiClient.post<HealthCheckScoreResult>('/health-check/score', { answers });
      } catch {
        return computeHealthCheckScoreFallback(answers);
      }
    },
  });
}

export function useSubmitHealthCheck() {
  return useMutation({
    mutationFn: async (input: SubmitHealthCheckInput) => {
      try {
        return await apiClient.post<HealthCheckScoreResult>('/health-check/submit', input);
      } catch {
        // Backend unreachable — score locally so the user still sees their
        // real result. The lead itself isn't captured/synced to GHL in
        // this case (there's no backend to persist it), which is the
        // honest tradeoff of a sandbox with no live API.
        return computeHealthCheckScoreFallback(input.answers);
      }
    },
  });
}
