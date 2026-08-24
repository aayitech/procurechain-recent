'use client';

function daysUntil(target: Date): number {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function endOfQuarter(date: Date): Date {
  const quarterEndMonth = Math.floor(date.getMonth() / 3) * 3 + 2;
  return new Date(date.getFullYear(), quarterEndMonth + 1, 0);
}

function endOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31);
}

/**
 * Real calendar arithmetic only — month/quarter/year-end countdowns. No
 * external event dates (Fed meetings, OPEC meetings, etc.) since we don't
 * have a verified source for those and won't guess.
 */
export function ProcurementCalendar() {
  const now = new Date();
  const milestones = [
    { label: 'Month-end', date: endOfMonth(now) },
    { label: 'Quarter-end', date: endOfQuarter(now) },
    { label: 'Year-end', date: endOfYear(now) },
  ];

  return (
    <div className="card p-5">
      <p className="mb-3 text-sm font-medium text-ink">Procurement Calendar</p>
      <ul className="flex flex-col gap-3">
        {milestones.map((m) => (
          <li key={m.label} className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">{m.label}</span>
            <span className="font-mono text-ink">
              {daysUntil(m.date)}d{' '}
              <span className="text-[11px] text-ink-faint">
                ({m.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] text-ink-faint">
        Budget-cycle milestones only — we don&apos;t fabricate external event dates (rate
        decisions, OPEC meetings) without a verified source.
      </p>
    </div>
  );
}
