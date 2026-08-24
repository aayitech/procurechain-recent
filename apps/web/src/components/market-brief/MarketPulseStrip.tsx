import { Sparkline } from '@/components/shared/Sparkline';
import { ChangeBadge } from '@/components/market-intelligence/ChangeBadge';
import type { MarketBriefPulseTile } from '@/types/market-brief';

export function MarketPulseStrip({ tiles }: { tiles: MarketBriefPulseTile[] }) {
  if (tiles.length === 0) return null;

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Market Pulse</p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {tiles.map((tile) => (
          <div key={tile.key} className="card flex min-w-[150px] shrink-0 flex-col gap-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-ink-muted">{tile.label}</span>
              <Sparkline data={tile.sparkline} positive={(tile.change7d ?? 0) >= 0} />
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-lg text-ink">{tile.value.toLocaleString(undefined, { maximumFractionDigits: tile.value > 100 ? 0 : 2 })}</span>
              <ChangeBadge value={tile.change7d} label="7d" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
