'use client';

import { useEffect } from 'react';
import { usePreferencesStore } from '@/store/preferences-store';

export function PreferencesInit() {
  const hydrate = usePreferencesStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}
