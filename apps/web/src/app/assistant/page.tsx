import { AssistantChat } from '@/components/assistant/AssistantChat';

export const metadata = {
  title: 'Ask Nader',
  description: 'Ask procurement questions and explore answers grounded in available market data.',
};

export default function AssistantPage({
  searchParams,
}: {
  searchParams: { q?: string; instrument?: string; category?: string; country?: string };
}) {
  return <AssistantChat initialQuestion={searchParams.q} currentContext={{ page: 'Ask the Market', instrument: searchParams.instrument, category: searchParams.category, country: searchParams.country }} />;
}
