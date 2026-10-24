"use client";

import { useEffect, useRef, useState } from "react";

// Set once the first page has loaded: the curtain only plays on page changes, never on arrival.
let firstPageShown = false;

// Page change: the closed red velvet curtain covers the screen, then parts and fades to reveal
// the new page. Clicks pass straight through it. Skipped for reduced-motion visitors.
export default function CurtainReveal() {
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!firstPageShown) {
      firstPageShown = true;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Deferred to the next frame so the curtain mounts without a synchronous effect re-render
    const id = requestAnimationFrame(() => {
      setPhone(window.matchMedia("(max-aspect-ratio: 5/6)").matches);
      setShow(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const v = video.current;
    const el = layer.current;
    if (!show || !v || !el) return;
    v.currentTime = 0.6;
    v.playbackRate = 1.8;
    v.play().catch(() => setShow(false));
    // Fade out as the curtains part; gone by the time they're open
    const onTime = () => {
      const t = v.currentTime;
      el.style.opacity = String(Math.max(0, Math.min(1, 1 - (t - 2.6) / 1.4)));
      if (t > 4.1) setShow(false);
    };
    v.addEventListener("timeupdate", onTime);
    const safety = setTimeout(() => setShow(false), 4000);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      clearTimeout(safety);
    };
  }, [show]);

  if (!show) return null;
  return (
    <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] bg-night">
      <video
        ref={video}
        src={phone ? "/cinema/curtain-m.mp4" : "/cinema/curtain.mp4"}
        poster={phone ? "/cinema/curtain-m.jpg" : "/cinema/curtain.jpg"}
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
