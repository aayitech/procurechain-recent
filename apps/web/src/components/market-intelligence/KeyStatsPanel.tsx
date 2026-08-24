import type { HistoryPoint } from '@/types/market-data';
import { computeVolatility } from '@/lib/chart-stats';

export function KeyStatsPanel({
  history,
  unit,
  change7d,
  change30d,
  source,
}: {
  history: HistoryPoint[];
  unit: string;
  change7d: number | null;
  change30d: number | null;
  source: string;
}) {
  const prices = history.map((p) => p.price);
  const periodHigh = Math.max(...prices);
  const periodLow = Math.min(...prices);
  const volatility = computeVolatility(history);

  const rows: Array<[string, string]> = [
    ['Period high', periodHigh.toFixed(2)],
    ['Period low', periodLow.toFixed(2)],
    ['7d change', change7d === null ? '—' : `${change7d >= 0 ? '+' : ''}${change7d.toFixed(2)}%`],
    ['30d change', change30d === null ? '—' : `${change30d >= 0 ? '+' : ''}${change30d.toFixed(2)}%`],
    ['Volatility', volatility === null ? '—' : `${volatility.toFixed(2)}%`],
    ['Data points', String(history.length)],
  ];

  return (
    <div className="card p-4">
      <p className="mb-3 text-sm font-medium text-ink">Key Statistics</p>
      <dl className="flex flex-col gap-2 text-xs">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <dt className="text-ink-faint">{label}</dt>
            <dd className="font-mono text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 border-t border-border-subtle pt-2 text-[10px] text-ink-faint">
        Volatility = standard deviation of period-over-period % change. Unit: {unit}. Source: {source}
      </p>
    </div>
  );
}
