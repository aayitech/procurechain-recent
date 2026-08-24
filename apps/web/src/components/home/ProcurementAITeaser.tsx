'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const PROMPTS = [
  'How are steel prices trending?',
  'Which procurement categories are under pressure?',
  'What is driving packaging costs?',
  'Analyse commodity risks',
  'Explain inflation impact',
  'Compare market conditions',
];

export function ProcurementAITeaser() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((i) => (i + 1) % PROMPTS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim() || PROMPTS[promptIndex];
    router.push(`/assistant?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <section className="border-y border-border-subtle bg-canvas-overlay py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Sparkles size={20} />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-ink">Procurement AI</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Ask questions about procurement markets, commodities, categories and supply-chain
            trends.
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="rounded-xl border border-border bg-canvas px-4 py-3 text-left">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about procurement, markets, commodities or suppliers…"
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="mt-4 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Ask the AI Assistant
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => router.push(`/assistant?q=${encodeURIComponent(prompt)}`)}
                className="rounded-full border border-border-subtle px-3 py-1 text-xs text-ink-muted transition-colors hover:border-accent hover:text-ink"
              >
                {prompt}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-ink-faint">
            Grounded in the market data tracked on this site — not access to your private
            procurement data.
          </p>
        </div>
      </div>
    </section>
  );
}
