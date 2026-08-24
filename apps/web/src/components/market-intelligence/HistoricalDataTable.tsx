import type { HistoryPoint } from '@/types/market-data';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function HistoricalDataTable({ history, unit }: { history: HistoryPoint[]; unit: string }) {
  return (
    <div className="card max-h-96 overflow-y-auto p-5">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-canvas-raised">
          <tr className="text-ink-faint">
            <th className="pb-2 font-medium">Date</th>
            <th className="pb-2 font-medium">Value ({unit})</th>
          </tr>
        </thead>
        <tbody className="font-mono text-ink-muted">
          {[...history].reverse().map((point) => (
            <tr key={point.asOf} className="border-t border-border-subtle">
              <td className="py-1.5">{formatDate(point.asOf)}</td>
              <td className="py-1.5">{point.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
