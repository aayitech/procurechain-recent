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
    regionCity: '',
    currency: 'ZAR',
    procurementCategories: '',
    commodities: '',
    purchaseMix: '',
    sourcingCountries: '',
    tradeLanes: '',
    procurementChallenges: '',
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const list = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);
    mutate({ ...form, procurementCategories: list(form.procurementCategories), commodities: list(form.commodities), sourcingCountries: list(form.sourcingCountries), tradeLanes: list(form.tradeLanes), procurementChallenges: list(form.procurementChallenges) }, { onSuccess: () => router.push('/') });
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Free — personalizes your dashboard by industry and country. No procurement data required.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <fieldset className="grid gap-3 rounded-2xl border border-border bg-canvas-raised p-5">
            <legend className="px-2 text-sm font-semibold text-ink">Identity and location</legend>
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
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.regionCity} onChange={(e) => update('regionCity', e.target.value)} placeholder="Region or city" className="rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
            <input value={form.currency} onChange={(e) => update('currency', e.target.value.toUpperCase())} placeholder="Currency, e.g. ZAR" maxLength={3} className="rounded-lg border border-border bg-canvas px-3 py-2 text-sm uppercase text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
          </div>
          <select value={form.industry} onChange={(e) => update('industry', e.target.value)} className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none">
            <option value="">Industry</option>
            {INDUSTRY_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          </fieldset>

          <fieldset className="grid gap-3 rounded-2xl border border-border bg-canvas-raised p-5">
            <legend className="px-2 text-sm font-semibold text-ink">Procurement profile</legend>
            <p className="text-xs leading-5 text-ink-muted">These fields prioritise your brief and suggested markets. They never restrict what you can search.</p>
            <input value={form.procurementCategories} onChange={(e) => update('procurementCategories', e.target.value)} placeholder="Main categories (comma separated)" className="rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
            <input value={form.commodities} onChange={(e) => update('commodities', e.target.value)} placeholder="Main commodities, e.g. diesel, steel, polyethylene" className="rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
            <select value={form.purchaseMix} onChange={(e) => update('purchaseMix', e.target.value)} className="rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"><option value="">Local vs imported purchasing</option><option>Mostly local</option><option>Balanced local and imported</option><option>Mostly imported</option></select>
            <input value={form.sourcingCountries} onChange={(e) => update('sourcingCountries', e.target.value)} placeholder="Main sourcing countries (comma separated)" className="rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
            <input value={form.tradeLanes} onChange={(e) => update('tradeLanes', e.target.value)} placeholder="Main trade lanes, e.g. China → Durban" className="rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
            <input value={form.procurementChallenges} onChange={(e) => update('procurementChallenges', e.target.value)} placeholder="Procurement challenges (comma separated)" className="rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
          </fieldset>
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
