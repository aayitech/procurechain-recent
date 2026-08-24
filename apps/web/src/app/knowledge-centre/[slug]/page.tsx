import { LearningPathDetailView } from '@/components/knowledge/LearningPathDetailView';

export default function LearningPathPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container-page py-16">
      <LearningPathDetailView slug={params.slug} />
    </div>
  );
}
