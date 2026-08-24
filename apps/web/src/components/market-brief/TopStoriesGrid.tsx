import type { MarketBriefTopStory } from '@/types/market-brief';

export function TopStoriesGrid({ stories }: { stories: MarketBriefTopStory[] }) {
  if (stories.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Top Stories</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stories.map((story) => (
          <a
            key={story.url}
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card group flex flex-col overflow-hidden p-0 transition-colors hover:border-accent"
          >
            {story.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={story.imageUrl} alt="" className="h-32 w-full object-cover" loading="lazy" />
            ) : (
              <div className="h-32 w-full bg-canvas-overlay" />
            )}
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <span className="text-[10px] uppercase tracking-wide text-ink-faint">{story.source}</span>
              <p className="text-sm font-medium leading-snug text-ink group-hover:text-accent">{story.title}</p>
              <p className="mt-auto text-xs text-ink-muted">{story.whyItMatters}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
