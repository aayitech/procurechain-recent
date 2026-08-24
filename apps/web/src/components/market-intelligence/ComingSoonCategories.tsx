const CATEGORIES = ['Mining', 'Technology', 'Office Supplies', 'MRO', 'Inflation & PMI'];

export function ComingSoonCategories() {
  return (
    <div>
      <p className="mb-3 text-xs text-ink-faint">
        These categories need a paid data feed we haven&apos;t connected yet — shown here so you
        know they&apos;re planned, not to imply live numbers exist.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((category) => (
          <div
            key={category}
            className="card flex items-center justify-between p-4 text-sm text-ink-faint opacity-60"
          >
            {category}
            <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] uppercase tracking-wide">
              Coming soon
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
