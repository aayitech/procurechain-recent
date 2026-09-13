'use client';

import Script from 'next/script';

export const GHL_SIGNUP_FORM_URL =
  'https://api.leadconnectorhq.com/widget/form/ybU2HMSfvRz6oZhrh79h';

export function GhlSignupEmbed({
  email,
  title = 'Complete your ProcureChain profile',
}: {
  email?: string;
  title?: string;
}) {
  const formUrl = email ? `${GHL_SIGNUP_FORM_URL}?email=${encodeURIComponent(email)}` : GHL_SIGNUP_FORM_URL;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <iframe
        src={formUrl}
        title={title}
        className="block min-h-[760px] w-full border-0 sm:min-h-[820px]"
        loading="eager"
        allow="forms"
      />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </div>
  );
}
