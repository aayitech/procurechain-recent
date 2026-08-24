import Link from 'next/link';
import { ArrowRight, BarChart3 } from 'lucide-react';

export function BenchmarkingTeaser() {
  return (
    <Link
      href="/benchmarking"
      className="card flex w-64 shrink-0 flex-col justify-between p-5 transition-all hover:-translate-y-0.5 hover:border-accent"
    >
      <div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <BarChart3 size={18} />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-ink">Procurement Benchmarking</h3>
        <p className="mt-1 text-xs text-ink-faint">
          See how your procurement capability compares against recognized procurement practices.
        </p>
      </div>
      <p className="mt-4 flex items-center gap-1 text-[11px] font-medium text-accent">
        Start Benchmarking
        <ArrowRight size={11} />
      </p>
    </Link>
  );
}
