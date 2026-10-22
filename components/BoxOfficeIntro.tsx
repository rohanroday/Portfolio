"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The box-office opening (~2.5s): stars fade in → ridges rise one by one → prayer flags arrive
// → the name reveals letter by letter → tickets drop in and settle at their tilt.
// Plays once per visit; "Skip" or any key jumps to the end. Also runs the scroll parallax.
// The "intro" class (added before paint in layout.tsx) keeps pieces hidden until this takes over.
export default function BoxOfficeIntro() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (html.classList.contains("intro")) {
        const q = (s: string) => gsap.utils.toArray<Element>(s);
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            try {
              sessionStorage.setItem("hs-intro", "1");
            } catch {}
            setPlaying(false);
          },
        });
        tl.from(q("[data-intro='stars']"), { opacity: 0, duration: 0.7, ease: "none" }, 0)
          .from(q("[data-ridge='far']"), { y: 140, duration: 0.9 }, 0.25)
          .from(q("[data-ridge='mid']"), { y: 140, duration: 0.9 }, 0.45)
          .from(q("[data-ridge='near']"), { y: 140, duration: 0.9 }, 0.65)
          .from(q("[data-intro='header']"), { opacity: 0, y: -12, duration: 0.6 }, 0.5)
          .from(q("[data-intro='flags']"), { opacity: 0, y: -30, duration: 0.7 }, 0.8)
          .from(q("[data-intro='presents']"), { opacity: 0, y: 12, duration: 0.5 }, 1.0)
          .from(q("[data-letter]"), { yPercent: 110, duration: 0.7, stagger: 0.035, ease: "power4.out" }, 1.05)
          .from(q("[data-intro='tagline'], [data-intro='meta']"), { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, 1.45)
          .from(q("[data-intro='pick']"), { opacity: 0, duration: 0.4 }, 1.7)
          .from(q("[data-intro='ticket']"), { y: -160, opacity: 0, rotation: (i) => (i ? 9 : -9), duration: 0.85, stagger: 0.14, ease: "back.out(1.5)" }, 1.7)
          .from(q("[data-intro='scroll']"), { opacity: 0, y: 10, duration: 0.5 }, 2.25);
        html.classList.remove("intro");
        setPlaying(true);

        const skip = () => tl.progress(1);
        window.addEventListener("keydown", skip, { once: true });
        (window as unknown as { __skipIntro?: () => void }).__skipIntro = skip;
      }

      // Scroll parallax: far layers drift slower, and the night deepens as you leave the box office
      if (!reduced) {
        const scroll = { trigger: "#box-office", start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-intro='stars']", { y: 120, ease: "none", scrollTrigger: scroll });
        gsap.to("[data-ridge='far']", { y: 70, ease: "none", scrollTrigger: scroll });
        gsap.to("[data-ridge='mid']", { y: 40, ease: "none", scrollTrigger: scroll });
        gsap.to("[data-ridge='near']", { y: 14, ease: "none", scrollTrigger: scroll });
        gsap.to("[data-dim]", { opacity: 0.55, ease: "none", scrollTrigger: scroll });
      }
    });
    return () => {
      ctx.revert();
      html.classList.remove("intro");
    };
  }, []);

  if (!playing) return null;
  return (
    <button
      type="button"
      onClick={() => (window as unknown as { __skipIntro?: () => void }).__skipIntro?.()}
      className="fixed bottom-5 right-5 z-50 min-h-11 rounded-full border border-dusk bg-night/70 px-5 text-xs tracking-[0.2em] text-cream backdrop-blur hover:border-blush hover:text-blush"
    >
      SKIP
    </button>
  );
}
