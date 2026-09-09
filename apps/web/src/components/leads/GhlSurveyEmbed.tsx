'use client';

import Script from 'next/script';

export const GHL_DEMO_SURVEY_URL =
  'https://api.leadconnectorhq.com/widget/survey/HSfuWm21CrWzWZ60UgST';

export function GhlSurveyEmbed({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <iframe
        src={GHL_DEMO_SURVEY_URL}
        title="Book a ProcureChain demo"
        className={`block w-full border-0 ${compact ? 'min-h-[640px]' : 'min-h-[780px]'}`}
        loading="lazy"
        allow="forms"
      />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </div>
  );
}
