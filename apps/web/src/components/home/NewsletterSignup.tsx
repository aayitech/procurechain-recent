'use client';

import { FormEvent, useState } from 'react';
import { useCreateLead } from '@/hooks/useCreateLead';

const INDUSTRIES = [
  'Manufacturing',
  'Mining',
  'Retail',
  'Healthcare',
  'Construction',
  'Food & Agriculture',
  'Logistics',
  'Technology',
  'Other',
];

export function NewsletterSignup() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    role: '',
    country: '',
    email: '',
    industry: '',
  });
  const { mutate, isPending, isSuccess, isError } = useCreateLead();

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({
      ...form,
      newsletterOptIn: true,
      source: 'NEWSLETTER',
      sourceDetail: 'homepage_newsletter_signup',
    });
  }

  if (isSuccess) {
    return (
      <div id="newsletter" className="card p-6 text-sm text-ink">
        You&apos;re subscribed. Look out for the next issue of the ProcureChain weekly briefing.
      </div>
    );
  }

  return (
    <div id="newsletter" className="card p-6">
      <h3 className="text-lg font-semibold text-ink">Stay Ahead of Procurement Trends</h3>
      <p className="mt-1 text-sm text-ink-muted">
        AI-curated market moves, commodity shifts, and category insights — every week, free.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          required
          value={form.firstName}
          onChange={(e) => update('firstName', e.target.value)}
          placeholder="First name"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          value={form.lastName}
          onChange={(e) => update('lastName', e.target.value)}
          placeholder="Last name"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="Work email"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none sm:col-span-2"
        />
        <input
          value={form.company}
          onChange={(e) => update('company', e.target.value)}
          placeholder="Company"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          value={form.role}
          onChange={(e) => update('role', e.target.value)}
          placeholder="Role"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          value={form.country}
          onChange={(e) => update('country', e.target.value)}
          placeholder="Country"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <select
          value={form.industry}
          onChange={(e) => update('industry', e.target.value)}
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        >
          <option value="">Industry</option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60 sm:col-span-2"
        >
          {isPending ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {isError && <p className="mt-2 text-xs text-negative">Something went wrong — please try again.</p>}
      <p className="mt-3 text-[11px] text-ink-faint">
        Join procurement professionals getting weekly market intelligence. Unsubscribe anytime.
      </p>
    </div>
  );
}
