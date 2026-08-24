'use client';

import { FormEvent, useState } from 'react';
import { useCreateLead } from '@/hooks/useCreateLead';

const SPEND_BANDS = ['Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $250M', '$250M+'];

export function DemoCTA() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    country: '',
    annualSpendBand: '',
  });
  const { mutate, isPending, isSuccess, isError } = useCreateLead();

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({ ...form, source: 'DEMO_REQUEST', sourceDetail: 'homepage_book_demo' });
  }

  if (isSuccess) {
    return (
      <div id="book-demo" className="card p-8 text-center">
        <h3 className="text-xl font-semibold text-ink">Thanks — we&apos;ll be in touch shortly.</h3>
        <p className="mt-2 text-sm text-ink-muted">
          A member of the ProcureChain team will reach out to schedule your demo.
        </p>
      </div>
    );
  }

  return (
    <div id="book-demo" className="card p-8">
      <h3 className="text-xl font-semibold text-ink">Book a demo</h3>
      <p className="mt-1 text-sm text-ink-muted">
        See how ProcureChain Intelligence Hub fits into your procurement workflow.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="First name"
          value={form.firstName}
          onChange={(e) => update('firstName', e.target.value)}
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          placeholder="Last name"
          value={form.lastName}
          onChange={(e) => update('lastName', e.target.value)}
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          required
          type="email"
          placeholder="Work email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none sm:col-span-2"
        />
        <input
          required
          placeholder="Company"
          value={form.company}
          onChange={(e) => update('company', e.target.value)}
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          placeholder="Country"
          value={form.country}
          onChange={(e) => update('country', e.target.value)}
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <select
          value={form.annualSpendBand}
          onChange={(e) => update('annualSpendBand', e.target.value)}
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        >
          <option value="">Annual procurement spend</option>
          {SPEND_BANDS.map((band) => (
            <option key={band} value={band}>
              {band}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60 sm:col-span-2"
        >
          {isPending ? 'Submitting…' : 'Request Demo'}
        </button>
        {isError && (
          <p className="text-xs text-negative sm:col-span-2">Something went wrong — please try again.</p>
        )}
      </form>
    </div>
  );
}
