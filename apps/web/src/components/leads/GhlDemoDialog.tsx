'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { GhlSurveyEmbed } from './GhlSurveyEmbed';

export function GhlDemoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="demo-dialog-title" className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/85 p-3 backdrop-blur-sm sm:p-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-4">
          <div><h2 id="demo-dialog-title" className="font-semibold text-white">Book a ProcureChain demo</h2><p className="mt-0.5 text-xs text-slate-400">Your details are captured directly in GoHighLevel for follow-up.</p></div>
          <button type="button" onClick={onClose} aria-label="Close demo booking form" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-3 sm:p-5"><GhlSurveyEmbed compact /></div>
      </div>
    </div>
  );
}
