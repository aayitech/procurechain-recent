'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useUiStore } from '@/store/ui-store';
import { SEARCH_INDEX } from '@/lib/search-index';

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useUiStore();
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isCmdK) {
        event.preventDefault();
        setSearchOpen(!useUiStore.getState().searchOpen);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setSearchOpen]);

  useEffect(() => {
    if (!searchOpen) setQuery('');
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_INDEX.slice(0, 8);
    return SEARCH_INDEX.filter(
      (entry) =>
        entry.label.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.group.toLowerCase().includes(q),
    ).slice(0, 20);
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>();
    for (const entry of results) {
      const list = map.get(entry.group) ?? [];
      list.push(entry);
      map.set(entry.group, list);
    }
    return Array.from(map.entries());
  }, [results]);

  if (!searchOpen) return null;

  function go(href: string) {
    setSearchOpen(false);
    router.push(href);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-24" onClick={() => setSearchOpen(false)}>
      <div
        className="card w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3">
          <Search size={18} className="text-ink-faint" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commodities, calculators, categories, reports..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="text-ink-faint hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {grouped.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-ink-faint">No results for &ldquo;{query}&rdquo;</p>
          )}
          {grouped.map(([group, entries]) => (
            <div key={group} className="mb-2">
              <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                {group}
              </p>
              {entries.map((entry) => (
                <button
                  key={entry.href + entry.label}
                  type="button"
                  onClick={() => go(entry.href)}
                  className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left transition-colors hover:bg-canvas-overlay"
                >
                  <span className="text-sm text-ink">{entry.label}</span>
                  <span className="text-xs text-ink-faint">{entry.description}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle px-4 py-2 text-[11px] text-ink-faint">
          <span>↵ to select</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}
