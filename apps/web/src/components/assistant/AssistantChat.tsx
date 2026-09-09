'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, CalendarDays, MessageSquare, Plus, Send, Sparkles, Trash2, User } from 'lucide-react';
import { useAskAssistant } from '@/hooks/useAssistant';
import { useTrackEngagement } from '@/hooks/useEngagement';
import { useAuthStore } from '@/store/auth-store';
import { GhlDemoDialog } from '@/components/leads/GhlDemoDialog';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
  dataAsOf?: string | null;
}

const EXAMPLE_PROMPTS = [
  'How has WTI crude oil moved recently?',
  'What is the current USD/ZAR exchange rate?',
  'Which tracked commodities have risen the most this week?',
  'What could rising energy costs mean for procurement?',
];

const TOPICS = ['Packaging costs', 'Diesel outlook', 'Freight exposure', 'USD/ZAR impact', 'Metals watch'];

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function AssistantChat({ initialQuestion, currentContext = {} }: { initialQuestion?: string; currentContext?: Record<string, unknown> }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const { mutate, isPending } = useAskAssistant();
  const bottomRef = useRef<HTMLDivElement>(null);
  const askedInitial = useRef(false);
  const track = useTrackEngagement();
  const startedConversation = useRef(false);
  const user = useAuthStore((state) => state.user);
  const [conversationId, setConversationId] = useState<string>();
  const [demoOpen, setDemoOpen] = useState(false);

  function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isPending) return;

    if (!startedConversation.current) {
      startedConversation.current = true;
      track('ai_conversation_started');
    }

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');

    mutate(
      { question: trimmed, conversationId, currentContext, profile: user ? { name: user.firstName, country: user.country, currency: user.marketProfile?.currency, industry: user.industry, role: user.jobTitle, company: user.company, procurementCategories: user.marketProfile?.procurementCategories, marketInterests: user.marketProfile?.commodities, sourcingCountries: user.marketProfile?.sourcingCountries, tradeLanes: user.marketProfile?.tradeLanes } : undefined },
      {
        onSuccess: (data) => {
          setConversationId(data.conversationId);
          setMessages((prev) => [...prev, { role: 'assistant', content: data.answer, dataAsOf: data.dataAsOf }]);
        },
        onError: (error) => {
          const errorMessage = (error as Error).message ?? '';
          const message =
            /not configured|authentication failed|cloudflare workers ai/i.test(errorMessage)
              ? "The AI Assistant isn't available on this backend right now. Please ask an administrator to check the AI service configuration."
              : "Couldn't reach the AI Assistant backend right now. This needs the API server running — it isn't in this preview environment.";
          setMessages((prev) => [...prev, { role: 'assistant', content: message, isError: true }]);
        },
      },
    );
  }

  useEffect(() => {
    if (initialQuestion && !askedInitial.current) {
      askedInitial.current = true;
      send(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 lg:grid-cols-[230px_minmax(0,1fr)]">
      <aside className="hidden border-r border-slate-800 bg-slate-950/90 p-3 lg:flex lg:flex-col">
        <button type="button" onClick={() => { setMessages([]); setConversationId(undefined); startedConversation.current = false; }} className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold hover:bg-blue-500"><Plus className="h-4 w-4" /> New conversation</button>
        <p className="mb-2 mt-6 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Explore topics</p>
        <nav className="space-y-1">{TOPICS.map((topic) => <button key={topic} type="button" onClick={() => send(`What should a procurement team know about ${topic.toLowerCase()}?`)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-400 hover:bg-slate-900 hover:text-slate-100"><MessageSquare className="h-3.5 w-3.5" />{topic}</button>)}</nav>
        <div className="mt-auto space-y-3"><button type="button" onClick={() => setDemoOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"><CalendarDays className="h-4 w-4" /> Book a demo</button><div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3"><p className="text-xs font-semibold">Grounded responses</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Answers use the market information available to ProcureChain and include the data timestamp when returned.</p></div></div>
      </aside>
      <section className="flex min-h-0 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-4 sm:px-6"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600"><Bot className="h-5 w-5" /></div><div><h1 className="font-semibold">Ask the Market</h1><p className="text-xs text-slate-500">AI procurement intelligence assistant</p></div></div><div className="flex items-center gap-2"><button type="button" onClick={() => setDemoOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"><CalendarDays className="h-3.5 w-3.5" /><span className="hidden sm:inline">Book a demo</span></button>{messages.length > 0 && <button type="button" onClick={() => setMessages([])} className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-white"><Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Clear</span></button>}</div></header>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 && (
          <div className="mx-auto flex h-full max-w-4xl flex-col justify-center">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400"><Sparkles size={18} /></div><div><p className="font-semibold">Good morning{user?.firstName ? `, ${user.firstName}` : ''}. What would you like to understand?</p><p className="mt-1 text-sm leading-6 text-slate-400">Ask about a tracked commodity, exchange rate, recent movement, freight availability, or procurement implication.</p>{(user?.country || user?.industry) && <p className="mt-2 text-xs text-blue-300">Context: {[user.country, user.industry, user.marketProfile?.currency].filter(Boolean).join(' · ')}</p>}</div></div>
            <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-wider text-slate-500">Try asking</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => send(prompt)}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left text-xs leading-5 text-slate-300 transition-colors hover:border-blue-500 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {messages.map((message, i) => (
            <div key={i} className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  message.role === 'user' ? 'bg-slate-800 text-slate-300' : 'bg-blue-600/20 text-blue-400'
                }`}
              >
                {message.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
              </div>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.isError
                      ? 'border border-rose-500/30 bg-rose-500/10 text-rose-300'
                      : 'border border-slate-800 bg-slate-900 text-slate-200'
                }`}
              >
                {message.role === 'assistant' && !message.isError ? <StructuredAnswer content={message.content} /> : message.content}
                {message.dataAsOf && (
                  <p className="mt-2 text-[10px] text-slate-500">Grounded in data as of {formatTime(message.dataAsOf)}</p>
                )}
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles size={13} className="animate-pulse text-blue-400" />
              Thinking…
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-800 bg-slate-950 p-4 sm:px-6"><form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about commodities, exchange rates, market trends..."
          className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending || !input.trim()}
          aria-label="Send question"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      <p className="mx-auto mt-2 max-w-4xl text-center text-[10px] text-slate-600">
        AI-generated — grounded in real tracked market data, but can be wrong. Not financial or
        procurement advice; verify before acting.
      </p></div>
      </section>
      <GhlDemoDialog open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}

function StructuredAnswer({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).filter(Boolean);
  return <div className="space-y-3">{blocks.map((block, index) => {
    const lines = block.split('\n').filter(Boolean);
    if (lines[0]?.startsWith('### ')) return <section key={index}><h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-300">{lines[0].slice(4)}</h3><p className="whitespace-pre-wrap">{lines.slice(1).join('\n')}</p></section>;
    if (lines.every((line) => /^[-*] /.test(line))) return <ul key={index} className="space-y-1 pl-4">{lines.map((line) => <li key={line} className="list-disc">{line.slice(2)}</li>)}</ul>;
    return <p key={index} className="whitespace-pre-wrap">{block}</p>;
  })}</div>;
}
