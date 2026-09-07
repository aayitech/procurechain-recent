'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export interface NavDropdownItem {
  label: string;
  href: string;
  description: string;
}

export function NavDropdown({
  label,
  href,
  items,
}: {
  label: string;
  href?: string;
  items: NavDropdownItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {href ? (
        <div className="flex items-center text-sm text-ink-muted transition-colors hover:text-ink">
          <Link href={href} className="py-2" onClick={() => setOpen(false)}>
            {label}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-8 w-7 items-center justify-center"
            aria-label={`Toggle ${label} menu`}
            aria-expanded={open}
          >
            <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-1 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
          aria-expanded={open}
        >
          {label}
          <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      )}

      {open && (
        <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3">
          <div className="card overflow-hidden p-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 transition-colors hover:bg-canvas-overlay"
                onClick={() => setOpen(false)}
              >
                <p className="text-sm font-medium text-ink">{item.label}</p>
                <p className="text-xs text-ink-faint">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
