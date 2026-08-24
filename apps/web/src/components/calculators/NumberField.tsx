'use client';

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  step = 'any',
  min,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: string | number;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-canvas-raised px-3 py-2 focus-within:border-accent">
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          step={step}
          min={min}
          className="w-full bg-transparent text-sm text-ink focus:outline-none"
        />
        {suffix && <span className="shrink-0 text-xs text-ink-faint">{suffix}</span>}
      </div>
    </label>
  );
}
