import { intermission } from "@/content";
import CinemaVideo from "./CinemaVideo";

// Full-width blush band. The giant word drifts by in a slow marquee; the line underneath stays put.
export default function Intermission() {
  const words = Array.from({ length: 4 }, (_, i) => i);
  return (
    <section aria-label="Intermission" className="overflow-hidden bg-blush py-12 text-night sm:py-14">
      <p aria-hidden="true" className="m-0 text-center text-xs tracking-[0.32em]">
        · · · · · · · · · ·
      </p>
      <h2 className="sr-only">{intermission.word}</h2>
      <div aria-hidden="true" className="mt-2.5 overflow-hidden">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {words.map((i) => (
                <span key={i} className="font-marquee whitespace-nowrap pr-[0.4em] text-[clamp(56px,9vw,128px)] font-extrabold leading-[0.9]">
                  {intermission.word} <span className="text-dusk">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="font-serif m-0 mt-3 px-4 text-center text-[22px] italic sm:text-[26px]">{intermission.line}</p>
      {/* The snack counter, in a film frame with sprocket holes */}
      <figure className="mx-auto mb-0 mt-8 w-[min(92%,880px)] rounded-lg bg-night p-2.5 shadow-[0_24px_60px_rgba(23,22,58,0.35)] sm:p-3.5">
        <div aria-hidden="true" className="sprockets mb-2 h-3" />
        <div className="aspect-video overflow-hidden rounded-[3px]">
          <CinemaVideo src="/cinema/interval.mp4" poster="/cinema/interval.jpg" loop />
        </div>
        <div aria-hidden="true" className="sprockets mt-2 h-3" />
        <figcaption className="sr-only">{intermission.counter}</figcaption>
      </figure>
    </section>
  );
}
