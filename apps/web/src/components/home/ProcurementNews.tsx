'use client';

import { useMemo, useState } from 'react';
import { useNews } from '@/hooks/useNews';

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function ProcurementNews() {
  const { data, isLoading, isError } = useNews();
  const [sourceFilter, setSourceFilter] = useState('All');
  const [query, setQuery] = useState('');

  const sources = useMemo(() => {
    if (!data) return ['All'];
    return ['All', ...Array.from(new Set(data.map((a) => a.source)))];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((article) => {
      const matchesSource = sourceFilter === 'All' || article.source === sourceFilter;
      const matchesQuery =
        !query.trim() ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase());
      return matchesSource && matchesQuery;
    });
  }, [data, sourceFilter, query]);

  return (
    <section id="news" className="container-page py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Procurement &amp; Supply Chain News</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Live headlines from Supply Chain Dive, SupplyChainBrain, and Xeneta — not summarized or
            rewritten, linking straight to the original source.
          </p>
        </div>
      </div>

      {data && data.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter headlines..."
            className="rounded-lg border border-border bg-canvas-raised px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {sources.map((source) => (
              <button
                key={source}
                type="button"
                onClick={() => setSourceFilter(source)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  sourceFilter === source
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-subtle text-ink-muted hover:text-ink'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-32 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="card p-6 text-sm text-ink-muted">
          News is temporarily unavailable — the feed aggregator couldn&apos;t be reached.
        </div>
      )}

      {data && data.length === 0 && !isLoading && (
        <div className="card p-6 text-sm text-ink-muted">No headlines available right now.</div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <a
              key={article.link}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex flex-col justify-between p-5 transition-colors hover:border-accent"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-accent">{article.source}</p>
                <h3 className="mt-2 text-sm font-semibold leading-snug text-ink">{article.title}</h3>
                {article.description && (
                  <p className="mt-2 line-clamp-3 text-xs text-ink-faint">{article.description}</p>
                )}
              </div>
              <p className="mt-4 text-[11px] text-ink-faint">{formatTime(article.publishedAt)}</p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
