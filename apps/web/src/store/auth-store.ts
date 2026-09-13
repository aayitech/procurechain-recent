import { create } from 'zustand';
import type { AuthUser } from '@/types/auth';

const STORAGE_KEY = 'procurechain-auth';

function tokenHasExpired(token: string): boolean {
  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return true;
    const base64Url = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const base64 = base64Url.padEnd(Math.ceil(base64Url.length / 4) * 4, '=');
    const payload = JSON.parse(window.atob(base64)) as { exp?: number };
    return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  setAuth: (token, user) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    }
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    set({ token: null, user: null });
  },
  hydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { token: string; user: AuthUser };
        if (tokenHasExpired(parsed.token)) {
          window.localStorage.removeItem(STORAGE_KEY);
          set({ token: null, user: null, hydrated: true });
          return;
        }
        set({ token: parsed.token, user: parsed.user, hydrated: true });
        return;
      }
    } catch {
      // ignore malformed storage
    }
    set({ hydrated: true });
  },
}));
