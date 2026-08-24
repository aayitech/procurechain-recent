import type { MarketBriefHeadlineRef } from '@/types/market-brief';

export function CategoryIntelligence({ categories }: { categories: Record<string, MarketBriefHeadlineRef[]> }) {
  const entries = Object.entries(categories).filter(([, items]) => items.length > 0);
  if (entries.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Supplier &amp; Industry Intelligence</p>
      <div className="card divide-y divide-border-subtle p-0">
        {entries.map(([category, items]) => (
          <div key={category} className="flex flex-col gap-1.5 p-4 sm:flex-row sm:gap-4">
            <span className="w-32 shrink-0 text-xs font-medium text-ink">{category}</span>
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ink-muted hover:text-accent"
                >
                  {item.title} <span className="text-ink-faint">· {item.source}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
