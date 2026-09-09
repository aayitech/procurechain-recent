import Link from 'next/link';
import { Facebook, Linkedin, Twitter } from 'lucide-react';

const FOOTER_COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'Personalised Overview', href: '/#dashboard' },
      { label: 'Market Intelligence', href: '/market-intelligence' },
      { label: 'Market Brief', href: '/market-brief' },
      { label: 'AI Assistant', href: '/assistant' },
    ],
  },
  {
    title: 'Decision Tools',
    links: [
      { label: 'Calculators', href: '/calculators' },
      { label: 'Benchmarking', href: '/benchmarking' },
      { label: 'Procurement Health', href: '/health-check' },
    ],
  },
  {
    title: 'Intelligence',
    links: [
      { label: 'Knowledge Centre', href: '/knowledge-centre' },
      { label: 'Approved Data Sources', href: '/data-sources' },
      { label: 'Live Market Coverage', href: '/market-intelligence' },
    ],
  },
  {
    title: 'Get Started',
    links: [
      { label: 'Book a Demo', href: '/book-demo' },
      { label: 'Log In', href: '/login' },
      { label: 'Create Account', href: '/register' },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: 'LinkedIn', icon: Linkedin },
  { label: 'Twitter', icon: Twitter },
  { label: 'Facebook', icon: Facebook },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-canvas-raised">
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="mb-3 text-sm font-semibold text-ink">{column.title}</h3>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-muted hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page flex flex-col gap-4 border-t border-border-subtle py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 text-xs text-ink-faint">
          <p>© {new Date().getFullYear()} ProcureChain Intelligence Hub. All rights reserved.</p>
          <p>AI-Powered Procurement Intelligence, Market Insights &amp; Decision Support</p>
        </div>
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map((social) => (
            <span
              key={social.label}
              aria-label={`${social.label} (coming soon)`}
              title={`${social.label} — coming soon`}
              className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-md text-ink-faint opacity-50"
            >
              <social.icon size={16} />
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
