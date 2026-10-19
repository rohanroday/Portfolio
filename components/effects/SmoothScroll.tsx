"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lenis smooth scrolling driven by GSAP's ticker, so scroll and animations share one clock.
// Off for visitors who prefer reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
        wheelMultiplier: 0.9,
        // Phones: Lenis takes over touch scrolling too, with a soft momentum glide
        syncTouch: true,
        syncTouchLerp: 0.08,
        touchInertiaExponent: 1.6,
        touchMultiplier: 1,
        anchors: { duration: 1.4 }, // sections already reserve header space with scroll-margin
      });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    });
    return () => mm.revert();
  }, []);

  return null;
}
