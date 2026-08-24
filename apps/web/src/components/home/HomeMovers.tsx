'use client';

import { useCommodityList, useFxList } from '@/hooks/useMarketIntelligence';
import { TopMovers } from '@/components/market-intelligence/TopMovers';

export function HomeMovers() {
  const { data: commodities } = useCommodityList();
  const { data: fx } = useFxList();
  return <TopMovers commodities={commodities ?? []} fx={fx ?? []} />;
}
