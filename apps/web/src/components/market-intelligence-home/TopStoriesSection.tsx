import Link from 'next/link';
import { ImpactBadge } from './ImpactBadge';
import type { TopStory } from '@/types/market-intelligence-snapshot';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function TopStoriesSection({ stories }: { stories: TopStory[] }) {
  if (stories.length === 0) return null;

  return (
    <section className="container-page py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Top Procurement Stories</h2>
        <Link href="/market-intelligence#news" className="text-xs text-accent hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stories.map((story) => (
          <a
            key={story.url}
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card group flex flex-col overflow-hidden p-0 transition-colors hover:border-accent"
          >
            <div className="relative">
              {story.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={story.imageUrl} alt="" className="h-28 w-full object-cover" loading="lazy" />
              ) : (
                <div className="h-28 w-full bg-canvas-overlay" />
              )}
              <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white">
                {story.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-3.5">
              <p className="text-sm font-medium leading-snug text-ink group-hover:text-accent">{story.title}</p>
              <p className="text-xs text-ink-muted">{story.summary}</p>
              <div className="mt-auto flex items-center justify-between pt-1">
                <ImpactBadge level={story.impact} />
                <span className="text-[10px] text-ink-faint">{formatDate(story.publishedAt)}</span>
              </div>
              <span className="text-[10px] text-ink-faint">{story.source}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
