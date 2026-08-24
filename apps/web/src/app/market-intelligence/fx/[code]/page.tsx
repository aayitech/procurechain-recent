import { FxDetailView } from '@/components/market-intelligence/FxDetailView';

export default function FxDetailPage({ params }: { params: { code: string } }) {
  return (
    <div className="container-page py-16">
      <FxDetailView code={params.code.toUpperCase()} />
    </div>
  );
}
