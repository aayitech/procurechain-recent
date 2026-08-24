'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, ExternalLink, XCircle } from 'lucide-react';
import { useLearningPath } from '@/hooks/useKnowledge';
import { DIMENSION_LABELS } from '@/lib/dimension-labels';

export function LearningPathDetailView({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useLearningPath(slug);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="card h-24 animate-pulse" />
        <div className="card h-64 animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card p-6 text-sm text-ink-muted">
        We don&apos;t have a learning path for &ldquo;{slug}&rdquo;.{' '}
        <Link href="/knowledge-centre" className="text-accent hover:underline">
          Back to the Knowledge Centre
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/knowledge-centre" className="text-sm text-ink-muted hover:text-ink">
        ← Knowledge Centre
      </Link>

      <div className="mt-4 mb-8">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent">
          {DIMENSION_LABELS[data.relatedDimension] ?? data.relatedDimension}
        </p>
        <h1 className="text-3xl font-semibold text-ink">{data.title}</h1>
        <p className="mt-2 text-ink-muted">{data.objective}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">Who it&apos;s for</p>
          <p className="text-sm text-ink-muted">{data.whoItIsFor}</p>
        </div>
        <div className="card p-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">When to use it</p>
          <p className="text-sm text-ink-muted">{data.whenToUseIt}</p>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-ink">Steps</p>
        <div className="flex flex-col gap-3">
          {data.steps.map((step, i) => (
            <div key={step.title} className="card flex gap-3 p-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{step.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.commonMistakes.length > 0 && (
        <div className="mt-8 card p-5">
          <p className="mb-3 text-sm font-medium text-ink">Common mistakes</p>
          <div className="flex flex-col gap-2">
            {data.commonMistakes.map((mistake) => (
              <div key={mistake} className="flex items-start gap-2 text-xs text-ink-muted">
                <XCircle size={13} className="mt-0.5 shrink-0 text-negative" />
                {mistake}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.relatedTools.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {data.relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1.5 text-xs text-ink-muted hover:border-accent hover:text-ink"
            >
              {tool.label}
              <ArrowRight size={11} />
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10">
        <p className="mb-3 text-sm font-medium text-ink">Resources</p>
        <div className="flex flex-col gap-3">
          {data.resources.map((resource) => (
            <div key={resource.url} className="card p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">
                  {resource.type}
                </span>
                <span className="text-[11px] text-ink-faint">{resource.source}</span>
              </div>
              <p className="text-sm font-medium text-ink">{resource.title}</p>
              <p className="mt-1 text-xs text-ink-muted">
                <span className="text-ink-faint">What you&apos;ll learn: </span>
                {resource.whatYouWillLearn}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                <span className="text-ink-faint">Why it matters: </span>
                {resource.whyItMatters}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  View original resource
                  <ExternalLink size={11} />
                </a>
                <span className="flex items-center gap-1 text-[10px] text-ink-faint">
                  <CheckCircle2 size={11} className="text-positive" />
                  Verified {resource.verifiedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-10 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink">Ready to see where this fits your own operation?</p>
        <Link
          href="/health-check"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Check Your Procurement Health
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
