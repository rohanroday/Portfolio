import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SubpageHeader from "@/components/SubpageHeader";
import PosterCard from "@/components/PosterCard";
import StackMotion from "@/components/StackMotion";
import Txt from "@/components/Txt";
import { builds, site } from "@/content";

export const metadata: Metadata = {
  title: "The Builds, the programme",
  description: "Now showing: Chito, a grocery quick-commerce app for Singtam, Sikkim, built with React Native, Next.js, Node.js, MongoDB and Razorpay.",
};

// "/builds" Ticket 2: the programme. One feature presentation, then trailers.
export default function BuildsPage() {
  const f = builds.feature;
  return (
    <div className="min-h-svh bg-night">
      <SubpageHeader label={builds.ticketLabel} tone="marigold" />
      <main id="main">
        <section className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-6 px-4 pb-12 pt-20 sm:px-[5%] sm:pb-14 sm:pt-24">
          <div className="flex flex-col gap-3.5">
            <p className="m-0 text-xs tracking-[0.32em] text-lavender">{builds.kicker}</p>
            <h1 className="font-marquee m-0 text-[clamp(64px,11vw,160px)] font-extrabold leading-[0.85]">{builds.title}</h1>
          </div>
          <p className="font-serif m-0 max-w-[360px] text-2xl italic leading-[1.3] text-blush">{builds.tagline}</p>
        </section>

        {/* Feature presentation */}
        <section data-act className="mx-auto max-w-[1240px] px-4 pb-20 sm:px-[5%] sm:pb-[88px]">
          <article aria-labelledby="feature-title" className="flex flex-wrap overflow-hidden rounded-[14px] bg-surface">
            <div data-reveal className="relative flex min-h-[520px] flex-[1_1_380px] flex-col justify-between gap-6 bg-marigold p-7 text-night sm:p-10">
              <div className="flex justify-between text-[11px] tracking-[0.2em]">
                {f.top.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-serif text-[26px] italic">{f.sub}</span>
                <h2 id="feature-title" className="font-marquee m-0 text-[clamp(96px,12vw,168px)] font-extrabold leading-[0.82]">
                  {f.title}
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {f.screenshots.map((s, i) =>
                  s ? (
                    <div key={i} className="overflow-hidden rounded-xl border-2 border-night bg-night">
                      <Image src={s.src} alt={s.alt} width={780} height={1688} sizes="(min-width: 1024px) 140px, 30vw" className="aspect-[9/17] h-auto w-full object-cover object-top" />
                    </div>
                  ) : (
                    <div key={i} className="flex aspect-[9/17] items-center justify-center rounded-xl border-2 border-dashed border-night/50 p-2 text-center text-[10px] tracking-[0.12em]">
                      [APP SCREENSHOT {i + 1}]
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-[22px] p-7 sm:p-11">
              <p data-reveal className="font-serif m-0 text-[clamp(26px,3vw,34px)] leading-[1.15]">{f.logline}</p>
              <dl data-reveal className="m-0 grid grid-cols-1 gap-x-6 gap-y-5 text-[13px] leading-[1.6] sm:grid-cols-2">
                {f.credits.map((c) => (
                  <div key={c.term}>
                    <dt className="text-[11px] tracking-[0.18em] text-lavender">{c.term}</dt>
                    <dd className="m-0 mt-1">{c.detail}</dd>
                  </div>
                ))}
              </dl>
              <p data-reveal className="m-0 text-[13px] leading-[1.7] text-lilac">
                <Txt>{f.note}</Txt>
              </p>
              <div data-reveal className="mt-auto flex flex-wrap gap-3">
                {f.buttons.map((b, i) =>
                  b.href ? (
                    <a key={b.label} href={b.href} target="_blank" rel="noreferrer" className={`pill ${i === 0 ? "pill-marigold" : "pill-ghost"}`}>
                      {b.label}
                    </a>
                  ) : (
                    <span key={b.label} className={`pill ${i === 0 ? "pill-marigold" : "pill-ghost"} cursor-not-allowed opacity-70`} title="Coming soon">
                      {b.label} <mark className="ph text-[11px]">[LINK]</mark>
                    </span>
                  ),
                )}
              </div>
            </div>
          </article>
        </section>

        {/* Coming soon */}
        <section data-act className="mx-auto flex max-w-[1240px] flex-col gap-7 px-4 pb-16 sm:px-[5%] sm:pb-[72px]">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line pt-7">
            <h2 className="font-marquee m-0 text-[56px] font-extrabold leading-[0.9]">{builds.comingSoon.title}</h2>
            <span className="text-xs tracking-[0.2em] text-lavender">{builds.comingSoon.aside}</span>
          </div>
          <div className="flex flex-wrap gap-6">
            {builds.comingSoon.posters.map((p) => (
              <PosterCard key={p.kicker} {...p} />
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-4 px-4 pb-24 pt-6 text-[13px] text-lavender sm:px-[5%]">
        <a href={site.links.archive} target="_blank" rel="noreferrer" className="flex min-h-11 items-center no-underline hover:text-blush">
          {builds.footer.archive}
        </a>
        <Link href="/stack" className="flex min-h-11 items-center no-underline hover:text-blush">
          {builds.footer.swap}
        </Link>
      </footer>
      <StackMotion />
    </div>
  );
}
