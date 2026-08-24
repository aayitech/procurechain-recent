'use client';

import { useEffect } from 'react';
import { useUiStore, type Theme } from '@/store/ui-store';

/**
 * The blocking inline script in <head> sets document.documentElement's
 * data-theme attribute before hydration (so there's no flash of the wrong
 * theme). This just syncs that already-applied value into the Zustand
 * store so the toggle button reflects reality on first render.
 */
export function ThemeInit() {
  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || 'dark';
    useUiStore.setState({ theme: current });
  }, []);

  return null;
}
