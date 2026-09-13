'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCompleteOnboarding } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth-store';

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { hydrated, user } = useAuthStore();
  const completeOnboarding = useCompleteOnboarding();
  const started = useRef(false);

  useEffect(() => {
    if (!hydrated || started.current) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    started.current = true;
    completeOnboarding.mutate(undefined, {
      onSuccess: () => {
        if (window.top && window.top !== window.self) window.top.location.href = '/';
        else router.replace('/');
      },
    });
  }, [completeOnboarding, hydrated, router, user]);

  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-xl font-semibold text-ink">Finishing your setup…</h1>
      <p className="mt-2 text-sm text-ink-muted">Your personalized dashboard will open automatically.</p>
      {completeOnboarding.error && (
        <p className="mt-4 text-sm text-negative">
          {(completeOnboarding.error as Error).message || 'Unable to finish setup. Please refresh and try again.'}
        </p>
      )}
    </div>
  );
}
