import SectionHead from "@/components/ui/SectionHead";
import ProjectVisual from "@/components/ui/ProjectVisual";
import { featured } from "@/content/site";

export default function FeaturedWork() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-32">
      <SectionHead eyebrow="Featured work" title={<>Products I&apos;ve <span className="text-gradient">shipped</span>.</>}>
        Full-stack apps with real payments, real-time updates and the tests to back them.
      </SectionHead>
      <div className="space-y-8 sm:space-y-10 lg:space-y-16">
        {featured.map((p, i) => (
          <article key={p.name} data-anim className="glow grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-2">
            <div className={`border-line max-lg:border-b ${i % 2 ? "lg:order-2 lg:border-l" : "lg:border-r"}`}>
              <ProjectVisual p={p} />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="text-sm text-muted">
                <span className="font-display text-teal">0{i + 1}</span> · {p.kind}
              </p>
              <h3 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{p.name}</h3>
              <p className="mt-4 text-muted">{p.summary}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3"><span className="text-teal">→</span>{pt}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">Live demo ↗</a>}
                {p.repo && <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">View code</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
