import Link from "next/link";
import Ticket from "@/components/Ticket";
import SoundToggle from "@/components/SoundToggle";
import StreetScroll from "@/components/StreetScroll";
import { boxOffice, nav, site, tickets } from "@/content";

// "/" The box office: fly up the street to the picture house, then pick a ticket at the window.
export default function BoxOffice() {
  return (
    <div className="relative bg-night">
      <header className="fixed inset-x-0 top-0 z-30 flex flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-[5%] sm:py-6">
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

      <main id="main">
        <StreetScroll>
          <div className="flex min-h-full flex-col items-center justify-center gap-10 px-4 pb-16 pt-36 text-center sm:gap-12 sm:px-[5%]">
            <div className="flex flex-col items-center gap-3">
              <p className="m-0 text-xs tracking-[0.32em] text-lavender">{boxOffice.window}</p>
              <h2 className="font-serif m-0 text-[clamp(40px,6vw,76px)] font-normal leading-none">
                Two shows tonight. <em className="italic text-blush">Pick one ticket.</em>
              </h2>
            </div>
            <div className="flex w-full max-w-[1120px] flex-col items-center gap-8 sm:flex-row sm:flex-wrap sm:justify-center">
              {tickets.map((t) => (
                <Ticket key={t.href} t={t} />
              ))}
            </div>
          </div>
        </StreetScroll>
      </main>
    </div>
  );
}
