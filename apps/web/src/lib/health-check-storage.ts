import type { HealthCheckScoreResult } from '@/types/health-check';

const STORAGE_KEY = 'procurechain-health-check-result';

export interface StoredHealthCheckResult {
  result: HealthCheckScoreResult;
  savedAt: string;
}

// No persistent auth/session store for this build, so the Benchmarking
// page reads the user's own last real result from their browser — never
// fabricated, just not server-persisted per-user yet.
export function saveHealthCheckResult(result: HealthCheckScoreResult): void {
  if (typeof window === 'undefined') return;
  const payload: StoredHealthCheckResult = { result, savedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadHealthCheckResult(): StoredHealthCheckResult | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredHealthCheckResult;
  } catch {
    return null;
  }
}
