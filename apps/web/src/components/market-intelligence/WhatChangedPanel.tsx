'use client';

import { useNews } from '@/hooks/useNews';
import { filterNewsByKeywords, keywordsFrom } from '@/lib/related-news';
import { ChangeBadge } from './ChangeBadge';

function formatTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * "What changed, and why" — pairs the real 7-day price move with real
 * headlines that actually match this commodity's name/category. No causal
 * claim is invented: if a headline mentions it, it's shown; if the price
 * moved and nothing matched, that's shown honestly too.
 */
export function WhatChangedPanel({
  name,
  category,
  change7d,
  periodLabel = '7d',
}: {
  name: string;
  category: string;
  change7d: number | null;
  periodLabel?: string;
}) {
  const { data } = useNews();
  const keywords = keywordsFrom(name, category);
  const matches = filterNewsByKeywords(data ?? [], keywords, 3);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">What changed, and why</p>
        <ChangeBadge value={change7d} label={periodLabel} />
      </div>

      {matches.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {matches.map((article) => (
            <li key={article.link}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-ink hover:text-accent"
              >
                {article.title}
              </a>
              <span className="ml-1.5 text-[10px] text-ink-faint">
                {article.source} · {formatTime(article.publishedAt)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-ink-faint">
          No headlines from our tracked feeds mention &ldquo;{name}&rdquo; right now — the price
          move above isn&apos;t explained by anything in the news panel today.
        </p>
      )}
    </div>
  );
}
