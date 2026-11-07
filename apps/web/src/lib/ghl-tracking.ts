export type GhlTrackingEvent =
  | { event: 'health_started'; email: string }
  | { event: 'health_completed'; email: string; scoreBand: 'Strong' | 'Developing' | 'Opportunity'; identifiedArea: string; firstName?: string; companyName?: string }
  | { event: 'calculator_used'; email: string; calculator: 'RFQ Efficiency' | 'TCO' | 'Savings' };

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

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const name of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const value = params.get(name)?.trim();
    if (value) utm[name] = value.slice(0, 200);
  }

  void fetch('/api/ghl-track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...event, utm }),
  }).then((response) => {
    if (!response.ok) console.error('GHL tracking request failed:', response.status);
  }).catch((error) => console.error('GHL tracking request failed:', error));
}

export function getEmailFromUrl(): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('email')?.trim() ?? '';
}
