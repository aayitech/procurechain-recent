import type { WatchEntry } from '@/types/market-intelligence-snapshot';

const DOT_TONE: Record<WatchEntry['severity'], string> = {
  High: 'bg-negative',
  Medium: 'bg-warning',
  Watch: 'bg-ink-faint',
};

export function WhatToWatchCard({ entries }: { entries: WatchEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="card p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">What to Watch</p>
      <div className="flex flex-col gap-2">
        {entries.map((entry) => (
          <div key={entry.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-ink-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${DOT_TONE[entry.severity]}`} />
              {entry.label}
            </span>
            <span className="text-ink-faint">{entry.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
