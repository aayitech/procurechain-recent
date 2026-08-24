import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

interface CategoryDef {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'flat';
  note: string;
}

const CATEGORIES: CategoryDef[] = [
  { name: 'Packaging', score: 58, trend: 'up', note: 'Containerboard and resin costs trending upward' },
  { name: 'Mining', score: 64, trend: 'up', note: 'Metals demand steady, energy costs a watch item' },
  { name: 'Manufacturing', score: 55, trend: 'flat', note: 'Input costs broadly stable this quarter' },
  { name: 'Construction', score: 61, trend: 'up', note: 'Lumber and cement pricing firm' },
  { name: 'Healthcare', score: 49, trend: 'flat', note: 'Specialized supply chains, limited volatility' },
  { name: 'Retail', score: 52, trend: 'down', note: 'Consumer demand softening slightly' },
  { name: 'Food', score: 67, trend: 'up', note: 'Weather-sensitive agricultural inputs' },
  { name: 'Agriculture', score: 66, trend: 'up', note: 'Grain prices sensitive to seasonal outlook' },
  { name: 'Fleet', score: 59, trend: 'up', note: 'Fuel costs the primary driver' },
  { name: 'IT', score: 45, trend: 'down', note: 'Component pricing easing from prior highs' },
  { name: 'Facilities', score: 47, trend: 'flat', note: 'Energy costs the main variable' },
  { name: 'Security', score: 42, trend: 'flat', note: 'Stable labor-driven cost base' },
  { name: 'Cleaning', score: 44, trend: 'flat', note: 'Chemical input costs steady' },
  { name: 'Capital Equipment', score: 53, trend: 'up', note: 'Steel and component costs a factor' },
  { name: 'Office Supplies', score: 40, trend: 'down', note: 'Paper costs easing' },
  { name: 'Professional Services', score: 46, trend: 'flat', note: 'Rate-driven, low commodity exposure' },
  { name: 'Utilities', score: 63, trend: 'up', note: 'Energy market pass-through' },
  { name: 'Travel', score: 57, trend: 'up', note: 'Fuel surcharges affecting fares' },
  { name: 'Marketing', score: 38, trend: 'flat', note: 'Low commodity exposure' },
];

const TREND_ICON = {
  up: <ArrowUpRight size={14} className="text-positive" />,
  down: <ArrowDownRight size={14} className="text-negative" />,
  flat: <Minus size={14} className="text-ink-faint" />,
};

export function CategoryExplorer() {
  return (
    <section id="categories" className="container-page py-16">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-ink">Category Explorer</h2>
          <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">
            Illustrative
          </span>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-ink-muted">
          Directional market scores and notes for common procurement categories. Dedicated
          category intelligence pages (supplier landscape, cost drivers, strategy) are a future
          module — these are a preview, not full analysis.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((category) => (
          <div key={category.name} className="card p-4 transition-colors hover:border-accent">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">{category.name}</p>
              {TREND_ICON[category.trend]}
            </div>
            <p className="mt-2 font-mono text-lg text-ink">{category.score}</p>
            <p className="text-[11px] text-ink-faint">Market score (sample)</p>
            <p className="mt-2 text-xs text-ink-muted">{category.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
