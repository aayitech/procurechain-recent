'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { HealthCheckLeadInput, HealthCheckScoreResult } from '@/types/health-check';
import { useSubmitHealthCheck } from '@/hooks/useHealthCheck';
import { useTrackEngagement } from '@/hooks/useEngagement';
import { getEngagementSessionId } from '@/lib/engagement';
import { saveHealthCheckResult } from '@/lib/health-check-storage';
import { DimensionRadarChart } from './DimensionRadarChart';
import { HealthCheckLeadGate, type HealthCheckLeadFormValues } from './HealthCheckLeadGate';

function scoreColor(score: number) {
  if (score >= 75) return 'text-positive';
  if (score >= 40) return 'text-warning';
  return 'text-negative';
}

export function HealthCheckResult({ result, answers }: { result: HealthCheckScoreResult; answers: Record<string, string> }) {
  const { mutate, isPending, data: unlockedResult } = useSubmitHealthCheck();
  const track = useTrackEngagement();

  const shown = unlockedResult ?? result;
  const unlocked = Boolean(unlockedResult);

  useEffect(() => {
    track('result_viewed');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveHealthCheckResult(shown);
  }, [shown]);

  function handleLeadSubmit(values: HealthCheckLeadFormValues) {
    const lead: HealthCheckLeadInput = {
      firstName: values.firstName,
      lastName: values.lastName || undefined,
      email: values.email,
      company: values.company || undefined,
      jobTitle: values.jobTitle || undefined,
      country: values.country || undefined,
      industry: values.industry || undefined,
    };
    mutate({ answers, lead, sessionId: getEngagementSessionId() });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">Procurement Performance Index</p>
        <p className={`mt-1 text-6xl font-semibold ${scoreColor(shown.overallScore)}`}>{Math.round(shown.overallScore)}</p>
        <p className="text-sm text-ink-faint">out of 100</p>
        <span className="mt-3 inline-block rounded-full bg-canvas-overlay px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink">
          {shown.maturity.label}
        </span>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">{shown.maturity.description}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <p className="mb-2 text-sm font-medium text-ink">Dimension breakdown</p>
          <DimensionRadarChart dimensions={shown.dimensions} />
        </div>
        <div className="card flex flex-col justify-center gap-3 p-5">
          {shown.dimensions.map((d) => (
            <div key={d.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink-muted">{d.label}</span>
                <span className="font-mono text-ink">{Math.round(d.score)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-overlay">
                <div className="h-full rounded-full bg-accent" style={{ width: `${d.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-1.5">
          <Sparkles size={14} className="text-accent" />
          <p className="text-sm font-medium text-ink">Your biggest optimization opportunities</p>
        </div>

        <div className="flex flex-col gap-3">
          {shown.topOpportunities.slice(0, unlocked ? 3 : 1).map((opp) => (
            <div key={opp.key} className="card p-5">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-sm font-medium text-ink">{opp.label}</p>
                <span className="font-mono text-sm text-ink-muted">{Math.round(opp.score)} / 100</span>
              </div>
              <p className="text-xs text-ink-muted">{opp.opportunityLabel}</p>
              <ul className="mt-3 flex flex-col gap-1">
                {opp.actions.map((action) => (
                  <li key={action} className="text-xs text-ink-faint">
                    → {action}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {opp.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1 text-xs text-ink-muted hover:border-accent hover:text-ink"
                  >
                    {link.label}
                    <ArrowRight size={11} />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {!unlocked && (
            <HealthCheckLeadGate isPending={isPending} onSubmit={handleLeadSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}
