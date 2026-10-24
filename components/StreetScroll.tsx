"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BOARD_FROM, BOARD_TO, PHONE_SLICE, STREET_FRAMES, boardAt } from "@/lib/street";
import { boxOffice, site } from "@/content";

gsap.registerPlugin(ScrollTrigger);

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// Share of the scroll track spent flying down the street; the rest reveals the tickets.
const FLY = 0.86;
const frameUrl = (set: "d" | "m", n: number) => `/cinema/street/${set}/${String(n).padStart(3, "0")}.webp`;

/**
 * The box office approach: scrolling flies you up the misty street, past the marquee with your
 * name lit on it, through the doors to the ticket window, where `children` (the tickets) appear.
 * Frames are drawn to a canvas from an image sequence (smoother than seeking a video). Phones
 * get a portrait sequence; reduced-motion visitors get two still scenes instead.
 */
export default function StreetScroll({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const marquee = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const set: "d" | "m" = window.innerWidth / window.innerHeight < 0.85 ? "m" : "d";
    const images: (HTMLImageElement | null)[] = Array(STREET_FRAMES + 1).fill(null);
    let current = 1;
    let disposed = false;

    // Load coarse frames first (every 8th) so the whole journey is scrubbable quickly, then fill in
    const order: number[] = [];
    for (const step of [8, 4, 2, 1]) for (let n = 1; n <= STREET_FRAMES; n += step) if (!order.includes(n)) order.push(n);
    let next = 0;
    const loadMore = () => {
      if (disposed || next >= order.length) return;
      const n = order[next++];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        images[n] = img;
        if (Math.abs(n - current) < 8) draw();
        loadMore();
      };
      img.onerror = loadMore;
      img.src = frameUrl(set, n);
    };
    for (let i = 0; i < 6; i++) loadMore();

    const nearest = (n: number) => {
      for (let d = 0; d < STREET_FRAMES; d++) {
        if (images[n - d]) return images[n - d];
        if (images[n + d]) return images[n + d];
      }
      return null;
    };

    // Cover-fit maths, shared by the canvas and the marquee overlay
    let scale = 1, ox = 0, oy = 0, fw = 1, fh = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
      fw = set === "d" ? 1280 : 540;
      fh = set === "d" ? 720 : 960;
      scale = Math.max(cv.clientWidth / fw, cv.clientHeight / fh);
      ox = (cv.clientWidth - fw * scale) / 2;
      oy = (cv.clientHeight - fh * scale) / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    function draw() {
      const img = nearest(current);
      if (img) ctx.drawImage(img, ox, oy, fw * scale, fh * scale);
      // The name on the marquee follows the board
      const m = marquee.current;
      if (!m) return;
      if (current < BOARD_FROM || current > BOARD_TO) {
        m.style.opacity = "0";
        return;
      }
      let [x1, y1, x2, y2] = boardAt(current);
      if (set === "m") {
        const k = 540 / PHONE_SLICE.w;
        x1 = (x1 - PHONE_SLICE.x) * k; x2 = (x2 - PHONE_SLICE.x) * k;
        y1 *= 960 / 720; y2 *= 960 / 720;
      }
      const fade = Math.min(1, (current - BOARD_FROM) / 10, (BOARD_TO - current) / 8);
      m.style.opacity = String(Math.max(0, fade));
      // Keep the sign on screen (on phones the board grows wider than the view) and fit the name to it
      const vw = cv.clientWidth;
      const left = Math.max(12, ox + x1 * scale);
      const right = Math.min(vw - 12, ox + x2 * scale);
      const h = (y2 - y1) * scale;
      m.style.left = `${left}px`;
      m.style.top = `${oy + y1 * scale}px`;
      m.style.width = `${right - left}px`;
      m.style.height = `${h}px`;
      m.style.fontSize = `${Math.min(h * 0.42, (right - left) / 6.6)}px`;
    }

    resize();
    window.addEventListener("resize", resize);

    const st = ScrollTrigger.create({
      trigger: track.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const f = Math.min(1, self.progress / FLY);
        const n = Math.max(1, Math.min(STREET_FRAMES, Math.round(1 + f * (STREET_FRAMES - 1))));
        if (n !== current) {
          current = n;
          draw();
        }
      },
    });

    // Story beats along the scroll
    const scrub = { trigger: track.current, start: "top top", end: "bottom bottom", scrub: 0.4 };
    const tl = gsap.timeline({ scrollTrigger: scrub, defaults: { ease: "none" } });
    tl.to("[data-street='title']", { opacity: 0, y: -60, duration: 0.07 }, 0.04)
      .to("[data-street='cue']", { opacity: 0, duration: 0.03 }, 0.02)
      .fromTo("[data-street='place']", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.04 }, 0.12)
      .to("[data-street='place']", { opacity: 0, duration: 0.04 }, 0.27)
      .fromTo("[data-street='open']", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.04 }, 0.62)
      .to("[data-street='open']", { opacity: 0, duration: 0.04 }, 0.78)
      .fromTo("[data-street='dim']", { opacity: 0 }, { opacity: 0.62, duration: 0.06 }, FLY)
      .fromTo("[data-street='tickets']", { opacity: 0, y: 60, pointerEvents: "none" }, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.08 }, FLY + 0.02)
      .set({}, {}, 1);

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      st.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reduced]);

  if (reduced) {
    // Two still scenes: the marquee, then the ticket window
    return (
      <>
        <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-cover bg-center px-4 text-center" style={{ backgroundImage: "url(/cinema/facade.jpg)" }}>
          <div className="absolute inset-0 bg-night/60" aria-hidden="true" />
          <Title />
        </section>
        <section className="relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url(/cinema/ticket-window.jpg)" }}>
          <div className="absolute inset-0 bg-night/70" aria-hidden="true" />
          <div className="relative">{children}</div>
        </section>
      </>
    );
  }

  return (
    <div ref={track} className="relative h-[620svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        {/* Soft vignette and a darker top edge so the header stays readable */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(10,9,30,0.65))]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-night/80 to-transparent" />

        {/* The name, lit on the real marquee board */}
        <div
          ref={marquee}
          aria-hidden="true"
          className="font-marquee pointer-events-none absolute flex flex-col items-center justify-center text-center leading-[0.92] text-[#2b1d10] opacity-0 [text-shadow:0_0_0.08em_rgba(255,240,210,0.6)]"
        >
          <span className="whitespace-nowrap font-extrabold tracking-[0.04em]">{boxOffice.name}</span>
          <span className="whitespace-nowrap text-[0.36em] font-extrabold tracking-[0.3em]">TWO SHOWS TONIGHT</span>
        </div>

        <div data-street="title" className="absolute inset-0 flex items-center justify-center px-4 pt-10 text-center">
          <Title />
        </div>

        <p data-street="cue" className="absolute inset-x-0 bottom-8 m-0 flex items-center justify-center gap-2.5 text-xs tracking-[0.2em] text-lilac">
          {boxOffice.scroll}
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </p>

        <p data-street="place" className="absolute bottom-10 left-4 right-4 m-0 text-[11px] tracking-[0.12em] text-cream opacity-0 sm:left-[5%] sm:text-xs sm:tracking-[0.24em]">
          {boxOffice.place}
        </p>
        <p data-street="open" className="font-serif absolute bottom-10 left-4 m-0 text-[clamp(26px,3vw,40px)] italic text-blush opacity-0 sm:left-[5%]">
          {boxOffice.open}
        </p>

        <div data-street="dim" aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night opacity-0" />
        <div data-street="tickets" className="absolute inset-0 overflow-y-auto opacity-0">
          {children}
        </div>
      </div>
      <span className="sr-only">{site.name}: {boxOffice.tagline}</span>
    </div>
  );
}

function Title() {
  return (
    <div className="relative flex flex-col items-center gap-3.5 [text-shadow:0_2px_30px_rgba(10,9,30,0.85)]">
      {/* Soft dark pool behind the title so it reads over the busy street */}
      <div aria-hidden="true" className="absolute -inset-x-10 -inset-y-16 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(15,14,40,0.85),rgba(15,14,40,0.4)_60%,transparent)]" />
      <p className="m-0 text-[11px] tracking-[0.18em] text-lavender sm:text-xs sm:tracking-[0.32em]">{boxOffice.presents}</p>
      <h1 className="font-marquee m-0 text-[clamp(64px,15vw,176px)] font-extrabold leading-[0.86] tracking-[0.01em]">
        <span className="sr-only">{boxOffice.name}</span>
        <span aria-hidden="true" className="block overflow-hidden pb-[0.04em]">
          {boxOffice.name.split("").map((ch, i) => (
            <span key={i} className="title-letter inline-block whitespace-pre" style={{ animationDelay: `${0.3 + i * 0.04}s` }}>
              {ch}
            </span>
          ))}
        </span>
      </h1>
      <p className="font-serif title-fade m-0 text-[clamp(24px,3vw,36px)] italic text-blush">{boxOffice.tagline}</p>
      <p className="title-fade m-0 text-xs tracking-[0.12em] text-lilac sm:text-[13px]">{boxOffice.meta}</p>
    </div>
  );
}
