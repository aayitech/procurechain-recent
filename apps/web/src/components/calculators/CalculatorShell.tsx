'use client';

import { FormEvent, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { useCreateLead } from '@/hooks/useCreateLead';
import { useTrackEngagement } from '@/hooks/useEngagement';
import { getEngagementSessionId } from '@/lib/engagement';
import { downloadCsv } from '@/lib/csv';

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
  const { mutate, isPending } = useCreateLead();
  const track = useTrackEngagement();

  useEffect(() => {
    track('calculator_used');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDownloadClick() {
    if (unlocked) {
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
        newsletterOptIn: true,
        sessionId: getEngagementSessionId(),
      },
      {
        onSuccess: () => {
          setUnlocked(true);
          setShowGate(false);
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

      <div className="mt-8">{children}</div>

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
              We&apos;ll also add you to the weekly procurement briefing — unsubscribe anytime.
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
          </form>
        )}
      </div>
    </div>
  );
}
