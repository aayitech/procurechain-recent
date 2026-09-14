'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

const ONBOARDING_ROUTES = ['/login', '/register', '/onboarding'];

export function OnboardingGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, user } = useAuthStore();

  useEffect(() => {
    // `undefined` is an older persisted session created before onboarding was
    // introduced. Those users are grandfathered; only an explicit `null` from
    // a newly created account should trigger the form.
    if (!hydrated || !user || user.onboardingCompletedAt !== null) return;
    if (ONBOARDING_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) return;
    router.replace('/onboarding');
  }, [hydrated, pathname, router, user]);

  return null;
}
