'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { hydrated, user } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace('/register');
    else router.replace(user.onboardingCompletedAt ? '/market-brief' : '/onboarding');
  }, [hydrated, router, user]);

  return <div className="container-page py-20 text-center text-sm text-ink-muted">Opening your ProcureChain profile…</div>;
}
