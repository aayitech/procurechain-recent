'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuth';
import { INDUSTRY_OPTIONS } from '@/lib/industries';
import { COUNTRY_OPTIONS } from '@/lib/currencies';

export default function RegisterPage() {
  const router = useRouter();
  const { mutate, isPending, error } = useRegister();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    country: '',
    industry: '',
    jobTitle: '',
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate(form, { onSuccess: () => router.push('/') });
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Free — personalizes your dashboard by industry and country. No procurement data required.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="Work email"
            className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="Password (min. 8 characters)"
            className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <input
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
            placeholder="Company"
            className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <input
            value={form.jobTitle}
            onChange={(e) => update('jobTitle', e.target.value)}
            placeholder="Job title"
            className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <select
            value={form.country}
            onChange={(e) => update('country', e.target.value)}
            className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="">Country</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={form.industry}
            onChange={(e) => update('industry', e.target.value)}
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
            className="mt-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {isPending ? 'Creating account…' : 'Create free account'}
          </button>
          {error && <p className="text-xs text-negative">{(error as Error).message || 'Something went wrong.'}</p>}
        </form>

        <p className="mt-4 text-center text-sm text-ink-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
