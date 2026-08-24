interface ChangeCarrier {
  change7d: number | null;
}

/**
 * Composite score derived from the actual 7-day volatility of whatever
 * commodity/FX entries are passed in — not an independently fabricated
 * number. A simple average-volatility proxy, not a validated risk model.
 */
export function computeRiskScore(entries: ChangeCarrier[]): number | null {
  const changes = entries.map((e) => e.change7d).filter((v): v is number => v !== null).map(Math.abs);
  if (changes.length === 0) return null;
  const avg = changes.reduce((sum, v) => sum + v, 0) / changes.length;
  return Math.min(100, Math.round(avg * 12));
}
