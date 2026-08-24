// Real, trackable events only — the business's own spec (master prompt
// section 41) lists more (email_open, meeting_booked, meaningful_reply,
// workflow_viewed) that this build has no real signal for yet (no email
// system, no booking flow, no workflow demo pages). Only including what
// this app can genuinely observe rather than a fake counter that never
// increments for the untracked ones.
export const ENGAGEMENT_EVENT_POINTS: Record<string, number> = {
  assessment_started: 10,
  assessment_completed: 25,
  result_viewed: 10,
  calculator_used: 15,
  ai_conversation_started: 30,
};

export type EngagementEventType = keyof typeof ENGAGEMENT_EVENT_POINTS;

export interface EngagementCategory {
  key: string;
  label: string;
  min: number;
  max: number;
}

// Thresholds exactly as specified: 0-30 Cold, 31-60 Engaged, 61-100 Warm, 101+ High Intent.
export const ENGAGEMENT_CATEGORIES: EngagementCategory[] = [
  { key: 'cold', label: 'Cold', min: 0, max: 30 },
  { key: 'engaged', label: 'Engaged', min: 31, max: 60 },
  { key: 'warm', label: 'Warm', min: 61, max: 100 },
  { key: 'high_intent', label: 'High Intent', min: 101, max: Infinity },
];

export function categorizeEngagementScore(score: number): EngagementCategory {
  return ENGAGEMENT_CATEGORIES.find((c) => score >= c.min && score <= c.max) ?? ENGAGEMENT_CATEGORIES[0];
}
