import { ChangeBadge } from '@/components/market-intelligence/ChangeBadge';
import type { EconomicContextEntry } from '@/types/market-intelligence-snapshot';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function EconomicContextSection({ entries }: { entries: EconomicContextEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section className="container-page py-8">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Economic Context</h2>
      </div>
      <p className="mb-4 text-xs text-ink-faint">
        Supporting intelligence, shown with the real comparison period each indicator's own update
        frequency actually supports — never a fabricated short-term change on monthly/annual data.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <div key={entry.label} className="card p-4">
            <p className="text-xs text-ink-muted">{entry.label}</p>
            <p className="mt-1 font-mono text-lg text-ink">
              {entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              <span className="ml-1 text-xs text-ink-faint">{entry.unit.split('(')[0].trim()}</span>
            </p>
            <div className="mt-1 flex items-center justify-between">
              <ChangeBadge value={entry.change} label={entry.periodLabel} />
              <span className="text-[10px] text-ink-faint">{formatDate(entry.asOf)}</span>
            </div>
            <p className="mt-2 text-[10px] text-ink-faint">
              {entry.source} · {entry.frequency}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
