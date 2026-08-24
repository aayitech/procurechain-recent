'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' },
  { code: 'sw', label: 'Kiswahili' },
];

export function LanguageSelector() {
  const [current, setCurrent] = useState('en');

  return (
    <div className="relative flex items-center">
      <Globe size={16} className="pointer-events-none absolute left-2 text-ink-faint" />
      <select
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        aria-label="Select language"
        className="appearance-none rounded-md bg-transparent py-1.5 pl-7 pr-2 text-sm text-ink-muted hover:text-ink focus:outline-none"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-canvas-raised text-ink">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
