'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { useMarketBriefList } from '@/hooks/useMarketBrief';

function formatWeekOf(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function LatestMarketBriefCard() {
  const { data } = useMarketBriefList();
  const latest = data?.[0];

  return (
    <div className="card p-5">
      <div className="mb-2 flex items-center gap-2">
        <FileText size={15} className="text-accent" />
        <p className="text-sm font-medium text-ink">Procurement Market Brief</p>
      </div>
      {latest ? (
        <>
          <p className="text-xs text-ink-muted">Week of {formatWeekOf(latest.weekOf)} is ready.</p>
          <Link href={`/market-brief/${latest.slug}`} className="mt-2 inline-block text-xs text-accent hover:underline">
            Read this week&apos;s brief →
          </Link>
        </>
      ) : (
        <p className="text-xs text-ink-faint">
          No brief published yet.{' '}
          <Link href="/market-brief" className="text-accent hover:underline">
            View archive
          </Link>
        </p>
      )}
    </div>
  );
}
