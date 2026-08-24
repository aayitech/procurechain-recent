export type IndicatorFrequency = 'daily' | 'monthly' | 'annual';

export interface ChangeStats {
  change7d: number | null;
  change30d: number | null;
  // The real period each number above represents — callers must display
  // this instead of a hardcoded "7d"/"30d" label. For daily data these are
  // literally "7d"/"30d"; for monthly/annual data the *labels* change but
  // the two numeric slots are reused so existing call sites don't need a
  // schema-wide rename.
  periodShortLabel: string;
  periodLongLabel: string | null;
}

/**
 * Given a price history sorted ascending by date, computes % change from
 * the closest point at least `days` before the latest entry. Returns null
 * when there isn't enough history yet rather than a misleading 0%.
 */
function changeAt<T extends { asOf: Date; price: number }>(history: T[], latest: T, days: number): number | null {
  const targetTime = latest.asOf.getTime() - days * 24 * 60 * 60 * 1000;
  let reference: T | null = null;

  for (const point of history) {
    if (point.asOf.getTime() <= targetTime) {
      reference = point;
    } else {
      break;
    }
  }

  if (!reference || reference.price === 0) {
    return null;
  }

  return ((latest.price - reference.price) / reference.price) * 100;
}

/**
 * Frequency-aware % change. A 7-day window means nothing for an indicator
 * that only gets a new data point once a month or once a year — comparing
 * "latest" against whatever point the date-window happens to land on
 * silently produces a MoM or YoY number mislabeled as "7d change". This
 * picks the comparison window that actually matches how often the
 * underlying series updates.
 */
export function computeChangeStats<T extends { asOf: Date; price: number }>(
  history: T[],
  frequency: IndicatorFrequency = 'daily',
): ChangeStats {
  if (history.length === 0) {
    return { change7d: null, change30d: null, periodShortLabel: '7d', periodLongLabel: '30d' };
  }

  const latest = history[history.length - 1];

  if (frequency === 'annual') {
    // Only one meaningful comparison for annual data: year-over-year.
    return {
      change7d: null,
      change30d: changeAt(history, latest, 365),
      periodShortLabel: 'YoY',
      periodLongLabel: null,
    };
  }

  if (frequency === 'monthly') {
    return {
      change7d: changeAt(history, latest, 30),
      change30d: changeAt(history, latest, 365),
      periodShortLabel: 'MoM',
      periodLongLabel: 'YoY',
    };
  }

  return {
    change7d: changeAt(history, latest, 7),
    change30d: changeAt(history, latest, 30),
    periodShortLabel: '7d',
    periodLongLabel: '30d',
  };
}

export function toCsv(rows: Array<Record<string, string | number>>): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => String(row[header])).join(','));
  }
  return lines.join('\n');
}
