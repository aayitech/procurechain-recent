'use client';

import { useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { getEngagementSessionId } from '@/lib/engagement';
import { getCampaignAttribution } from '@/lib/campaign-attribution';
import type { CampaignAttribution } from '@/lib/campaign-attribution';

export type EngagementEventType =
  | 'campaign_landing_viewed'
  | 'assessment_started'
  | 'assessment_completed'
  | 'result_viewed'
  | 'calculator_used'
  | 'calculator_exported'
  | 'market_intelligence_viewed'
  | 'ai_conversation_started'
  | 'newsletter_subscribed';

export function useTrackEngagement() {
  return useCallback((eventType: EngagementEventType, metadata: CampaignAttribution = {}) => {
    const sessionId = getEngagementSessionId();
    if (!sessionId) return;
    // Fire-and-forget — engagement tracking should never block or break
    // the feature it's observing.
    apiClient.post('/engagement/track', {
      sessionId,
      eventType,
      metadata: { ...getCampaignAttribution(), ...metadata },
    }).catch(() => {});
  }, []);
}
