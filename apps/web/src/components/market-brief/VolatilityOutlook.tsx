import type { MarketBriefVolatilityEntry } from '@/types/market-brief';

const BUCKET_DOTS: Record<MarketBriefVolatilityEntry['bucket'], number> = { Low: 1, Moderate: 3, Elevated: 5 };

function Dots({ filled }: { filled: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < filled ? 'bg-accent' : 'bg-canvas-overlay'}`}
        />
      ))}
    </span>
  );
}

export function VolatilityOutlook({ entries }: { entries: MarketBriefVolatilityEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">Next Week: Recent Volatility</p>
      <p className="mb-3 text-[11px] text-ink-faint">
        Standard deviation of daily % change over the last tracked points — a real, computed measure, not a
        forecast or confidence score.
      </p>
      <div className="card divide-y divide-border-subtle p-0">
        {entries.map((entry) => (
          <div key={entry.label} className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs">
            <span className="text-ink-muted">{entry.label}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-ink-faint">{entry.stddevPct.toFixed(2)}%</span>
              <Dots filled={BUCKET_DOTS[entry.bucket]} />
              <span className="w-16 text-right text-ink-faint">{entry.bucket}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
