import Link from 'next/link';
import { BarChart3, Calculator, FileText, LineChart, Target, TrendingUp } from 'lucide-react';

const TILES = [
  { icon: BarChart3, label: 'Market Intelligence', description: 'Real-time prices, trends & analysis', href: '/market-intelligence' },
  { icon: TrendingUp, label: 'Trend Projections', description: 'Real linear extrapolation, per commodity', href: '/market-intelligence' },
  { icon: Target, label: 'Category Strategies', description: 'Explore procurement categories', href: '/#categories' },
  { icon: Calculator, label: 'Calculators', description: 'Cost, savings & scenario tools', href: '/calculators' },
  { icon: LineChart, label: 'Benchmarking', description: 'Assess procurement maturity', href: '/benchmarking' },
  { icon: FileText, label: 'Reports', description: 'Market briefs & downloads', href: '/#reports' },
];

export function CategoryNavTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {TILES.map((tile) => (
        <Link
          key={tile.label}
          href={tile.href}
          className="card flex flex-col gap-2 p-4 transition-all hover:-translate-y-0.5 hover:border-accent"
        >
          <tile.icon size={18} className="text-accent" />
          <p className="text-sm font-medium text-ink">{tile.label}</p>
          <p className="text-[11px] text-ink-faint">{tile.description}</p>
          <span className="mt-auto text-xs text-accent">Explore →</span>
        </Link>
      ))}
    </div>
  );
}
