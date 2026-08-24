const SESSION_KEY = 'procurechain-engagement-session';

// A stable anonymous id for this browser, used to accumulate engagement
// points before we know who someone is — linked to their real contact
// record server-side once they submit a lead form (Health Check, a gated
// calculator download, etc.).
export function getEngagementSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
