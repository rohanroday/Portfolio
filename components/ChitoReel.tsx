"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Reel } from "@/content";

// A phone that plays Chito's screen recordings back to back, like reels of a trailer.
// Tabs jump to a reel. Videos only load and play while the poster is on screen;
// reduced-motion visitors see the still cover of each reel and switch with the tabs.
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function ChitoReel({ reels }: { reels: Reel[] }) {
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || reduced) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, index, reduced]);

  const reel = reels[index];
  return (
    <div ref={wrap} className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-5">
      <div className="w-[min(46vw,190px)] flex-none rounded-[26px] border-2 border-night bg-night p-1.5 shadow-[0_18px_40px_rgba(23,22,58,0.35)]">
        <div className="relative aspect-[480/1038] overflow-hidden rounded-[20px] bg-night">
          {reduced ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={reel.poster} alt={reel.alt} className="h-full w-full object-cover" />
          ) : (
            <video
              key={reel.src}
              ref={video}
              src={inView ? reel.src : undefined}
              poster={reel.poster}
              muted
              playsInline
              preload="none"
              onEnded={() => setIndex((i) => (i + 1) % reels.length)}
              aria-label={reel.alt}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="flex w-full flex-row flex-wrap justify-center gap-2 sm:w-auto sm:flex-col sm:justify-start" role="group" aria-label="Chito reels">
        {reels.map((r, i) => (
          <button
            key={r.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-left text-xs tracking-[0.14em] transition-colors ${
              i === index ? "border-night bg-night text-marigold" : "border-night/40 text-night hover:border-night"
            }`}
          >
            <span className="font-semibold">{String(i + 1).padStart(2, "0")}</span>
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
