import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Only real, working routes — Transport Checkup isn't rebuilt yet (blocked
// on a routing-provider decision), so it isn't linked here until it exists.
const TOOLS = [
  { label: 'Freight Cost Calculator', href: '/calculators/freight-cost', description: 'Estimate freight spend across modes.' },
  { label: 'Landed Cost Calculator', href: '/calculators/landed-cost', description: 'True cost of an imported item.' },
  { label: 'Currency Impact Calculator', href: '/calculators/currency-impact', description: 'Model FX exposure on landed cost.' },
];

export function RelatedToolsCard() {
  return (
    <div className="card p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">Related Tools</p>
      <div className="flex flex-col gap-3">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-ink group-hover:text-accent">{tool.label}</p>
              <p className="text-[11px] text-ink-faint">{tool.description}</p>
            </div>
            <ArrowRight size={12} className="mt-0.5 shrink-0 text-ink-faint group-hover:text-accent" />
          </Link>
        ))}
      </div>
    </div>
  );
}
