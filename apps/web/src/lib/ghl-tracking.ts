import { apiClient } from './api-client';

export type GhlTrackingEvent =
  | { event: 'health_started' }
  | { event: 'health_completed'; scoreBand: 'Strong' | 'Developing' | 'Opportunity'; identifiedArea: string }
  | { event: 'calculator_used'; email?: string; calculator: string }
  | { event: 'follow_up_requested' | 'newsletter_subscribed' | 'nader_engaged' | 'benchmarking_used' | 'login'; email?: string; firstName?: string; lastName?: string; companyName?: string; phone?: string; message?: string; productInterest?: string; campaignFit?: string; campaignEntryAsset?: string; profile?: Record<string, unknown> };

const SENT_EVENTS_KEY = 'procurechain-ghl-events';

/** Best-effort CRM tracking, deduplicated per browser session and event. */
export function trackGhlEvent(event: GhlTrackingEvent): void {
  if (typeof window === 'undefined') return;

  const key = `${event.event}:${event.event === 'calculator_used' ? event.calculator : ''}`;
  try {
    const sent = JSON.parse(window.sessionStorage.getItem(SENT_EVENTS_KEY) || '[]') as string[];
    if (sent.includes(key)) return;
    sent.push(key);
    window.sessionStorage.setItem(SENT_EVENTS_KEY, JSON.stringify(sent));
  } catch (error) {
    console.error('Unable to record GHL tracking event:', error);
  }

  const attributionKey = 'procurechain-first-touch';
  let attribution: { landingPage?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string } = {};
  try {
    attribution = JSON.parse(window.sessionStorage.getItem(attributionKey) || '{}');
    if (!attribution.landingPage) {
      const params = new URLSearchParams(window.location.search);
      attribution = { landingPage: window.location.pathname };
      for (const name of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
        const value = params.get(name)?.trim();
        if (value) attribution[name] = value.slice(0, 200);
      }
      window.sessionStorage.setItem(attributionKey, JSON.stringify(attribution));
    }
  } catch { attribution = { landingPage: window.location.pathname }; }

  void apiClient.post<{ ok: boolean }>('/ghl-track', { ...event, ...attribution, utm: attribution })
    .catch((error) => console.error('GHL tracking request failed:', error));
}

export function getEmailFromUrl(): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('email')?.trim() ?? '';
}
