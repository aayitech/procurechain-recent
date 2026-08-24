import { Boxes, Factory, Flame, Ship, Sprout, Landmark } from 'lucide-react';
import { ImpactBadge } from './ImpactBadge';
import type { SupplyChainWatchItem } from '@/types/market-intelligence-snapshot';

const ICONS: Record<string, typeof Ship> = {
  'Shipping & Freight': Ship,
  Metals: Boxes,
  Energy: Flame,
  Manufacturing: Factory,
  Agriculture: Sprout,
  'Trade & Policy': Landmark,
};

export function SupplyChainWatchSection({ items }: { items: SupplyChainWatchItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="container-page py-8">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-faint">Supply Chain Watch</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = ICONS[item.category] ?? Ship;
          return (
            <a
              key={item.category}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex flex-col gap-2 p-4 transition-colors hover:border-accent"
            >
              <div className="flex items-center gap-2">
                <Icon size={15} className="text-accent" />
                <span className="text-xs font-medium text-ink">{item.category}</span>
              </div>
              <p className="text-xs text-ink-muted">{item.summary}</p>
              <ImpactBadge level={item.impact} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
