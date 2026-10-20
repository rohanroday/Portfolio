"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { concepts } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

// On desktop the section pins and vertical scroll slides the cards sideways.
// Phones and reduced-motion visitors get a normal swipeable row with snap points.
export default function CreativeLab() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      // Slide until the last card sits 2rem from the right edge of the screen.
      // Measured from the card itself (scrollWidth drops trailing padding), never negative.
      const distance = () => {
        const last = el.lastElementChild as HTMLElement;
        const endGap = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2;
        return Math.max(0, last.offsetLeft + last.offsetWidth + endGap - document.documentElement.clientWidth);
      };
      // Re-measure whenever the cards change size (fonts loading, window or zoom changes)
      let lastW = 0;
      const ro = new ResizeObserver(() => {
        const w = Math.round(el.scrollWidth);
        if (w !== lastW) {
          lastW = w;
          ScrollTrigger.refresh();
        }
      });
      ro.observe(el);
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => ro.disconnect();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="lab">
      <div ref={section} className="flex flex-col justify-center overflow-hidden py-16 sm:py-24 lg:h-svh lg:pb-8 lg:pt-20">
        <div className="mx-auto mb-10 w-full max-w-6xl px-4 sm:px-8 lg:mb-8">
          <p className="eyebrow">Creative lab</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Websites that <span className="text-gradient">move</span>.
          </h2>
          <p className="mt-4 max-w-xl text-muted lg:[@media(max-height:820px)]:hidden">
            Concept sites I designed and built to push scroll animation, video and 3D on the web. Every one is live.
          </p>
          {/* Phones and tablets swipe this row sideways, so say so */}
          <p className="swipe-hint mt-5 inline-flex items-center gap-2 text-sm text-teal lg:hidden" aria-hidden="true">
            Swipe to explore <span className="swipe-arrow">→</span>
          </p>
        </div>
        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-8 lg:snap-none lg:overflow-visible lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]"
        >
          {concepts.map((c) => (
            <article
              key={c.name}
              className="glow group w-[82vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-line bg-surface sm:w-[60vw] lg:w-[min(46vw,40rem,calc((100svh-27rem)*1.6))] lg:min-w-[22rem]"
            >
              <a href={c.live} target="_blank" rel="noreferrer" className="block overflow-hidden" aria-label={`Open ${c.name} live site`}>
                <Image
                  src={c.image}
                  alt={`${c.name} home page`}
                  width={1440}
                  height={900}
                  sizes="(min-width: 1024px) 46vw, 82vw"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </a>
              <div className="flex flex-wrap items-end justify-between gap-4 p-5 sm:p-6">
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted">{c.blurb}</p>
                  <p className="mt-2 text-xs tracking-wide text-muted/80">{c.stack}</p>
                </div>
                <div className="flex gap-2">
                  <a href={c.live} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">Live ↗</a>
                  <a href={c.repo} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">Code</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
