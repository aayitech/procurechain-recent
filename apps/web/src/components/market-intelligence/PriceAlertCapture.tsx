'use client';

import { FormEvent, useState } from 'react';
import { Bell } from 'lucide-react';
import { useCreateLead } from '@/hooks/useCreateLead';

export function PriceAlertCapture({ symbol, name, currentPrice }: { symbol: string; name: string; currentPrice: number }) {
  const [email, setEmail] = useState('');
  const [threshold, setThreshold] = useState(currentPrice);
  const { mutate, isPending, isSuccess } = useCreateLead();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({
      firstName: email.split('@')[0] || 'Subscriber',
      email,
      source: 'GENERAL',
      sourceDetail: `price_alert:${symbol}:threshold=${threshold}`,
      newsletterOptIn: true,
    });
  }

  if (isSuccess) {
    return (
      <div className="card p-4 text-xs text-ink">
        Request received — we&apos;ll email you once price alerting is live for {name}.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <div className="mb-2 flex items-center gap-2">
        <Bell size={14} className="text-accent" />
        <p className="text-sm font-medium text-ink">Set a price alert</p>
      </div>
      <p className="mb-3 text-[11px] text-ink-faint">
        Registers your interest — automatic monitoring &amp; email delivery isn&apos;t wired up yet,
        so this doesn&apos;t actively watch the price today.
      </p>
      <div className="flex flex-col gap-2">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          step="any"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? 'Submitting…' : 'Notify me'}
        </button>
      </div>
    </form>
  );
}
