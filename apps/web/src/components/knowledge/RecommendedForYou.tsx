'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { loadHealthCheckResult } from '@/lib/health-check-storage';
import { useRecommendedPaths } from '@/hooks/useKnowledge';

export function RecommendedForYou() {
  const [weakestDimension, setWeakestDimension] = useState<string | undefined>(undefined);
  const [weakestLabel, setWeakestLabel] = useState<string | undefined>(undefined);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = loadHealthCheckResult();
    if (stored?.result.topOpportunities?.[0]) {
      setWeakestDimension(stored.result.topOpportunities[0].key);
      setWeakestLabel(stored.result.topOpportunities[0].label);
    }
    setChecked(true);
  }, []);

  const { data: recommended } = useRecommendedPaths(weakestDimension);

  if (!checked) return null;

  if (!weakestDimension) {
    return (
      <div className="card flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">
          Take the Procurement Health Check to get learning paths personalized to your biggest opportunity.
        </p>
        <Link
          href="/health-check"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Check Your Procurement Health
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-1 flex items-center gap-1.5">
        <Sparkles size={14} className="text-accent" />
        <p className="text-sm font-medium text-ink">Recommended for you</p>
      </div>
      <p className="mb-4 text-xs text-ink-faint">
        Your biggest opportunity from your Health Check is <span className="text-ink-muted">{weakestLabel}</span>.
      </p>
      {recommended && recommended.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {recommended.map((path) => (
            <Link
              key={path.slug}
              href={`/knowledge-centre/${path.slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1.5 text-xs text-ink-muted hover:border-accent hover:text-ink"
            >
              {path.title}
              <ArrowRight size={11} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-xs text-ink-faint">No learning paths for this dimension yet — check back soon.</p>
      )}
    </div>
  );
}
