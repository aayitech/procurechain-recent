import Link from 'next/link';
import { CALCULATORS, CALCULATOR_CATEGORY_ORDER } from '@/lib/calculators-index';

export const metadata = {
  title: 'Procurement Tools',
  description: 'Interactive calculators for total cost of ownership, landed cost, EOQ, and more.',
};

export default function CalculatorsPage() {
  return (
    <div className="container-page py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">Procurement Tools</p>
        <h1 className="text-3xl font-semibold text-ink">Make better procurement decisions</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Estimate costs, compare options, assess logistics and understand the commercial impact of
          procurement decisions — live, input-driven calculators with chart output and CSV export.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {CALCULATOR_CATEGORY_ORDER.map((category) => {
          const items = CALCULATORS.filter((c) => c.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-faint">{category}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((calc) => {
                  const Icon = calc.icon;
                  return (
                    <Link
                      key={calc.slug}
                      href={`/calculators/${calc.slug}`}
                      className="card block p-5 transition-all hover:-translate-y-0.5 hover:border-accent"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon size={18} />
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-ink">{calc.name}</h3>
                      <p className="mt-1 text-xs text-ink-faint">{calc.description}</p>
                      <p className="mt-3 text-[11px] text-ink-faint">~{calc.estimatedTime}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
