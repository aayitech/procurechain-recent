import Link from 'next/link';
import { CALCULATORS } from '@/lib/calculators-index';
import { BenchmarkingTeaser } from './BenchmarkingTeaser';

export function FeaturedCalculators() {
  return (
    <section id="calculators" className="container-page py-16">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink">Calculators &amp; Benchmarking</h2>
        <p className="mt-1 text-sm text-ink-muted">
          A professional procurement toolkit — interactive calculators for common decisions, plus
          a benchmark of your own procurement capability.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {CALCULATORS.slice(0, 7).map((calc) => {
          const Icon = calc.icon;
          return (
            <Link
              key={calc.slug}
              href={`/calculators/${calc.slug}`}
              className="card flex w-64 shrink-0 flex-col justify-between p-5 transition-all hover:-translate-y-0.5 hover:border-accent"
            >
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon size={18} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-ink">{calc.name}</h3>
                <p className="mt-1 text-xs text-ink-faint">{calc.description}</p>
              </div>
              <p className="mt-4 text-[11px] text-ink-faint">~{calc.estimatedTime}</p>
            </Link>
          );
        })}
        <BenchmarkingTeaser />
      </div>
      <Link href="/calculators" className="mt-4 inline-block text-xs text-accent hover:underline">
        View all calculators →
      </Link>
    </section>
  );
}
