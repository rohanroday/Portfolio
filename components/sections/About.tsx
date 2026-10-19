import SectionHead from "@/components/ui/SectionHead";
import { profile, stats } from "@/content/site";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <div>
          <SectionHead eyebrow="About" title={<>Full stack, <span className="text-gradient">end to end</span>.</>} />
          <div data-anim className="space-y-5 text-lg leading-relaxed text-muted">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div data-anim-stagger className="grid content-center gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glow rounded-2xl border border-line bg-surface p-6">
              <p className="font-display text-5xl font-semibold tracking-tight">
                <span data-count={s.value} data-decimals={s.decimals ?? 0}>{s.value}</span>
                <span className="text-teal">{s.suffix}</span>
              </p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
