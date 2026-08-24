'use client';

import { useState } from 'react';
import { useHealthCheckQuestions, useScoreHealthCheck } from '@/hooks/useHealthCheck';
import { useTrackEngagement } from '@/hooks/useEngagement';
import { HealthCheckIntro } from '@/components/health-check/HealthCheckIntro';
import { HealthCheckWizard } from '@/components/health-check/HealthCheckWizard';
import { HealthCheckResult } from '@/components/health-check/HealthCheckResult';

type Phase = 'intro' | 'wizard' | 'result';

export default function HealthCheckPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { data: questions, isLoading } = useHealthCheckQuestions();
  const { mutate: scoreMutate, data: result, isPending: isScoring } = useScoreHealthCheck();
  const track = useTrackEngagement();

  function handleStart() {
    track('assessment_started');
    setPhase('wizard');
  }

  function handleComplete(finalAnswers: Record<string, string>) {
    setAnswers(finalAnswers);
    scoreMutate(finalAnswers, {
      onSuccess: () => {
        track('assessment_completed');
        setPhase('result');
      },
    });
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
          <HealthCheckWizard questions={questions} onComplete={handleComplete} />
        )
      )}

      {phase === 'wizard' && isScoring && (
        <p className="mt-6 text-center text-sm text-ink-faint">Scoring your responses…</p>
      )}

      {phase === 'result' && result && <HealthCheckResult result={result} answers={answers} />}
    </div>
  );
}
