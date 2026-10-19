"use client";

import { useEffect, useRef } from "react";

// A small dot that sits exactly on the pointer and a thin ring that eases after it.
// Over links and buttons the ring grows and the dot fades. Mouse and trackpad only;
// touch screens and reduced-motion visitors keep the normal cursor.
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || !dot.current || !ring.current) return;
    const d = dot.current;
    const r = ring.current;
    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let visible = false;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        ringPos.x = pos.x;
        ringPos.y = pos.y;
        visible = true;
        d.style.opacity = r.style.opacity = "1";
      }
      d.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      const hit = (e.target as Element).closest("a, button, [role='button'], input, textarea, select, label");
      r.dataset.hover = hit ? "true" : "false";
      d.dataset.hover = hit ? "true" : "false";
    };
    const onLeave = () => {
      visible = false;
      d.style.opacity = r.style.opacity = "0";
    };
    const onDown = () => (r.dataset.press = "true");
    const onUp = () => (r.dataset.press = "false");

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      r.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ring} aria-hidden="true" className="cursor-ring" />
      <div ref={dot} aria-hidden="true" className="cursor-dot" />
    </>
  );
}
