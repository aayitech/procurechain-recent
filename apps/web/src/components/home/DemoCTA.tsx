import { GhlSurveyEmbed } from '@/components/leads/GhlSurveyEmbed';

export function DemoCTA() {
  return (
    <section id="book-demo" className="container-page py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-semibold text-ink">Book a demo</h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">Choose a time directly. Your details are captured in GoHighLevel for the ProcureChain team to qualify and follow up.</p>
        </div>
        <GhlSurveyEmbed />
      </div>
    </section>
  );
}
