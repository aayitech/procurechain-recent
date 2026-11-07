'use client';

import { FormEvent, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { useCreateLead } from '@/hooks/useCreateLead';
import { useTrackEngagement } from '@/hooks/useEngagement';
import { getEngagementSessionId } from '@/lib/engagement';
import { downloadCsv } from '@/lib/csv';
import { captureCampaignAttribution, getCampaignAttribution, leadAttributionFields } from '@/lib/campaign-attribution';
import { getEmailFromUrl, trackGhlEvent } from '@/lib/ghl-tracking';

interface CalculatorShellProps {
  title: string;
  description: string;
  slug: string;
  csvFilename: string;
  getCsvRows: () => Array<Record<string, string | number>>;
  children: ReactNode;
}

export function CalculatorShell({ title, description, slug, csvFilename, getCsvRows, children }: CalculatorShellProps) {
  const [showGate, setShowGate] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const { mutate, isPending } = useCreateLead();
  const track = useTrackEngagement();

  useEffect(() => {
    captureCampaignAttribution(window.location.search);
    const calculator = slug === 'rfq-efficiency' ? 'RFQ Efficiency' : slug === 'tco' ? 'TCO' : slug === 'savings' ? 'Savings' : null;
    if (calculator) {
      const emailFromUrl = getEmailFromUrl();
      if (emailFromUrl) {
        setEmail(emailFromUrl);
        setEmailConfirmed(true);
        trackGhlEvent({ event: 'calculator_used', email: emailFromUrl, calculator });
      }
      else setEmail('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCalculatorEmail(event: FormEvent) {
    event.preventDefault();
    const calculator = slug === 'rfq-efficiency' ? 'RFQ Efficiency' : slug === 'tco' ? 'TCO' : slug === 'savings' ? 'Savings' : null;
    if (calculator) {
      setEmailConfirmed(true);
      trackGhlEvent({ event: 'calculator_used', email, calculator });
    }
  }

  function handleDownloadClick() {
    if (unlocked) {
      track('calculator_exported', leadAttributionFields(getCampaignAttribution(), slug));
      downloadCsv(csvFilename, getCsvRows());
      return;
    }
    setShowGate(true);
  }

  function handleGateSubmit(event: FormEvent) {
    event.preventDefault();
    mutate(
      {
        firstName,
        email,
        source: 'CALCULATOR_DOWNLOAD',
        sourceDetail: slug,
        newsletterOptIn,
        sessionId: getEngagementSessionId(),
        customFields: leadAttributionFields(getCampaignAttribution(), slug),
      },
      {
        onSuccess: () => {
          setUnlocked(true);
          setShowGate(false);
          track('calculator_exported', leadAttributionFields(getCampaignAttribution(), slug));
          downloadCsv(csvFilename, getCsvRows());
        },
      },
    );
  }

  return (
    <div className="container-page py-16">
      <Link href="/calculators" className="text-sm text-ink-muted hover:text-ink">
        ← All calculators
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">{description}</p>

      {['rfq-efficiency', 'tco', 'savings'].includes(slug) && !emailConfirmed ? (
        <form onSubmit={handleCalculatorEmail} className="card mt-8 max-w-md p-6">
          <h2 className="text-lg font-semibold text-ink">View your calculator result</h2>
          <p className="mt-2 text-sm text-ink-muted">Enter your email to see the result.</p>
          <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Work email" className="mt-4 w-full rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink" />
          <button className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white">Show result</button>
        </form>
      ) : (
        <div className="mt-8">{children}</div>
      )}

      <div className="mt-8 border-t border-border-subtle pt-6">
        {!showGate ? (
          <button
            type="button"
            onClick={handleDownloadClick}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-accent hover:text-ink"
          >
            <Download size={15} />
            Download results as CSV
          </button>
        ) : (
          <form onSubmit={handleGateSubmit} className="card max-w-md p-5">
            <p className="text-sm font-medium text-ink">Get your results as a CSV</p>
            <p className="mt-1 text-xs text-ink-faint">
              Enter your email to download the CSV. Newsletter subscription is optional.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email"
                className="w-full rounded-lg border border-border bg-canvas-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={isPending}
                className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {isPending ? 'Sending…' : 'Get CSV'}
              </button>
            </div>
            <label className="mt-3 flex items-start gap-2 text-xs text-ink-muted">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(event) => setNewsletterOptIn(event.target.checked)}
                className="mt-0.5"
              />
              Subscribe me to the weekly Procurement Market Brief. I can unsubscribe at any time.
            </label>
          </form>
        )}
      </div>
    </div>
  );
}
