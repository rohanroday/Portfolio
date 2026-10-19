"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Every scroll and hover effect on the page, driven by data attributes:
//   [data-hero]          children fade up once on load; [data-split] letters rise one by one
//   [data-anim]          fades up when it scrolls into view
//   [data-anim-stagger]  its children fade up one after another
//   [data-count]         number ticks up from 0 when visible
//   [data-timeline]      the vertical line draws itself with scroll
//   [data-parallax]      image drifts slightly against the scroll
//   .glow                spotlight follows the cursor (all devices with a mouse)
// Reduced-motion visitors get everything in its final state.
export default function PageAnimations() {
  useEffect(() => {
    // Spotlight position is cheap and not motion, so it runs for everyone with a fine pointer.
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".glow");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Pause CSS loops (aurora, marquee) while their section is off-screen
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => e.target.classList.toggle("is-offscreen", !e.isIntersecting)),
    );
    document.querySelectorAll("[data-pause-offscreen]").forEach((el) => io.observe(el));

    const mm = gsap.matchMedia();
    mm.add(
      {
        phone: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { phone } = ctx.conditions as { phone: boolean };
        const y = phone ? 22 : 40;
        const duration = phone ? 0.75 : 1;
        const start = phone ? "top 92%" : "top 88%";

        const intro = gsap.timeline({ delay: 0.2 });
        intro.fromTo(
          "[data-hero] > *",
          { autoAlpha: 0, y: phone ? 20 : 30 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12 },
        );
        intro.from(
          "[data-split] > span",
          { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.035 },
          0.1,
        );

        gsap.utils.toArray<HTMLElement>("[data-anim]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y, duration, ease: "power3.out", scrollTrigger: { trigger: el, start, once: true } });
        });

        gsap.utils.toArray<HTMLElement>("[data-anim-stagger]").forEach((el) => {
          const items = phone ? Array.from(el.children) : [el.children];
          items.forEach((target) => {
            gsap.from(target, {
              autoAlpha: 0,
              y,
              duration,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: { trigger: phone ? (target as Element) : el, start, once: true },
            });
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const decimals = Number(el.dataset.decimals ?? 0);
          const n = { v: 0 };
          gsap.to(n, {
            v: end,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start, once: true },
            onUpdate: () => (el.textContent = n.v.toFixed(decimals)),
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-timeline]").forEach((el) => {
          gsap.fromTo(
            el,
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top 75%", end: "bottom 60%", scrub: true } },
          );
        });

        if (!phone) {
          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: -6 },
              { yPercent: 6, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
            );
          });
        }
      },
    );

    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
      mm.revert();
    };
  }, []);

  return null;
}
