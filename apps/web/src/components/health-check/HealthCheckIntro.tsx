import { CheckCircle2, ClipboardCheck } from 'lucide-react';

const PROMISES = ['Your Procurement Performance Index', 'Your procurement maturity level', 'Your biggest optimization opportunities', 'Three practical recommended actions'];

export function HealthCheckIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <ClipboardCheck size={22} />
      </div>
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">Procurement Health Check</p>
      <h1 className="text-3xl font-semibold text-ink sm:text-4xl">How healthy is your procurement operation?</h1>
      <p className="mx-auto mt-3 max-w-lg text-ink-muted">
        Assess your procurement operation in about 3 minutes, identify your biggest optimization
        opportunities and receive practical recommendations.
      </p>

      <div className="mx-auto mt-6 flex max-w-md flex-col gap-2 text-left">
        {PROMISES.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-ink-muted">
            <CheckCircle2 size={16} className="shrink-0 text-positive" />
            {item}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Start Health Check
      </button>
      <p className="mt-3 text-xs text-ink-faint">8 questions · about 3 minutes · no account required</p>
    </div>
  );
}
