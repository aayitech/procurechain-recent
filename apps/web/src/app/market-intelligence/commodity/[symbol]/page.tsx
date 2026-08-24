import { CommodityDetailView } from '@/components/market-intelligence/CommodityDetailView';

export default function CommodityDetailPage({ params }: { params: { symbol: string } }) {
  return (
    <div className="container-page py-16">
      <CommodityDetailView symbol={params.symbol.toUpperCase()} />
    </div>
  );
}
