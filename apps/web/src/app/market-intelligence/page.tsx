import { MarketTerminal } from '@/components/market-intelligence/MarketTerminal';
import { Suspense } from 'react';

export default function MarketIntelligencePage() {
  return <Suspense fallback={<div className="container-page py-10"><div className="card h-[640px] animate-pulse" /></div>}><MarketTerminal /></Suspense>;
}
