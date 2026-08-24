const INSIGHTS = [
  {
    title: 'How to build a resilient supplier base in volatile commodity markets',
    category: 'Category Strategy',
    readTime: '6 min read',
  },
  {
    title: 'Fixed-price vs. index-linked contracts: a decision framework',
    category: 'Contracts',
    readTime: '5 min read',
  },
  {
    title: 'Reading currency risk into your landed cost model',
    category: 'Cost Management',
    readTime: '7 min read',
  },
];

export function FeaturedInsights() {
  return (
    <section className="container-page py-16">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink">Featured Insights</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Editorial analysis from the ProcureChain research desk.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {INSIGHTS.map((insight) => (
          <article key={insight.title} className="card flex flex-col justify-between p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {insight.category}
              </p>
              <h3 className="mt-2 text-base font-semibold leading-snug text-ink">
                {insight.title}
              </h3>
            </div>
            <p className="mt-4 text-xs text-ink-faint">{insight.readTime}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs text-ink-faint">
        The full Knowledge Centre — searchable articles, guides, and templates — is coming in a
        later module.
      </p>
    </section>
  );
}
