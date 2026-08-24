import { MarketBriefArchiveList } from '@/components/market-brief/MarketBriefArchiveList';

export const metadata = {
  title: 'Procurement Market Brief',
  description: 'Weekly procurement intelligence: commodities, FX, freight, supplier and industry developments.',
};

export default function MarketBriefArchivePage() {
  return (
    <div className="container-page py-16">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">ProcureChain Procurement Market Brief</p>
        <h1 className="text-3xl font-semibold text-ink">What changed in procurement this week?</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          A weekly, AI-assisted brief grounded only in the real commodity, FX and trade-press data
          tracked on this site — never invented figures or events.
        </p>
      </div>
      <MarketBriefArchiveList />
    </div>
  );
}
