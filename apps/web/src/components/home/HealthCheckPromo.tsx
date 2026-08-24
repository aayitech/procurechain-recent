import Link from 'next/link';
import { ArrowRight, BarChart3, ClipboardCheck, Target } from 'lucide-react';

const FEATURES = [
  { icon: BarChart3, label: 'Your Procurement Performance Index' },
  { icon: Target, label: 'Your biggest optimization opportunities' },
  { icon: ClipboardCheck, label: 'Three practical recommended actions' },
];

export function HealthCheckPromo() {
  return (
    <section className="container-page pb-16">
      <div className="card relative overflow-hidden p-8 sm:p-10">
        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">Procurement Health Check</p>
            <h2 className="text-2xl font-semibold text-ink sm:text-3xl">How healthy is your procurement operation?</h2>
            <p className="mt-3 max-w-xl text-ink-muted">
              Assess your procurement operation in about 3 minutes, identify your biggest
              optimization opportunities and receive practical recommendations — free, no account
              required.
            </p>
            <Link
              href="/health-check"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Check My Procurement Health
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl2 border border-border-subtle bg-canvas-raised px-4 py-3">
                <Icon size={16} className="shrink-0 text-accent" />
                <span className="text-sm text-ink-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
