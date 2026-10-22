import { intermission } from "@/content";

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
    </section>
  );
}
