'use client';

import { Newspaper } from 'lucide-react';
import { useNews } from '@/hooks/useNews';

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function NewsFeedCard() {
  const { data, isLoading } = useNews();
  const items = (data ?? []).slice(0, 7);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Latest Market News</p>
        <span className="text-[10px] text-ink-faint">Live from tracked feeds</span>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-canvas-overlay" />
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <p className="text-xs text-ink-faint">No live headlines available right now.</p>
      )}

      <ul className="flex flex-col gap-3">
        {items.map((article) => (
          <li key={article.link} className="flex gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-canvas-overlay text-ink-faint">
              <Newspaper size={13} />
            </div>
            <div className="min-w-0">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm text-ink hover:text-accent"
              >
                {article.title}
              </a>
              <p className="text-[10px] text-ink-faint">
                {article.source} · {formatTime(article.publishedAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
