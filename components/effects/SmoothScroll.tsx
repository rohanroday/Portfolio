"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// Phones show/hide the address bar while scrolling; don't recalculate every trigger when that happens
ScrollTrigger.config({ ignoreMobileResize: true });

// Lenis smooth scrolling driven by GSAP's ticker, so scroll and animations share one clock.
// Mouse wheels get the smooth glide; touch screens keep the phone's own native momentum,
// which always feels fastest and most natural under a finger.
// Off for visitors who prefer reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
        wheelMultiplier: 0.9,
        syncTouch: false,
        anchors: { duration: 1.1 }, // sections already reserve header space with scroll-margin
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
