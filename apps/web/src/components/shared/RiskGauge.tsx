'use client';

const SIZE = 160;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = Math.PI * RADIUS; // half circle

function bandColor(score: number): string {
  if (score < 25) return '#22c55e';
  if (score < 50) return '#f59e0b';
  return '#ef4444';
}

function bandLabel(score: number): string {
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'Elevated';
  return 'High';
}

export function RiskGauge({ score, label }: { score: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, score));
  const filled = (clamped / 100) * CIRCUMFERENCE;
  const color = bandColor(clamped);

  return (
    <div className="flex flex-col items-center">
      <svg width={SIZE} height={SIZE / 2 + STROKE} viewBox={`0 0 ${SIZE} ${SIZE / 2 + STROKE}`}>
        <path
          d={`M ${STROKE / 2} ${SIZE / 2} A ${RADIUS} ${RADIUS} 0 0 1 ${SIZE - STROKE / 2} ${SIZE / 2}`}
          fill="none"
          stroke="#232b3b"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        <path
          d={`M ${STROKE / 2} ${SIZE / 2} A ${RADIUS} ${RADIUS} 0 0 1 ${SIZE - STROKE / 2} ${SIZE / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
        />
      </svg>
      <p className="-mt-8 font-mono text-2xl text-ink">{Math.round(clamped)}</p>
      <p className="text-xs font-medium" style={{ color }}>
        {bandLabel(clamped)}
      </p>
      <p className="mt-1 text-center text-[11px] text-ink-faint">{label}</p>
    </div>
  );
}
