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

    if (user.onboardingCompletedAt) {
      router.replace('/market-brief');
      return;
    }

    started.current = true;
    completeOnboarding.mutate(undefined, {
      onSuccess: () => {
        if (window.top && window.top !== window.self) window.top.location.href = '/market-brief';
        else router.replace('/market-brief');
      },
    });
  }, [completeOnboarding, hydrated, router, user]);

  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-xl font-semibold text-ink">Personalizing your Market Brief…</h1>
      <p className="mt-2 text-sm text-ink-muted">Your preferences are being saved to ProcureChain.</p>
      {completeOnboarding.error && (
        <p className="mt-4 text-sm text-negative">
          {(completeOnboarding.error as Error).message || 'Unable to finish setup. Please refresh and try again.'}
        </p>
      )}
    </div>
  );
}
