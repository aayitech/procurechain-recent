'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { trackGhlEvent } from '@/lib/ghl-tracking';

const CALENDAR_URL = process.env.NEXT_PUBLIC_GHL_CALENDAR_URL
  ?? 'https://api.leadconnectorhq.com/widget/bookings/kyle-boyd-personal-calendar-0a6tcvnie';

function calendarWithPrefill(base: string, params: URLSearchParams, profile?: { email?: string | null; firstName?: string | null; lastName?: string | null }) {
  const url = new URL(base);
  const email = profile?.email || params.get('email') || '';
  const name = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim() || params.get('full_name') || params.get('name') || '';
  if (email.trim()) url.searchParams.set('email', email.trim());
  if (name.trim()) url.searchParams.set('name', name.trim());
  return url.toString();
}

export default function DemoThankYouPage() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [params, setParams] = useState<URLSearchParams | null>(null);
  const [calendarUrl, setCalendarUrl] = useState(CALENDAR_URL);

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    if (!hydrated || !params) return;
    const email = params.get('email')?.trim() || '';
    const fullName = params.get('full_name') || params.get('name') || '';
    const [firstName, ...lastParts] = fullName.trim().split(/\s+/).filter(Boolean);
    setCalendarUrl(calendarWithPrefill(CALENDAR_URL, params, user ?? undefined));
    if (user || email) {
      trackGhlEvent({
        event: 'demo_requested',
        ...(email ? { email } : {}),
        ...(firstName ? { firstName } : {}),
        ...(lastParts.length ? { lastName: lastParts.join(' ') } : {}),
        profile: {
          ...(params.get('phone')?.trim() ? { phone: params.get('phone')!.trim() } : {}),
          ...((params.get('organization') || params.get('company'))?.trim() ? { company: (params.get('organization') || params.get('company'))!.trim() } : {}),
          ...(params.get('country')?.trim() ? { country: params.get('country')!.trim() } : {}),
        },
        campaignEntryAsset: 'Book a Demo form',
      });
    }
  }, [hydrated, params, user]);

  return (
    <main className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-semibold text-ink">Thanks – pick a time for your demo below</h1>
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <iframe src={calendarUrl} title="Choose a time for your ProcureChain demo" className="block min-h-[780px] w-full border-0" loading="eager" allow="forms" />
          <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
        </div>
      </div>
    </main>
  );
}
