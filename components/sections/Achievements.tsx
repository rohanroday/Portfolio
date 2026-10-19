import SectionHead from "@/components/ui/SectionHead";
import { achievements } from "@/content/site";

export default function Achievements() {
  return (
    <section id="achievements" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHead eyebrow="Recognition" title="Achievements & certifications." />
      <div data-anim-stagger className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="glow relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface-2 to-surface p-8 sm:p-10">
          <div className="absolute -right-16 -top-16 size-56 rounded-full bg-violet/20 blur-3xl" />
          <p className="eyebrow">{achievements.highlight.year}</p>
          <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{achievements.highlight.title}</h3>
          <p className="mt-4 max-w-md text-muted">{achievements.highlight.text}</p>
        </div>
        <ul className="glow space-y-4 rounded-3xl border border-line bg-surface p-8">
          {achievements.certifications.map((c) => (
            <li key={c} className="flex gap-3 text-muted"><span className="text-teal">✓</span>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
