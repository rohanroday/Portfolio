"use client";

import { useEffect, useRef } from "react";
import CinemaVideo from "./CinemaVideo";

// The projector beam, fixed behind the acts: it fades in while the acts are on screen,
// so the story feels like it is being projected while you read.
export default function ProjectorBackdrop({ watch }: { watch: string }) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = document.querySelectorAll(watch);
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      if (layer.current) layer.current.style.opacity = visible.size ? "1" : "0";
    }, { threshold: 0.15 });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [watch]);

  return (
    <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-1000">
      <div className="absolute inset-0 opacity-[0.22] mix-blend-screen">
        <CinemaVideo src="/cinema/projector.mp4" phoneSrc="/cinema/projector-m.mp4" poster="/cinema/projector.jpg" loop />
      </div>
      {/* Keep the text side darker so copy stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-night/40 via-transparent to-night/30" />
    </div>
  );
}
