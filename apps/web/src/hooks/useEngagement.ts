'use client';

import { useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { getEngagementSessionId } from '@/lib/engagement';

export type EngagementEventType =
  | 'assessment_started'
  | 'assessment_completed'
  | 'result_viewed'
  | 'calculator_used'
  | 'ai_conversation_started';

export function useTrackEngagement() {
  return useCallback((eventType: EngagementEventType) => {
    const sessionId = getEngagementSessionId();
    if (!sessionId) return;
    // Fire-and-forget — engagement tracking should never block or break
    // the feature it's observing.
    apiClient.post('/engagement/track', { sessionId, eventType }).catch(() => {});
  }, []);
}
