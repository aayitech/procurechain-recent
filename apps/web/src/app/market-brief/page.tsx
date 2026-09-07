import { VisualMarketBrief } from '@/components/market-brief/VisualMarketBrief';

export const metadata = {
  title: 'Procurement Market Brief',
  description: 'Weekly procurement intelligence: commodities, FX, freight, supplier and industry developments.',
};

export default function MarketBriefArchivePage() {
  return <VisualMarketBrief />;
}
