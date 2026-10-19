'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { BuyerCampaign } from '@/lib/buyer-campaigns';
import { captureCampaignAttribution, getCampaignAttribution, leadAttributionFields } from '@/lib/campaign-attribution';
import { getEngagementSessionId } from '@/lib/engagement';
import { useCreateLead } from '@/hooks/useCreateLead';
import { useTrackEngagement } from '@/hooks/useEngagement';

export function BuyerCampaignPage({ campaign }: { campaign: BuyerCampaign }) {
  const [form, setForm] = useState({ firstName: '', email: '', company: '', role: '', productInterest: campaign.defaultProductInterest ?? '' });
  const { mutate, isPending, isSuccess, isError } = useCreateLead();
  const track = useTrackEngagement();

  useEffect(() => {
    captureCampaignAttribution(window.location.search, campaign.slug);
    track('campaign_landing_viewed', leadAttributionFields(getCampaignAttribution(), 'campaign-landing-page', campaign.slug));
  }, [campaign.slug, track]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const attribution = getCampaignAttribution();
    mutate({
      firstName: form.firstName,
      email: form.email,
      company: form.company || undefined,
      role: form.role || undefined,
      source: 'GENERAL',
      sourceDetail: campaign.slug,
      sessionId: getEngagementSessionId(),
      customFields: {
        ...leadAttributionFields(attribution, 'campaign-follow-up-form', campaign.slug),
        campaign_primary_asset: campaign.primaryAsset,
        ...(form.productInterest ? { product_interest: form.productInterest } : {}),
        lead_type: 'Buyer',
      },
    });
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <section className="grid gap-10 rounded-3xl border border-border-subtle bg-canvas-raised p-6 shadow-card sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{campaign.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-ink sm:text-5xl">{campaign.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-ink-muted">{campaign.promise}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-faint">{campaign.description}</p>
          <Link href={campaign.primaryHref} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
            {campaign.primaryCta}<ArrowRight size={16} />
          </Link>
          <p className="mt-3 text-xs text-ink-faint">For {campaign.audience.toLowerCase()}.</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-canvas p-6">
          <p className="text-sm font-semibold text-ink">What you can get from this campaign</p>
          <ul className="mt-4 space-y-3">
            {campaign.proof.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-5 text-ink-muted">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-positive" />{item}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-border-subtle pt-4 text-xs leading-5 text-ink-faint">Start with the free resource. You do not need to book a demo to use it.</p>
        </div>
      </section>

      <section className="grid gap-8 py-12 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Choose a useful next step</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Start with your question</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{campaign.nextStep}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {campaign.tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="card group p-5 transition-colors hover:border-accent">
                <span className="flex items-center justify-between gap-3 text-sm font-semibold text-ink">{tool.title}<ArrowRight size={15} className="shrink-0 text-accent transition-transform group-hover:translate-x-1" /></span>
                <span className="mt-2 block text-xs leading-5 text-ink-muted">{tool.description}</span>
              </Link>
            ))}
          </div>
          <Link href="/market-brief#newsletter" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">Subscribe to the Market Brief <ArrowRight size={14} /></Link>
        </div>

        <div id="follow-up" className="card h-fit p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Optional follow-up</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">Want to discuss {campaign.product}?</h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">Leave your details and the team can follow up about the area you selected. This does not subscribe you to the Market Brief.</p>
          {isSuccess ? (
            <p className="mt-5 rounded-lg border border-positive/30 bg-positive/10 p-3 text-sm text-ink">Thanks. Your request has been received. You can still use the free resource above.</p>
          ) : (
            <form onSubmit={submit} className="mt-5 grid gap-3">
              <input required autoComplete="given-name" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} placeholder="First name" aria-label="First name" className="rounded-lg border border-border bg-canvas-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
              <input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Work email" aria-label="Work email" className="rounded-lg border border-border bg-canvas-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input autoComplete="organization" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="Company (optional)" aria-label="Company, optional" className="min-w-0 rounded-lg border border-border bg-canvas-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
                <input autoComplete="organization-title" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="Role (optional)" aria-label="Role, optional" className="min-w-0 rounded-lg border border-border bg-canvas-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none" />
              </div>
              <select value={form.productInterest} onChange={(event) => setForm({ ...form, productInterest: event.target.value })} aria-label="Product interest, optional" className="rounded-lg border border-border bg-canvas-raised px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none">
                <option value="">Let my needs guide the recommendation</option>
                <option value="SOURCE IQ">SOURCE IQ</option>
                <option value="SUPPLIER IQ">SUPPLIER IQ</option>
                <option value="CONTRACT IQ">CONTRACT IQ</option>
                <option value="SPEND IQ">SPEND IQ</option>
              </select>
              <button type="submit" disabled={isPending} className="mt-1 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60">{isPending ? 'Sending…' : 'Request a tailored follow-up'}</button>
              {isError && <p role="alert" className="text-xs text-negative">We couldn&apos;t send that just now. Please try again.</p>}
              <p className="text-[11px] leading-4 text-ink-faint">Your details are used to respond to this request. Newsletter signup is separate.</p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
