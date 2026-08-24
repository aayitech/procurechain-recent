import type { AfricaWatchEntry } from '@/types/market-intelligence-snapshot';

function signalTone(value: string) {
  if (value === 'elevated') return 'text-warning';
  if (value === 'no live data') return 'text-ink-faint';
  return 'text-positive';
}

export function AfricaProcurementWatch({ entries }: { entries: AfricaWatchEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section className="container-page py-8">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-ink-faint">Africa Procurement Watch</h2>
      <p className="mb-4 text-xs text-ink-faint">
        Real tracked signals only — coverage is currently limited to countries with a tracked FX
        pair and/or trade route.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.country} className="card p-4">
            <p className="mb-2 text-sm font-medium text-ink">
              <span className="mr-1.5">{entry.flag}</span>
              {entry.country}
            </p>
            {entry.headline ? (
              <a href={entry.headline.url} target="_blank" rel="noopener noreferrer" className="mb-2 block text-xs text-ink-muted hover:text-accent">
                {entry.headline.title}
                <span className="ml-1 text-ink-faint">· {entry.headline.source}</span>
              </a>
            ) : (
              <p className="mb-2 text-xs text-ink-faint">No tracked headlines this week.</p>
            )}
            <div className="flex flex-col gap-1">
              {entry.signals.map((signal) => (
                <div key={signal.label} className="flex items-center justify-between text-xs">
                  <span className="text-ink-faint">{signal.label}</span>
                  <span className={`font-mono ${signalTone(signal.value)}`}>{signal.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
