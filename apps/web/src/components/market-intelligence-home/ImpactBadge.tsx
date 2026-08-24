import type { ImpactLevel } from '@/types/market-intelligence-snapshot';

const STYLES: Record<ImpactLevel, string> = {
  High: 'bg-negative/10 text-negative',
  Medium: 'bg-warning/10 text-warning',
  Watch: 'bg-canvas-overlay text-ink-faint',
};

export function ImpactBadge({ level }: { level: ImpactLevel }) {
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${STYLES[level]}`}>
      Impact: {level}
    </span>
  );
}
