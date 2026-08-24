import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function TransformCTA() {
  return (
    <section className="border-y border-border-subtle bg-canvas-overlay py-16">
      <div className="container-page text-center">
        <h2 className="text-3xl font-semibold text-ink">Ready to turn procurement intelligence into action?</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-muted">
          Explore the market. Assess your procurement capability. Discover where ProcureChain can
          help you improve procurement performance.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/health-check"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Check Your Procurement Health
            <ArrowRight size={15} />
          </Link>
          <a
            href="#book-demo"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-ink-muted transition-colors hover:border-accent hover:text-ink"
          >
            Book a Demo
          </a>
        </div>
      </div>
    </section>
  );
}
