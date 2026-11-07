'use client';

import { useEffect, useState } from 'react';
import { useHealthCheckQuestions, useScoreHealthCheck } from '@/hooks/useHealthCheck';
import { useTrackEngagement } from '@/hooks/useEngagement';
import { HealthCheckIntro } from '@/components/health-check/HealthCheckIntro';
import { HealthCheckWizard } from '@/components/health-check/HealthCheckWizard';
import { HealthCheckResult } from '@/components/health-check/HealthCheckResult';
import { captureCampaignAttribution, getCampaignAttribution, leadAttributionFields } from '@/lib/campaign-attribution';
import { getEmailFromUrl, trackGhlEvent } from '@/lib/ghl-tracking';

type Phase = 'intro' | 'email' | 'wizard' | 'email-result' | 'result';

export default function HealthCheckPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const { data: questions, isLoading } = useHealthCheckQuestions();
  const { mutate: scoreMutate, data: result, isPending: isScoring } = useScoreHealthCheck();
  const track = useTrackEngagement();

  useEffect(() => {
    captureCampaignAttribution(window.location.search);
    setEmail(getEmailFromUrl());
  }, []);

  function handleStart() {
    track('assessment_started', leadAttributionFields(getCampaignAttribution(), 'procurement-health-check'));
    setPhase(email ? 'wizard' : 'email');
  }

  function handleComplete(finalAnswers: Record<string, string>) {
    setAnswers(finalAnswers);
    if (!email) setPhase('email-result');
    else submitAnswers(finalAnswers);
  }

  function submitAnswers(finalAnswers: Record<string, string>) {
    trackGhlEvent({ event: 'health_started', email });
    scoreMutate(finalAnswers, {
      onSuccess: (scored) => {
        const weakest = [...scored.dimensions].sort((a, b) => a.score - b.score)[0];
        const band = scored.overallScore >= 75 ? 'Strong' : scored.overallScore >= 40 ? 'Developing' : 'Opportunity';
        trackGhlEvent({ event: 'health_completed', email, scoreBand: band, identifiedArea: scored.topOpportunities[0]?.label ?? weakest?.label ?? 'General' });
        track('assessment_completed', leadAttributionFields(getCampaignAttribution(), 'procurement-health-check'));
        setPhase('result');
      },
    });
  }

  function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Object.keys(answers).length === 0) setPhase('wizard');
    else submitAnswers(answers);
  }

  return (
    <div className="container-page py-16">
      {phase === 'intro' && <HealthCheckIntro onStart={handleStart} />}

      {phase === 'wizard' && (
        isLoading || !questions ? (
          <div className="mx-auto max-w-2xl">
            <div className="h-2 w-full animate-pulse rounded-full bg-canvas-overlay" />
            <div className="mt-8 h-24 animate-pulse rounded-xl2 bg-canvas-overlay" />
          </div>
        ) : (
          <HealthCheckWizard questions={questions} onComplete={handleComplete} onFirstAnswer={() => trackGhlEvent({ event: 'health_started', email })} />
        )
      )}

      {phase === 'wizard' && isScoring && (
        <p className="mt-6 text-center text-sm text-ink-faint">Scoring your responses…</p>
      )}

      {(phase === 'email' || phase === 'email-result') && (
        <form onSubmit={handleEmailSubmit} className="card mx-auto max-w-md p-6">
          <h2 className="text-lg font-semibold text-ink">{phase === 'email' ? 'Start your Health Check' : 'See your Health Check result'}</h2>
          <p className="mt-2 text-sm text-ink-muted">Enter your email to {phase === 'email' ? 'begin the assessment' : 'view your procurement health score'}.</p>
          <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Work email" className="mt-4 w-full rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
          <button type="submit" disabled={isScoring} className="mt-4 w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{isScoring ? 'Scoring…' : phase === 'email' ? 'Continue' : 'Show my result'}</button>
        </form>
      )}

      {phase === 'result' && result && <HealthCheckResult result={result} answers={answers} email={email} />}
    </div>
  );
}
