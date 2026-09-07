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
  return <AssistantChat initialQuestion={searchParams.q} />;
}
