import type { MarketBriefHeadlineRef } from '@/types/market-brief';
import type { PortCondition } from '@/types/logistics';

function flagClasses(flag: PortCondition['operationalFlag']) {
  if (flag === 'elevated') return 'bg-warning/10 text-warning';
  if (flag === 'unavailable') return 'text-ink-faint';
  return 'text-positive';
}

export function LogisticsFreightSection({
  headline,
  portConditions,
}: {
  headline: MarketBriefHeadlineRef | null;
  portConditions: PortCondition[];
}) {
  if (!headline && portConditions.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Freight &amp; Logistics</p>
      <div className="card p-5">
        {headline && (
          <a href={headline.url} target="_blank" rel="noopener noreferrer" className="mb-4 block">
            <p className="text-sm font-medium text-ink hover:text-accent">{headline.title}</p>
            <p className="text-[11px] text-ink-faint">{headline.source}</p>
          </a>
        )}
        {portConditions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {portConditions.map((port) => (
              <span
                key={port.id}
                title={`${port.weatherDescription}${port.windGustsKmh !== null ? ` · gusts ${port.windGustsKmh.toFixed(0)} km/h` : ''}`}
                className={`inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-2.5 py-1 text-[11px] ${flagClasses(port.operationalFlag)}`}
              >
                {port.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
