export function ComingSoonPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="card p-8 text-center">
      <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">
        Coming soon
      </span>
      <h3 className="mt-3 text-sm font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs text-ink-faint">{description}</p>
    </div>
  );
}
