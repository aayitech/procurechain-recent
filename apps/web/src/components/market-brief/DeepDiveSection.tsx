import type { MarketBriefDeepDive } from '@/types/market-brief';

const FIELDS: Array<{ key: keyof MarketBriefDeepDive; label: string }> = [
  { key: 'whatHappened', label: 'What happened' },
  { key: 'whyItMatters', label: 'Why it matters' },
  { key: 'whatToWatch', label: 'What to watch' },
  { key: 'procurementExposure', label: 'Procurement exposure' },
];

export function DeepDiveSection({ deepDive }: { deepDive: MarketBriefDeepDive | null }) {
  if (!deepDive) return null;

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Deep Dive</p>
      <div className="card overflow-hidden p-0">
        {deepDive.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={deepDive.imageUrl} alt="" className="h-48 w-full object-cover" loading="lazy" />
        )}
        <div className="p-6">
          <span className="text-[10px] uppercase tracking-wide text-ink-faint">{deepDive.source}</span>
          <h3 className="mt-1 text-lg font-semibold text-ink">{deepDive.title}</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map(({ key, label }) => (
              <div key={key}>
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">{label}</p>
                <p className="text-sm text-ink-muted">{deepDive[key] as string}</p>
              </div>
            ))}
          </div>
          <a
            href={deepDive.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs text-accent hover:underline"
          >
            Read the original story →
          </a>
        </div>
      </div>
    </div>
  );
}
