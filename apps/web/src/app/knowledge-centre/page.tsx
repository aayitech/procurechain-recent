import { RecommendedForYou } from '@/components/knowledge/RecommendedForYou';
import { LearningPathGrid } from '@/components/knowledge/LearningPathGrid';

export const metadata = {
  title: 'Procurement Knowledge Centre',
  description: 'Learn how to make better procurement decisions — structured learning paths with curated, verified resources.',
};

export default function KnowledgeCentrePage() {
  return (
    <div className="container-page py-16">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">Procurement Knowledge Centre</p>
        <h1 className="text-3xl font-semibold text-ink">Learn how to make better procurement decisions</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Structured &ldquo;how to&rdquo; learning paths, each pointing to real, individually verified resources —
          never summaries we invented and never dead links.
        </p>
      </div>

      <div className="mb-10">
        <RecommendedForYou />
      </div>

      <LearningPathGrid />
    </div>
  );
}
