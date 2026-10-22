'use client';

import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { useUiStore } from '@/store/ui-store';
import { NavDropdown } from './NavDropdown';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { AuthMenu } from './AuthMenu';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { usePathname } from 'next/navigation';

const MARKET_INTELLIGENCE_ITEMS = [
  {
    label: 'Overview',
    href: '/market-intelligence',
    description: 'Commodities, FX, and market snapshots',
  },
  {
    label: 'Commodities',
    href: '/market-intelligence#commodities',
    description: 'Live prices with historical trend',
  },
  {
    label: 'Exchange Rates',
    href: '/market-intelligence#fx',
    description: 'USD-based rates, updated continuously',
  },
];

const CATEGORY_ITEMS = [
  {
    label: 'Available Categories',
    href: '/market-intelligence',
    description: 'Browse categories backed by active sources',
  },
  {
    label: 'Approved Sources',
    href: '/data-sources',
    description: 'Review providers and current coverage',
  },
  {
    label: 'Market Brief',
    href: '/market-brief',
    description: 'See priority movements and implications',
  },
  {
    label: 'Benchmarking',
    href: '/benchmarking',
    description: 'Compare procurement performance',
  },
  {
    label: 'Knowledge Centre',
    href: '/knowledge-centre',
    description: 'Explore verified learning resources',
  },
];

const SIMPLE_LINKS = [
  { label: 'Market Brief', href: '/market-brief' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Benchmarking', href: '/benchmarking', wideOnly: true },
  { label: 'Knowledge Centre', href: '/knowledge-centre', wideOnly: true },
  { label: 'Book a Demo', href: '/book-demo' },
];

const MOBILE_LINKS = [
  { label: 'Buyer Resources', href: '/campaigns' },
  { label: 'Market Intelligence', href: '/market-intelligence' },
  { label: 'Market Brief', href: '/market-brief' },
  { label: 'Data Sources', href: '/data-sources' },
  { label: 'AI Assistant', href: '/assistant' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Benchmarking', href: '/benchmarking' },
  { label: 'Knowledge Centre', href: '/knowledge-centre' },
  { label: 'Book a Demo', href: '/book-demo' },
];

export function Header() {
  const { mobileNavOpen, setMobileNavOpen, setSearchOpen } = useUiStore();
  const pathname = usePathname();

  return (
    <header className="site-header-light sticky top-0 z-50 border-b border-slate-200 bg-[#FFFFFF] shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] min-w-0 items-center justify-between gap-2 overflow-visible px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex h-11 w-auto shrink-0 items-center gap-2.5" aria-label="ProcureChain home">
          <svg aria-hidden="true" viewBox="0 0 40 40" className="h-9 w-9 shrink-0 text-[#292E48]" fill="none">
            <path d="M18.1 8.2 15 7.6a10.3 10.3 0 0 0-7.4 17.7l4.8 4.8a10.3 10.3 0 0 0 17.7-7.4l-.6-3.1" stroke="currentColor" strokeWidth="3.1" strokeLinecap="square" />
            <path d="m21.9 31.8 3.1.6a10.3 10.3 0 0 0 7.4-17.7l-4.8-4.8A10.3 10.3 0 0 0 9.9 17.3l.6 3.1" stroke="currentColor" strokeWidth="3.1" strokeLinecap="square" />
          </svg>
          <span className="whitespace-nowrap text-[17px] font-medium tracking-[-0.055em] text-[#292E48]">
            Procure<span className="font-normal text-[#737373]">Chain</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-2 xl:flex 2xl:gap-3">
          <NavDropdown
            label="Market Intelligence"
            href="/market-intelligence"
            items={MARKET_INTELLIGENCE_ITEMS}
          />

          <NavDropdown
            label="Categories"
            items={CATEGORY_ITEMS}
          />

          {SIMPLE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={`${link.wideOnly ? 'hidden 2xl:inline-flex' : 'inline-flex'} items-center whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition-colors 2xl:text-sm ${pathname === link.href ? 'bg-accent/10 text-accent' : 'text-ink-muted hover:bg-slate-100 hover:text-ink'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-0.5 border-l border-slate-200 pl-2 xl:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center  rounded-md text-ink-muted transition-colors hover:bg-canvas-overlay hover:text-ink"
          >
            <Search size={17} />
          </button>

          <CurrencySelector />
          <LanguageSelector />
          <ThemeToggle />
          <AuthMenu />

          <Link
            href="/health-check"
            className="ml-1 shrink-0 whitespace-nowrap rounded-md bg-accent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Procurement Health
          </Link>
        </div>

        {/* Tablet + Mobile */}
        <div className="flex items-center gap-1 xl:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center text-ink-muted hover:text-ink"
          >
            <Search size={20} />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center text-ink-muted hover:text-ink"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Menu */}
      {mobileNavOpen && (
        <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border-subtle bg-[#FFFFFF] px-6 py-4 xl:hidden">
          <ul className="flex flex-col gap-3">

            {MOBILE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${pathname === link.href ? 'bg-accent/10 text-accent' : 'text-ink-muted hover:bg-slate-100 hover:text-ink'}`}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="flex items-center gap-2 border-t border-border-subtle pt-3">
              <ThemeToggle />
              <CurrencySelector />
              <LanguageSelector />
            </li>

            <li>
              <AuthMenu />
            </li>

            <li>
              <Link
                href="/health-check"
                className="block text-sm font-medium text-accent"
                onClick={() => setMobileNavOpen(false)}
              >
                Check Your Procurement Health
              </Link>
            </li>

          </ul>
        </nav>
      )}
    </header>
  );
}
