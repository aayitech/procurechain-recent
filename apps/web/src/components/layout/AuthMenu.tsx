'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export function AuthMenu() {
  const { user, logout, hydrated } = useAuthStore();
  const [open, setOpen] = useState(false);

  if (!hydrated) return <div className="h-9 w-16" />;

  if (!user) {
    return (
      <Link href="/login" className="px-2 text-sm text-ink-muted hover:text-ink">
        Log in
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-ink-muted transition-colors hover:bg-canvas-overlay hover:text-ink"
      >
        <User size={15} />
        {user.firstName ?? user.email}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-canvas-raised p-2 shadow-card">
          <p className="truncate px-2 py-1 text-xs text-ink-faint">{user.email}</p>
          {user.industry && <p className="px-2 py-1 text-xs text-ink-muted">{user.industry}</p>}
          <button
            type="button"
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="mt-1 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm text-negative hover:bg-canvas-overlay"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
