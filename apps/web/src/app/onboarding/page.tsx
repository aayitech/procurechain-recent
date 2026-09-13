'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GhlSignupEmbed } from '@/components/leads/GhlSignupEmbed';
import { useAuthStore } from '@/store/auth-store';

export default function OnboardingPage() {
  const router = useRouter();
  const { hydrated, user } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace('/login');
    else if (user.onboardingCompletedAt) router.replace('/');
  }, [hydrated, router, user]);

  if (!hydrated || !user || user.onboardingCompletedAt) {
    return <div className="container-page py-20 text-center text-sm text-ink-muted">Loading your profile…</div>;
  }

  return (
    <div className="container-page flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">One final step</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Personalize your procurement intelligence</h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          Tell us a little about your market so we can prioritize the right industry signals, briefings and updates.
        </p>

        <div className="mt-6">
          <GhlSignupEmbed email={user.email} />
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-ink-muted">
          Submit this form once. You will then continue automatically to your dashboard.
        </p>
      </div>
    </div>
  );
}
