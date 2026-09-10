'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { SITE_LANGUAGES, SiteLocale } from '@/lib/i18n';

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="relative flex items-center">
      <Globe size={16} className="pointer-events-none absolute left-2 text-ink-faint" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as SiteLocale)}
        aria-label="Select language"
        className="appearance-none rounded-md bg-transparent py-1.5 pl-7 pr-2 text-sm text-ink-muted hover:text-ink focus:outline-none"
      >
        {SITE_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-canvas-raised text-ink">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
