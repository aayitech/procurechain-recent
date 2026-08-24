import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { QueryProvider } from '@/lib/query-provider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeInit } from '@/components/theme/ThemeInit';
import { PreferencesInit } from '@/components/theme/PreferencesInit';
import { AuthInit } from '@/components/theme/AuthInit';
import { GlobalSearch } from '@/components/layout/GlobalSearch';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const SITE_URL = 'https://procurechain.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ProcureChain Intelligence Hub — AI-Powered Procurement Intelligence',
    template: '%s | ProcureChain Intelligence Hub',
  },
  description:
    'AI-powered procurement intelligence, market insights, and decision support. Live commodity prices, exchange rates, benchmarking, and calculators for procurement professionals.',
  openGraph: {
    title: 'ProcureChain Intelligence Hub',
    description: 'AI-Powered Procurement Intelligence, Market Insights & Decision Support',
    url: SITE_URL,
    siteName: 'ProcureChain Intelligence Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProcureChain Intelligence Hub',
    description: 'AI-Powered Procurement Intelligence, Market Insights & Decision Support',
  },
  robots: { index: true, follow: true },
};

// Runs before hydration so the light/dark choice is applied before first
// paint — otherwise a light-mode visitor would see a flash of dark theme.
const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('procurechain-theme');
    document.documentElement.dataset.theme = stored === 'light' ? 'light' : 'dark';
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <QueryProvider>
          <ThemeInit />
          <PreferencesInit />
          <AuthInit />
          <GlobalSearch />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
