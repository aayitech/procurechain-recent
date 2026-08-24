import { AssistantChat } from '@/components/assistant/AssistantChat';

export const metadata = {
  title: 'AI Procurement Assistant',
  description: 'Ask procurement questions and get answers grounded in live market data.',
};

export default function AssistantPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <div className="container-page py-16">
      <div className="mb-6 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">AI Procurement Assistant</p>
        <h1 className="text-3xl font-semibold text-ink">Ask anything about the market</h1>
      </div>
      <AssistantChat initialQuestion={searchParams.q} />
    </div>
  );
}
