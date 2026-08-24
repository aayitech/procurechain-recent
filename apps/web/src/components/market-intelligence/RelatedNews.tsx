'use client';

import { useNews } from '@/hooks/useNews';
import { filterNewsByKeywords, keywordsFrom } from '@/lib/related-news';

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric' });
}

export function RelatedNews({ name, category }: { name: string; category: string }) {
  const { data, isLoading } = useNews();
  const keywords = keywordsFrom(name, category);
  const related = filterNewsByKeywords(data ?? [], keywords);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card h-16 animate-pulse" />
        ))}
      </div>
    );
  }

  if (related.length === 0) {
    return (
      <div className="card p-6 text-sm text-ink-muted">
        No recent headlines from our tracked feeds mention &ldquo;{name}&rdquo; — this checks
        real news, so an empty result means nothing matched, not that nothing was found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {related.map((article) => (
        <a
          key={article.link}
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="card block p-4 transition-colors hover:border-accent"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-accent">{article.source}</p>
          <h4 className="mt-1 text-sm font-medium text-ink">{article.title}</h4>
          <p className="mt-1 text-[11px] text-ink-faint">{formatTime(article.publishedAt)}</p>
        </a>
      ))}
    </div>
  );
}
