'use client';

import Link from 'next/link';
import { BookOpen, Clock } from 'lucide-react';
import { useLearningPaths } from '@/hooks/useKnowledge';
import { DIMENSION_LABELS } from '@/lib/dimension-labels';

export function LearningPathGrid() {
  const { data, isLoading, isError } = useLearningPaths();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card p-6 text-sm text-ink-muted">
        Couldn&apos;t load the Knowledge Centre right now — this needs the API server running.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((path) =>
        path.comingSoon ? (
          <div key={path.slug} className="card p-5 opacity-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-canvas-overlay text-ink-faint">
              <BookOpen size={16} />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-ink">{path.title}</h3>
            <p className="mt-2 text-[11px] uppercase tracking-wide text-ink-faint">Coming soon</p>
          </div>
        ) : (
          <Link
            key={path.slug}
            href={`/knowledge-centre/${path.slug}`}
            className="card block p-5 transition-all hover:-translate-y-0.5 hover:border-accent"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <BookOpen size={16} />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-ink">{path.title}</h3>
            <p className="mt-1 text-xs text-ink-faint">{path.objective}</p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-ink-faint">
              <span>{DIMENSION_LABELS[path.relatedDimension] ?? path.relatedDimension}</span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {path.resourceCount} resources
              </span>
            </div>
          </Link>
        ),
      )}
    </div>
  );
}
