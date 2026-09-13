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
    if (!hydrated || !user || user.onboardingCompletedAt) return;
    if (ONBOARDING_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) return;
    router.replace('/onboarding');
  }, [hydrated, pathname, router, user]);

  return null;
}
