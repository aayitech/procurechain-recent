import { Lock } from 'lucide-react';

const LOCKED_FEATURES = [
  'Spend Analytics',
  'Supplier Performance',
  'Contracts',
  'Purchase Orders',
  'Savings Tracking',
  'Supplier Scorecards',
  'Category Spend',
  'AI Spend Analysis',
];

export function ConnectedProcurement() {
  return (
    <section className="container-page py-16">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-ink">Connected Procurement</h2>
          <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">
            Premium
          </span>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-ink-muted">
          Connect SAP, Oracle, Microsoft Dynamics, ERPNext, or ProcureChain Procurement to unlock
          spend-level intelligence. Not available yet — shown here as the roadmap, not populated
          with placeholder numbers.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {LOCKED_FEATURES.map((feature) => (
          <div
            key={feature}
            className="card flex flex-col items-center justify-center gap-2 p-5 text-center opacity-60"
          >
            <Lock size={16} className="text-ink-faint" />
            <p className="text-xs text-ink-muted">{feature}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
