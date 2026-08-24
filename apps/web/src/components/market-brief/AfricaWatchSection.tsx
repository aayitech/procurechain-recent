import type { MarketBriefAfricaEntry } from '@/types/market-brief';

function flagBadgeClasses(value: string) {
  if (value === 'elevated') return 'text-warning';
  if (value === 'no live data') return 'text-ink-faint';
  return 'text-positive';
}

export function AfricaWatchSection({ entries }: { entries: MarketBriefAfricaEntry[] }) {
  if (entries.length === 0) {
    return (
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Africa Procurement Watch</p>
        <div className="card p-5 text-xs text-ink-faint">No live African market signals tracked this week.</div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">Africa Procurement Watch</p>
      <p className="mb-3 text-[11px] text-ink-faint">
        Real tracked signals only — coverage is currently limited to countries with a tracked FX pair and/or trade route.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.country} className="card p-4">
            <p className="mb-2 text-sm font-medium text-ink">
              <span className="mr-1.5">{entry.flag}</span>
              {entry.country}
            </p>
            <div className="flex flex-col gap-1">
              {entry.signals.map((signal) => (
                <div key={signal.label} className="flex items-center justify-between text-xs">
                  <span className="text-ink-faint">{signal.label}</span>
                  <span className={`font-mono ${flagBadgeClasses(signal.value)}`}>{signal.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
