'use client';

import { useEffect, useState } from 'react';
import { useHealthCheckQuestions, useScoreHealthCheck } from '@/hooks/useHealthCheck';
import { useTrackEngagement } from '@/hooks/useEngagement';
import { HealthCheckWizard } from '@/components/health-check/HealthCheckWizard';
import { HealthCheckResult } from '@/components/health-check/HealthCheckResult';
import { captureCampaignAttribution, getCampaignAttribution, leadAttributionFields } from '@/lib/campaign-attribution';
import { trackGhlEvent } from '@/lib/ghl-tracking';
import { PasswordlessAuthForm } from '@/components/auth/PasswordlessAuthForm';
import { useAuthStore } from '@/store/auth-store';

type Phase = 'wizard' | 'result';

export default function HealthCheckPage() {
  const [phase, setPhase] = useState<Phase>('wizard');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { data: questions, isLoading } = useHealthCheckQuestions();
  const { mutate: scoreMutate, data: result, isPending: isScoring } = useScoreHealthCheck();
  const track = useTrackEngagement();
  const { hydrated, user } = useAuthStore();

  useEffect(() => {
    captureCampaignAttribution(window.location.search);
  }, []);

  useEffect(() => {
    if (phase !== 'result' || !result) return;
    const weakest = [...result.dimensions].sort((a, b) => a.score - b.score)[0];
    const band = result.overallScore >= 75 ? 'Strong' : result.overallScore >= 40 ? 'Developing' : 'Opportunity';
    trackGhlEvent({ event: 'health_completed', scoreBand: band, identifiedArea: result.topOpportunities[0]?.label ?? weakest?.label ?? 'General' });
  }, [phase, result]);

  function handleComplete(finalAnswers: Record<string, string>) {
    setAnswers(finalAnswers);
    submitAnswers(finalAnswers);
  }

  function submitAnswers(finalAnswers: Record<string, string>) {
    scoreMutate(finalAnswers, {
      onSuccess: () => {
        track('assessment_completed', leadAttributionFields(getCampaignAttribution(), 'procurement-health-check'));
        setPhase('result');
      },
    });
  }

  if (!hydrated) return <div className="container-page py-20 text-center text-sm text-ink-muted">Checking your login…</div>;
  if (!user) return <PasswordlessAuthForm mode="LOGIN" />;

  return (
    <div className="container-page py-16">
      {phase === 'wizard' && (
        isLoading || !questions ? (
          <div className="mx-auto max-w-2xl">
            <div className="h-2 w-full animate-pulse rounded-full bg-canvas-overlay" />
            <div className="mt-8 h-24 animate-pulse rounded-xl2 bg-canvas-overlay" />
          </div>
        ) : (
          <HealthCheckWizard questions={questions} onComplete={handleComplete} onFirstAnswer={() => trackGhlEvent({ event: 'health_started' })} />
        )
      )}

      {phase === 'wizard' && isScoring && (
        <p className="mt-6 text-center text-sm text-ink-faint">Scoring your responses…</p>
      )}

      {phase === 'result' && result && <HealthCheckResult result={result} answers={answers} email={user.email} />}
    </div>
  );
}
