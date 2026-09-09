'use client';

import { Database, ExternalLink, ShieldCheck } from 'lucide-react';
import { useDataSources } from '@/hooks/useDataSources';

const statusLabel = {
  active: 'Connected',
  configuration_required: 'Configuration required',
  planned: 'Approved · connection pending',
} as const;

export function DataSourceRegistry() {
  const { data = [], isLoading, isError } = useDataSources();

  if (isLoading) return <div className="card h-48 animate-pulse" />;
  if (isError) return <div className="card p-6"><p className="font-medium text-ink">Source registry temporarily unavailable</p><p className="mt-2 text-sm text-ink-muted">The market API could not be reached. No substitute sources will be used.</p></div>;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {data.map((source) => (
        <article key={source.sourceId} className="card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">{source.status === 'active' ? <ShieldCheck size={18} /> : <Database size={18} />}</div><div className="min-w-0"><h2 className="font-semibold text-ink">{source.sourceName}</h2><p className="mt-1 text-xs text-ink-faint">{source.domain} · {source.region}</p></div></div>
            <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${source.status === 'active' ? 'bg-positive/10 text-positive' : 'bg-warning/10 text-warning'}`}>{statusLabel[source.status]}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink-muted">{source.dataType.join(' · ')}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-faint"><span>{source.updateFrequency}</span><span>{source.historicalData ? 'Historical data' : 'Current/discovery data'}</span>{source.apiEndpoint && <a href={source.apiEndpoint} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">View source <ExternalLink size={12} /></a>}</div>
        </article>
      ))}
    </div>
  );
}
