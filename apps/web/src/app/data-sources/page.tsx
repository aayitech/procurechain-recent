import type { Metadata } from 'next';
import { DataSourceRegistry } from '@/components/market-intelligence/DataSourceRegistry';

export const metadata: Metadata = {
  title: 'Approved Data Sources',
  description: 'The controlled source registry used by ProcureChain market intelligence.',
};

export default function DataSourcesPage() {
  return <div className="container-page py-10 lg:py-14"><div className="mb-8 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Source control</p><h1 className="mt-2 text-3xl font-semibold text-ink">Approved data sources</h1><p className="mt-3 text-sm leading-6 text-ink-muted">ProcureChain uses official government and international sources first. A listed source is not treated as live until its authorised connector and licence requirements are satisfied; unavailable data is never estimated.</p></div><DataSourceRegistry /></div>;
}
