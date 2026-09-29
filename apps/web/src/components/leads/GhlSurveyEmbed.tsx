'use client';

import Script from 'next/script';

export const GHL_DEMO_SURVEY_URL =
  process.env.NEXT_PUBLIC_GHL_DEMO_SURVEY_URL ??
  'https://api.leadconnectorhq.com/widget/survey/HSfuWm21CrWzWZ60UgST';

export function GhlSurveyEmbed({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <iframe
        src={GHL_DEMO_SURVEY_URL}
        title="Book a ProcureChain demo"
        className={`block w-full border-0 ${compact ? 'min-h-[640px]' : 'min-h-[780px]'}`}
        loading="eager"
        allow="forms"
      />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
      <div className="border-t border-border bg-canvas-raised px-4 py-3 text-center">
        <a
          href={GHL_DEMO_SURVEY_URL}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-accent hover:text-accent-hover"
        >
          Open the booking form in a new tab
        </a>
      </div>
    </div>
  );
}
