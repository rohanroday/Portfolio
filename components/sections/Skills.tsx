import SectionHead from "@/components/ui/SectionHead";
import { skills } from "@/content/site";

export default function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHead eyebrow="Toolkit" title="What I build with." />
      </div>
      <div data-pause-offscreen className="marquee mb-14 overflow-hidden" aria-hidden="true">
        <div className="marquee-track gap-4">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-4 pr-4">
              {skills.flatMap((g) => g.items).map((s) => (
                <span key={s} className="whitespace-nowrap font-display text-3xl font-semibold text-line-strong sm:text-5xl">
                  {s} <span className="text-teal/60">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div data-anim-stagger className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {skills.map((g) => (
          <div key={g.group} className="glow rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-display text-lg font-semibold">{g.group}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
