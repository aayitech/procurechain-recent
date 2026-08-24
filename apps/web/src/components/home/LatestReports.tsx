'use client';

import { useState } from 'react';
import { FileText, Share2 } from 'lucide-react';

const REPORTS = [
  { title: 'Monthly Procurement Intelligence', period: 'August 2026' },
  { title: 'Packaging Market Report', period: 'Q3 2026' },
  { title: 'Mining Supply Chain Report', period: 'Q3 2026' },
  { title: 'Quarterly Commodity Outlook', period: 'Q3 2026' },
  { title: 'Executive Procurement Brief', period: 'August 2026' },
];

export function LatestReports() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function handleShare(title: string, index: number) {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled — no-op
      }
      return;
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }

  return (
    <section id="reports" className="container-page py-16">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink">Latest Reports</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Report generation (authored analysis + PDF export) is part of the Knowledge Centre
          module — titles below show what&apos;s planned.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((report, index) => (
          <div key={report.title} className="card flex flex-col justify-between p-5">
            <div>
              <FileText size={18} className="text-accent" />
              <h3 className="mt-3 text-sm font-semibold text-ink">{report.title}</h3>
              <p className="mt-1 text-xs text-ink-faint">{report.period}</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">
                Coming soon
              </span>
              <button
                type="button"
                onClick={() => handleShare(report.title, index)}
                className="ml-auto flex items-center gap-1 text-xs text-ink-faint transition-colors hover:text-ink"
              >
                <Share2 size={13} />
                {copiedIndex === index ? 'Link copied' : 'Share'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
