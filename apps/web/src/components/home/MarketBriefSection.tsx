import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { LatestMarketBriefCard } from '@/components/home/LatestMarketBriefCard';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

export function MarketBriefSection() {
  return (
    <section className="container-page py-16">
      <h2 className="mb-1 text-2xl font-semibold text-ink">Market Brief &amp; Reports</h2>
      <p className="mb-6 max-w-2xl text-sm text-ink-muted">
        Weekly procurement market briefs and structured learning paths — real data and analysis,
        not fabricated reports.
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-4">
          <LatestMarketBriefCard />
          <div className="card p-5">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen size={15} className="text-accent" />
              <p className="text-sm font-medium text-ink">Procurement Knowledge Centre</p>
            </div>
            <p className="text-xs text-ink-muted">
              Verified learning paths on category strategy, market analysis, and procurement
              fundamentals.
            </p>
            <Link href="/knowledge-centre" className="mt-2 inline-block text-xs text-accent hover:underline">
              Explore the Knowledge Centre →
            </Link>
          </div>
        </div>
        <NewsletterSignup />
      </div>
    </section>
  );
}
