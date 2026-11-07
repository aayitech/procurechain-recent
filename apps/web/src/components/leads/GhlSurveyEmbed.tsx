'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

export const GHL_DEMO_SURVEY_URL =
  process.env.NEXT_PUBLIC_GHL_DEMO_SURVEY_URL ??
  'https://api.leadconnectorhq.com/widget/survey/HSfuWm21CrWzWZ60UgST';

function withPrefill(url: string, currentUrl: URL, profile?: { email?: string | null; firstName?: string | null; lastName?: string | null; phone?: string | null; company?: string | null; country?: string | null }) {
  const result = new URL(url);
  const params = new URLSearchParams(currentUrl.search);
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim();
  const values: Record<string, string | undefined> = {
    email: profile?.email || params.get('email') || undefined,
    full_name: fullName || params.get('full_name') || params.get('name') || undefined,
    phone: profile?.phone || params.get('phone') || undefined,
    organization: profile?.company || params.get('organization') || params.get('company') || undefined,
    country: profile?.country || params.get('country') || undefined,
  };
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    values[key] = params.get(key) || undefined;
  }
  for (const [key, value] of Object.entries(values)) {
    if (value?.trim()) result.searchParams.set(key, value.trim());
  }
  return result.toString();
}

export function GhlSurveyEmbed({ compact = false }: { compact?: boolean }) {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [surveyUrl, setSurveyUrl] = useState(GHL_DEMO_SURVEY_URL);

  useEffect(() => {
    if (!hydrated) return;
    setSurveyUrl(withPrefill(GHL_DEMO_SURVEY_URL, new URL(window.location.href), user ?? undefined));
  }, [hydrated, user]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <iframe
        src={surveyUrl}
        title="Book a ProcureChain demo"
        className={`block w-full border-0 ${compact ? 'min-h-[640px]' : 'min-h-[780px]'}`}
        loading="eager"
        allow="forms"
      />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
      <div className="border-t border-border bg-canvas-raised px-4 py-3 text-center">
        <a href={surveyUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-accent hover:text-accent-hover">
          Open the booking form in a new tab
        </a>
      </div>
    </div>
  );
}
