"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scroll motion for the acts page:
//   [data-numeral]  slides in and counts up from 00 when its act arrives
//   [data-reveal]   fades up, staggered within each act
//   [data-scene]    the night deepens as you scroll further into the acts
// Reduced motion: everything is simply shown.
export default function StackMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-act], #contact").forEach((section) => {
        const start = "top 78%";
        const numeral = section.querySelector<HTMLElement>("[data-numeral]");
        if (numeral) {
          const target = Number(numeral.dataset.numeral);
          const counter = { v: 0 };
          gsap.from(numeral, { x: -48, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: section, start, once: true } });
          gsap.to(counter, {
            v: target,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start, once: true },
            onUpdate: () => (numeral.textContent = String(Math.round(counter.v)).padStart(2, "0")),
          });
        }
        gsap.from(section.querySelectorAll("[data-reveal]"), {
          y: 36,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start, once: true },
        });
      });

      gsap.fromTo(
        "[data-scene]",
        { backgroundColor: "#17163A" },
        { backgroundColor: "#0e0d26", ease: "none", scrollTrigger: { trigger: "[data-scene]", start: "top top", end: "bottom bottom", scrub: true } },
      );
    });
    return () => ctx.revert();
  }, []);

  return null;
}
