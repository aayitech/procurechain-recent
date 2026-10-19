import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BUYER_CAMPAIGNS } from '@/lib/buyer-campaigns';

export const metadata: Metadata = {
  title: 'Procurement Buyer Resources',
  description: 'Choose a free ProcureChain resource for procurement health, savings, or market intelligence.',
};

export default function BuyerCampaignsPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">ProcureChain buyer resources</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-5xl">Start with the procurement question you need to answer.</h1>
        <p className="mt-4 text-base leading-7 text-ink-muted">Use a practical assessment, calculator, or market resource first. Each path helps you find a useful next step at your own pace.</p>
      </div>
      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {BUYER_CAMPAIGNS.map((campaign) => (
          <Link key={campaign.slug} href={`/campaigns/${campaign.slug}`} className="card group flex min-h-64 flex-col p-6 transition-colors hover:border-accent">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">{campaign.label}</p>
            <h2 className="mt-3 text-xl font-semibold text-ink">{campaign.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">{campaign.promise}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">Explore this resource <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
