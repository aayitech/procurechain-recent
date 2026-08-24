import { MarketBriefDetailView } from '@/components/market-brief/MarketBriefDetailView';

export default function MarketBriefDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container-page py-16">
      <MarketBriefDetailView slug={params.slug} />
    </div>
  );
}
