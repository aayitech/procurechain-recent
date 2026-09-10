'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const active = Boolean(href && pathname === href);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {href ? (
        <div className={`flex items-center whitespace-nowrap rounded-lg pl-2.5 text-xs font-medium transition-colors 2xl:text-sm ${active ? 'bg-accent/10 text-accent' : 'text-ink-muted hover:bg-slate-100 hover:text-ink'}`}>
          <Link href={href} className="py-2" aria-current={pathname === href ? 'page' : undefined} onClick={() => setOpen(false)}>
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
          className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition-colors 2xl:text-sm ${active ? 'bg-accent/10 text-accent' : 'text-ink-muted hover:bg-slate-100 hover:text-ink'}`}
          aria-expanded={open}
        >
          {label}
          <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      )}

      {open && (
        <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 transition-colors hover:bg-slate-100"
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
