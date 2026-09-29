'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompleteOnboarding } from '@/hooks/useAuth';
import { INDUSTRY_OPTIONS } from '@/lib/industries';
import { useAuthStore } from '@/store/auth-store';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ZAR', 'NGN', 'KES', 'EGP', 'GHS', 'CNY'];
const fieldClass = 'rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none';

function splitList(value: string): string[] {
  return [...new Set(value.split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean))];
}

export default function OnboardingPage() {
  const router = useRouter();
  const { hydrated, user } = useAuthStore();
  const completeOnboarding = useCompleteOnboarding();
  const [form, setForm] = useState({
    firstName: '', lastName: '', company: '', jobTitle: '', phone: '', country: '', regionCity: '',
    preferredCurrency: 'USD', industry: '', procurementCategories: '', commodities: '', purchaseMix: '',
    sourcingCountries: '', tradeLanes: '', procurementChallenges: '', newsletterOptIn: false,
  });

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace('/register');
    else if (user.onboardingCompletedAt !== null) router.replace('/');
  }, [hydrated, router, user]);

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    completeOnboarding.mutate({
      firstName: form.firstName, lastName: form.lastName, company: form.company, jobTitle: form.jobTitle,
      phone: form.phone || undefined, country: form.country, regionCity: form.regionCity || undefined,
      preferredCurrency: form.preferredCurrency, industry: form.industry,
      procurementCategories: splitList(form.procurementCategories), commodities: splitList(form.commodities),
      purchaseMix: form.purchaseMix || undefined, sourcingCountries: splitList(form.sourcingCountries),
      tradeLanes: splitList(form.tradeLanes), procurementChallenges: splitList(form.procurementChallenges),
      newsletterOptIn: form.newsletterOptIn,
    }, { onSuccess: () => router.replace('/market-brief') });
  }

  if (!hydrated || !user || user.onboardingCompletedAt !== null) {
    return <div className="container-page py-20 text-center text-sm text-ink-muted">Loading your profile…</div>;
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <form onSubmit={submit} className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Create your market profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Personalize your procurement intelligence</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">Your profile changes which verified signals appear first. It never removes access to the full market universe.</p>

        <section className="card mt-7 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-ink">Identity and location</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="First name" className={fieldClass} />
            <input required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Last name" className={fieldClass} />
            <input required value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Company" className={fieldClass} />
            <input required value={form.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} placeholder="Job title" className={fieldClass} />
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Phone (optional)" className={fieldClass} />
            <input required value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="Country" className={fieldClass} />
            <input value={form.regionCity} onChange={(e) => update('regionCity', e.target.value)} placeholder="Region or city" className={fieldClass} />
            <select required value={form.preferredCurrency} onChange={(e) => update('preferredCurrency', e.target.value)} className={fieldClass} aria-label="Preferred currency">
              {CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
            </select>
          </div>
        </section>

        <section className="card mt-4 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-ink">Procurement profile</h2>
          <p className="mt-1 text-xs text-ink-faint">Separate multiple entries with commas.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <select required value={form.industry} onChange={(e) => update('industry', e.target.value)} className={fieldClass} aria-label="Industry">
              <option value="">Select industry</option>
              {INDUSTRY_OPTIONS.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
            </select>
            <select value={form.purchaseMix} onChange={(e) => update('purchaseMix', e.target.value)} className={fieldClass} aria-label="Local versus imported purchasing">
              <option value="">Local versus imported purchasing</option>
              <option value="Mostly local">Mostly local</option>
              <option value="Balanced local and imported">Balanced local and imported</option>
              <option value="Mostly imported">Mostly imported</option>
            </select>
            <textarea required value={form.procurementCategories} onChange={(e) => update('procurementCategories', e.target.value)} placeholder="Main procurement categories, e.g. Packaging, Logistics, Metals" className={`${fieldClass} min-h-24`} />
            <textarea required value={form.commodities} onChange={(e) => update('commodities', e.target.value)} placeholder="Main commodities, e.g. Diesel, Steel, Polyethylene" className={`${fieldClass} min-h-24`} />
            <textarea value={form.sourcingCountries} onChange={(e) => update('sourcingCountries', e.target.value)} placeholder="Main sourcing countries" className={`${fieldClass} min-h-20`} />
            <textarea value={form.tradeLanes} onChange={(e) => update('tradeLanes', e.target.value)} placeholder="Main trade lanes, e.g. China to Durban" className={`${fieldClass} min-h-20`} />
            <textarea value={form.procurementChallenges} onChange={(e) => update('procurementChallenges', e.target.value)} placeholder="Procurement challenges" className={`${fieldClass} min-h-20 sm:col-span-2`} />
          </div>
        </section>

        <label className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-canvas-raised p-4 text-sm text-ink-muted">
          <input type="checkbox" checked={form.newsletterOptIn} onChange={(e) => update('newsletterOptIn', e.target.checked)} className="mt-1" />
          <span>Send me the weekly ProcureChain Market Brief. I can unsubscribe at any time.</span>
        </label>
        {completeOnboarding.error && <p className="mt-4 text-sm text-negative">{(completeOnboarding.error as Error).message || 'Unable to save your profile.'}</p>}
        <button type="submit" disabled={completeOnboarding.isPending} className="mt-5 w-full rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60">{completeOnboarding.isPending ? 'Saving your profile…' : 'Save profile and open Market Brief'}</button>
      </form>
    </div>
  );
}
