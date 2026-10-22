import Link from "next/link";
import MountainLayers from "@/components/MountainLayers";
import PrayerFlags from "@/components/PrayerFlags";
import Stars from "@/components/Stars";
import Ticket from "@/components/Ticket";
import SoundToggle from "@/components/SoundToggle";
import BoxOfficeIntro from "@/components/BoxOfficeIntro";
import { boxOffice, nav, site, tickets } from "@/content";

// "/" The box office: the hero, with two tickets to pick from.
export default function BoxOffice() {
  return (
    <div id="box-office" className="relative flex min-h-svh flex-col overflow-hidden bg-night">
      <Stars />
      <MountainLayers />
      {/* Darkens as you scroll away (driven by the intro component's scroll timeline) */}
      <div data-dim aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-[#08071a] opacity-0" />

      <header data-intro="header" className="relative z-[3] flex flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-[5%] sm:py-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-sm font-semibold tracking-[0.04em]">{site.name.toUpperCase()}</span>
          <span className="flex items-center gap-2 text-xs text-blush">
            <span className="inline-block size-2 rounded-full bg-marigold" aria-hidden="true" />
            {site.status}
          </span>
        </div>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[13px]">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="no-underline hover:text-blush">
              {n.label}
            </Link>
          ))}
          <SoundToggle />
        </nav>
      </header>

      <PrayerFlags className="top-[92px] z-[2] h-[140px] opacity-85 sm:top-[70px] sm:h-[200px]" />

      <main id="main" className="relative z-[3] flex flex-1 flex-col items-center gap-10 px-4 pb-16 pt-[250px] text-center sm:gap-12 sm:px-[5%] sm:pb-[72px] sm:pt-[200px]">
        <div className="flex flex-col items-center gap-3.5">
          <p data-intro="presents" className="m-0 text-[11px] tracking-[0.18em] text-lavender sm:text-xs sm:tracking-[0.32em]">
            {boxOffice.presents}
          </p>
          <h1 data-intro="name" className="font-marquee m-0 text-[clamp(64px,15vw,176px)] font-extrabold leading-[0.86] tracking-[0.01em]">
            <span className="sr-only">{boxOffice.name}</span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.04em]">
              {boxOffice.name.split("").map((ch, i) => (
                <span key={i} data-letter className="inline-block whitespace-pre">
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <p data-intro="tagline" className="font-serif m-0 text-[clamp(24px,3vw,36px)] italic text-blush">
            {boxOffice.tagline}
          </p>
          <p data-intro="meta" className="m-0 text-xs tracking-[0.12em] text-lilac sm:text-[13px]">
            {boxOffice.meta}
          </p>
        </div>

        <p data-intro="pick" className="m-0 text-xs tracking-[0.08em] text-marigold sm:text-[13px]">
          {boxOffice.pick}
        </p>

        <div className="flex w-full max-w-[1120px] flex-col items-center gap-8 sm:flex-row sm:flex-wrap sm:justify-center">
          {tickets.map((t) => (
            <Ticket key={t.href} t={t} />
          ))}
        </div>

        <Link
          href="/stack"
          data-intro="scroll"
          className="flex min-h-11 items-center gap-2.5 text-xs tracking-[0.2em] text-lilac no-underline hover:text-blush"
        >
          {boxOffice.scroll}
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </Link>
      </main>

      <BoxOfficeIntro />
    </div>
  );
}
