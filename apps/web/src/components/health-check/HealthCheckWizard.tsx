'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { HealthCheckQuestion } from '@/types/health-check';

export function HealthCheckWizard({
  questions,
  onComplete,
}: {
  questions: HealthCheckQuestion[];
  onComplete: (answers: Record<string, string>) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = questions[index];
  const progress = ((index + 1) / questions.length) * 100;

  function selectAnswer(answerKey: string) {
    const next = { ...answers, [question.id]: answerKey };
    setAnswers(next);
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete(next);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-2 flex items-center justify-between text-xs text-ink-faint">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        {index > 0 && (
          <button type="button" onClick={() => setIndex(index - 1)} className="flex items-center gap-1 text-ink-muted hover:text-ink">
            <ChevronLeft size={13} />
            Back
          </button>
        )}
      </div>
      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-canvas-overlay">
        <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <h2 className="mb-6 text-xl font-semibold text-ink sm:text-2xl">{question.text}</h2>

      <div className="flex flex-col gap-3">
        {question.answers.map((answer) => (
          <button
            key={answer.key}
            type="button"
            onClick={() => selectAnswer(answer.key)}
            className={`flex items-center gap-3 rounded-xl2 border px-4 py-3.5 text-left text-sm transition-colors ${
              answers[question.id] === answer.key
                ? 'border-accent bg-accent/5 text-ink'
                : 'border-border bg-canvas-raised text-ink-muted hover:border-accent hover:text-ink'
            }`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-subtle text-xs font-medium text-ink-faint">
              {answer.key}
            </span>
            {answer.label}
          </button>
        ))}
      </div>
    </div>
  );
}
