import { create } from 'zustand';

const STORAGE_KEY = 'procurechain-preferences';

interface Preferences {
  country: string;
  currencyCode: string;
}

interface PreferencesState extends Preferences {
  setCountry: (country: string) => void;
  setCurrencyCode: (code: string) => void;
  hydrate: () => void;
}

function persist(prefs: Preferences) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  country: '',
  currencyCode: 'USD',
  setCountry: (country) => {
    set({ country });
    persist({ country, currencyCode: get().currencyCode });
  },
  setCurrencyCode: (currencyCode) => {
    set({ currencyCode });
    persist({ country: get().country, currencyCode });
  },
  hydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Preferences>;
        set({ country: parsed.country ?? '', currencyCode: parsed.currencyCode ?? 'USD' });
      }
    } catch {
      // ignore malformed storage
    }
  },
}));
