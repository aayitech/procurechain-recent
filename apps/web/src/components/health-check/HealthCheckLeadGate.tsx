'use client';

import { FormEvent, useState } from 'react';
import { Lock } from 'lucide-react';
import { INDUSTRY_OPTIONS } from '@/lib/industries';

export interface HealthCheckLeadFormValues {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  country: string;
  industry: string;
}

export function HealthCheckLeadGate({
  isPending,
  onSubmit,
}: {
  isPending: boolean;
  onSubmit: (values: HealthCheckLeadFormValues) => void;
}) {
  const [values, setValues] = useState<HealthCheckLeadFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    country: '',
    industry: '',
  });

  function set<K extends keyof HealthCheckLeadFormValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <div className="card relative overflow-hidden p-6">
      <div className="mb-4 flex items-center gap-2">
        <Lock size={15} className="text-accent" />
        <p className="text-sm font-medium text-ink">Unlock your full Procurement Performance Report</p>
      </div>
      <p className="mb-4 text-xs text-ink-muted">
        See all your dimension gaps, personalized recommendations and the tools that address them.
        Takes 15 seconds.
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          required
          value={values.firstName}
          onChange={(e) => set('firstName', e.target.value)}
          placeholder="First name"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          value={values.lastName}
          onChange={(e) => set('lastName', e.target.value)}
          placeholder="Last name"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          required
          type="email"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="Work email"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none sm:col-span-2"
        />
        <input
          value={values.company}
          onChange={(e) => set('company', e.target.value)}
          placeholder="Company"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          value={values.jobTitle}
          onChange={(e) => set('jobTitle', e.target.value)}
          placeholder="Job title"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          value={values.country}
          onChange={(e) => set('country', e.target.value)}
          placeholder="Country"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <select
          value={values.industry}
          onChange={(e) => set('industry', e.target.value)}
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        >
          <option value="">Industry</option>
          {INDUSTRY_OPTIONS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60 sm:col-span-2"
        >
          {isPending ? 'Unlocking…' : 'Show my full report'}
        </button>
      </form>
    </div>
  );
}
