import HeroCanvas from "@/components/effects/HeroCanvas";
import { profile } from "@/content/site";

export default function Hero() {
  const nameLetters = profile.name.toUpperCase().split("");

  return (
    <section id="top" data-pause-offscreen className="relative flex min-h-svh items-end overflow-hidden md:items-center">
      <div className="horizon-glow" aria-hidden="true" />
      <HeroCanvas />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      <div data-hero className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-28 sm:px-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink/50 px-3 py-1.5 text-xs text-muted backdrop-blur">
          <span className="size-1.5 animate-pulse rounded-full bg-teal" />
          {profile.status} · {profile.location}
        </p>
        <h1 className="mt-6 font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.9] tracking-tighter">
          <span className="sr-only">{profile.name}</span>
          <span data-split aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            {nameLetters.map((ch, i) => (
              <span key={i} className="inline-block whitespace-pre">{ch}</span>
            ))}
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
          <span className="text-fg">{profile.role}.</span> {profile.tagline}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#work" className="btn btn-primary">View work</a>
          <a href="#contact" className="btn btn-ghost">Get in touch</a>
        </div>
        <div className="mt-8 flex gap-5 text-sm text-muted">
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-fg">GitHub ↗</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-fg">LinkedIn ↗</a>
        </div>
      </div>
      <a href="#about" className="cue absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-muted" aria-label="Scroll to about">
        SCROLL ↓
      </a>
    </section>
  );
}
