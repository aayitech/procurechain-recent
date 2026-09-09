import type { Metadata } from 'next';
import { CalendarCheck2, Workflow } from 'lucide-react';
import { GhlSurveyEmbed } from '@/components/leads/GhlSurveyEmbed';

export const metadata: Metadata = {
  title: 'Book a Demo',
  description: 'Book a ProcureChain Intelligence Hub demo directly with our team.',
};

export default function BookDemoPage() {
  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Talk to ProcureChain</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Book a demo directly</h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Tell us what you buy and where you source. Choose a suitable time in the form below and
            the ProcureChain team will receive your details in GoHighLevel for follow-up.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-canvas-raised px-3 py-2"><CalendarCheck2 size={15} className="text-accent" /> Book from this page</span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-canvas-raised px-3 py-2"><Workflow size={15} className="text-accent" /> Ready for GHL follow-up automation</span>
          </div>
        </div>
        <GhlSurveyEmbed />
      </div>
    </div>
  );
}
