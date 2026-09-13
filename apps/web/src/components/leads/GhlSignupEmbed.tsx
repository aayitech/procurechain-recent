'use client';

import Script from 'next/script';

export const GHL_SIGNUP_FORM_URL =
  'https://api.leadconnectorhq.com/widget/form/ybU2HMSfvRz6oZhrh79h';

export function GhlSignupEmbed() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <iframe
        src={GHL_SIGNUP_FORM_URL}
        title="Create your ProcureChain account"
        className="block min-h-[760px] w-full border-0 sm:min-h-[820px]"
        loading="eager"
        allow="forms"
      />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </div>
  );
}
