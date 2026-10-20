import SectionHead from "@/components/ui/SectionHead";
import { experience } from "@/content/site";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
      <SectionHead eyebrow="Experience" title="Where I've worked and studied." />
      <div className="relative pl-8 sm:pl-12">
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-line sm:left-[11px]" />
        <div data-timeline className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-teal to-violet sm:left-[11px]" />
        <ol className="space-y-12">
          {experience.map((e) => (
            <li key={e.org} data-anim className="relative">
              <span className="absolute -left-8 top-1.5 size-4 rounded-full border-2 border-teal bg-ink sm:-left-12 sm:size-6" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-2xl font-semibold">{e.role}</h3>
                <p className="text-sm text-muted">{e.period}</p>
              </div>
              <p className="mt-1 text-teal">{e.org} <span className="text-muted">· {e.place}</span></p>
              <ul className="mt-4 space-y-2 text-muted">
                {e.points.map((pt) => (
                  <li key={pt} className="flex gap-3"><span className="mt-2.5 size-1 shrink-0 rounded-full bg-muted" />{pt}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
