'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { useUiStore } from '@/store/ui-store';
import { useScrolled } from '@/hooks/useScrolled';
import { NavDropdown } from './NavDropdown';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { AuthMenu } from './AuthMenu';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const MARKET_INTELLIGENCE_ITEMS = [
  { label: 'Overview', href: '/market-intelligence', description: 'Commodities, FX, and market snapshots' },
  { label: 'Commodities', href: '/market-intelligence#commodities', description: 'Live prices with historical trend' },
  { label: 'Exchange Rates', href: '/market-intelligence#fx', description: 'USD-based rates, updated continuously' },
];

const CATEGORY_ITEMS = [
  { label: 'Category Explorer', href: '/#categories', description: 'Browse all procurement categories' },
  { label: 'Packaging', href: '/#categories', description: 'Market score, trend, and outlook' },
  { label: 'Manufacturing', href: '/#categories', description: 'Market score, trend, and outlook' },
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
  const scrolled = useScrolled();

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'border-b border-border-subtle bg-canvas/85 backdrop-blur'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
 <Image
  src="/logo.png"
  alt="ProcureChain"
  width={180}
  height={45}
  priority
  className="h-[5rem] w-auto object-contain"
/>
</Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <NavDropdown label="Market Intelligence" items={MARKET_INTELLIGENCE_ITEMS} />
          <NavDropdown label="Categories" items={CATEGORY_ITEMS} />
          {SIMPLE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-canvas-overlay hover:text-ink"
          >
            <Search size={18} />
          </button>
          <CurrencySelector />
          <LanguageSelector />
          <ThemeToggle />
          <AuthMenu />
          <Link
            href="/health-check"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Check Your Procurement Health
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
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
            className="flex h-9 w-9 items-center justify-center text-ink"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <nav className="border-t border-border-subtle bg-canvas px-6 py-4 lg:hidden">
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
            <li className="flex items-center gap-2 pt-2">
              <ThemeToggle />
              <CurrencySelector />
              <LanguageSelector />
            </li>
            <li>
              <AuthMenu />
            </li>
            <li>
              <Link href="/health-check" className="block text-sm font-medium text-accent">
                Check Your Procurement Health
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
