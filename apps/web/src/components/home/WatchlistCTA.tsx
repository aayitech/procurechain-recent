import Link from 'next/link';
import { Star } from 'lucide-react';

export function WatchlistCTA() {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Star size={20} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-ink">Create Your Watchlist</p>
        <p className="text-xs text-ink-faint">Track the commodities and currencies that matter to you.</p>
      </div>
      <Link
        href="/market-intelligence"
        className="shrink-0 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Start →
      </Link>
    </div>
  );
}
