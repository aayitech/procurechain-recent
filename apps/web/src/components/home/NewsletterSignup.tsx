'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useCreateLead } from '@/hooks/useCreateLead';
import { useTrackEngagement } from '@/hooks/useEngagement';
import { captureCampaignAttribution, getCampaignAttribution, leadAttributionFields } from '@/lib/campaign-attribution';
import { getEngagementSessionId } from '@/lib/engagement';

export function NewsletterSignup() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [consented, setConsented] = useState(false);
  const { mutate, isPending, isSuccess, isError } = useCreateLead();
  const track = useTrackEngagement();

  useEffect(() => {
    captureCampaignAttribution(window.location.search);
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({
      firstName,
      email,
      newsletterOptIn: true,
      source: 'NEWSLETTER',
      sourceDetail: 'market_brief_subscription',
      sessionId: getEngagementSessionId(),
      customFields: leadAttributionFields(getCampaignAttribution(), 'market-brief-newsletter'),
    }, {
      onSuccess: () => track('newsletter_subscribed', leadAttributionFields(getCampaignAttribution(), 'market-brief-newsletter')),
    });
  }

  if (isSuccess) {
    return (
      <div id="newsletter" className="card p-6 text-sm text-ink">
        You&apos;re subscribed to the Market Brief. Look out for the next issue.
      </div>
    );
  }

  return (
    <div id="newsletter" className="card p-6">
      <h3 className="text-lg font-semibold text-ink">Subscribe to the Market Brief</h3>
      <p className="mt-1 text-sm text-ink-muted">
        A regular snapshot of market movement, procurement implications, category signals, and one useful tool.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3">
        <input
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          autoComplete="given-name"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email"
          autoComplete="email"
          className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none sm:col-span-2"
        />
        <label className="flex items-start gap-2 text-xs leading-5 text-ink-muted">
          <input required type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} className="mt-1" />
          <span>I agree to receive the Market Brief by email. I can unsubscribe at any time.</span>
        </label>
        <button
          type="submit"
          disabled={isPending || !consented}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? 'Subscribing…' : 'Subscribe to the Market Brief'}
        </button>
      </form>
      {isError && <p className="mt-2 text-xs text-negative">Something went wrong — please try again.</p>}
      <p className="mt-2 text-[11px] text-ink-faint">Your subscription is separate from Health Check, calculator, and demo requests.</p>
    </div>
  );
}
