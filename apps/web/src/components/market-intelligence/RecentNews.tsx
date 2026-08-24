'use client';

import { useNews } from '@/hooks/useNews';

export function RecentNews() {
  const { data, isLoading, isError } = useNews();
  const items = (data ?? []).slice(0, 4);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Recent News</p>
        <a href="#news" className="text-[11px] text-accent hover:underline">
          View all
        </a>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-canvas-overlay" />
          ))}
        </div>
      )}

      {isError && <p className="text-sm text-ink-faint">News temporarily unavailable.</p>}

      {items.length > 0 && (
        <ul className="flex flex-col gap-3">
          {items.map((article) => (
            <li key={article.link}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-ink hover:text-accent"
              >
                {article.title}
              </a>
              <p className="text-[11px] text-ink-faint">{article.source}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
