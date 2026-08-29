'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { useUiStore } from '@/store/ui-store';
import { NavDropdown } from './NavDropdown';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { AuthMenu } from './AuthMenu';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

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
    label: 'Category Explorer',
    href: '/#categories',
    description: 'Browse all procurement categories',
  },
  {
    label: 'Packaging',
    href: '/#categories',
    description: 'Market score, trend, and outlook',
  },
  {
    label: 'Manufacturing',
    href: '/#categories',
    description: 'Market score, trend, and outlook',
  },
];

const SIMPLE_LINKS = [
  { label: 'Market Brief', href: '/market-brief' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Benchmarking', href: '/benchmarking' },
  { label: 'Knowledge Centre', href: '/knowledge-centre' },
  { label: 'Book a Demo', href: '/#book-demo' },
];

const MOBILE_LINKS = [
  { label: 'Market Intelligence', href: '/market-intelligence' },
  { label: 'Market Brief', href: '/market-brief' },
  { label: 'Categories', href: '/#categories' },
  { label: 'AI Assistant', href: '/assistant' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Benchmarking', href: '/benchmarking' },
  { label: 'Knowledge Centre', href: '/knowledge-centre' },
  { label: 'Book a Demo', href: '/#book-demo' },
];

export function Header() {
  const { mobileNavOpen, setMobileNavOpen, setSearchOpen } = useUiStore();

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-white">
<div className="container-page flex h-16 min-w-0 items-center justify-between gap-2 overflow-hidden">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="ProcureChain"
            width={180}
            height={80}
            priority
            className="h-14 w-auto object-contain"
          />

          <span className="hidden 2xl:inline text-xs font-normal text-ink-faint">
            Intelligence Hub
          </span>
        </Link>

        {/* Desktop Navigation */}
<nav className="hidden min-w-0 flex-1 items-center justify-center gap-3 xl:flex">
            <NavDropdown
            label="Market Intelligence"
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
className="whitespace-nowrap text-xs text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
<div className="hidden shrink-0 items-center gap-0.5 xl:flex">
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
className="flex h-9 w-9 items-center justify-center text-gray-700 hover:text-gray-900"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Menu */}
      {mobileNavOpen && (
        <nav className="border-t border-border-subtle bg-white px-6 py-4 xl:hidden">
          <ul className="flex flex-col gap-3">

            {MOBILE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm text-ink-muted hover:text-ink"
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