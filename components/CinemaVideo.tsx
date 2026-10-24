"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";
const PORTRAIT = "(max-aspect-ratio: 5/6)";
const subscribe = (q: string) => (cb: () => void) => {
  const mq = window.matchMedia(q);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const subReduced = subscribe(REDUCED);
const subPortrait = subscribe(PORTRAIT);

type Props = {
  src: string;
  /** Optional portrait cut for phones */
  phoneSrc?: string;
  poster: string;
  loop?: boolean;
  className?: string;
};

// A silent, decorative background film. Loads and plays only while on screen, picks the phone cut
// on portrait screens, and shows the still poster to reduced-motion visitors.
export default function CinemaVideo({ src, phoneSrc, poster, loop = false, className = "" }: Props) {
  const reduced = useSyncExternalStore(subReduced, () => window.matchMedia(REDUCED).matches, () => false);
  const portrait = useSyncExternalStore(subPortrait, () => window.matchMedia(PORTRAIT).matches, () => false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduced]);

  const file = portrait && phoneSrc ? phoneSrc : src;
  return (
    <video
      ref={ref}
      key={file}
      src={inView && !reduced ? file : undefined}
      poster={poster}
      muted
      playsInline
      loop={loop}
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={`pointer-events-none h-full w-full object-cover ${className}`}
    />
  );
}
