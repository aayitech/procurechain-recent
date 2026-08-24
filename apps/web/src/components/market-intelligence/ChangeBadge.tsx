export function ChangeBadge({
  value,
  label,
  size = 'sm',
}: {
  value: number | null;
  label?: string;
  size?: 'sm' | 'lg';
}) {
  const prefix = label ? `${label}: ` : '';
  const textSize = size === 'lg' ? 'text-lg' : 'text-xs';

  if (value === null) {
    return (
      <span className={`inline-flex items-center gap-1 ${textSize} text-ink-faint`}>
        {prefix}
        <span className="font-mono">—</span>
      </span>
    );
  }

  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 ${textSize} ${positive ? 'text-positive' : 'text-negative'}`}
    >
      {prefix}
      <span className="font-mono">
        {positive ? '+' : ''}
        {value.toFixed(2)}%
      </span>
    </span>
  );
}
