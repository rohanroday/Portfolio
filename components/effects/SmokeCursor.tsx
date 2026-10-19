"use client";

import { useEffect, useRef } from "react";

// A light wisp of teal/violet smoke that trails the mouse across the whole site.
// Each puff is a pre-rendered blurred sprite that grows, drifts upward, swirls and fades.
// Mouse and trackpad only; touch screens and reduced-motion visitors never get it.

type Puff = { x: number; y: number; vx: number; vy: number; r: number; grow: number; life: number; decay: number; sprite: number; spin: number };

const COLORS = ["45, 212, 191", "139, 92, 246", "99, 102, 241", "34, 211, 238"];
const MAX_PUFFS = 140;

function makeSprite(rgb: string) {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb}, 0.55)`);
  grad.addColorStop(0.35, `rgba(${rgb}, 0.22)`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export default function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!fine || reduced || !canvas) return;

    const ctx = canvas.getContext("2d")!;
    const sprites = COLORS.map(makeSprite);
    const puffs: Puff[] = [];
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let last: { x: number; y: number } | null = null;
    let colorShift = 0;

    const spawn = (x: number, y: number, vx: number, vy: number) => {
      if (puffs.length >= MAX_PUFFS) puffs.shift();
      puffs.push({
        x: x + (Math.random() - 0.5) * 5,
        y: y + (Math.random() - 0.5) * 5,
        vx: vx * 0.06 + (Math.random() - 0.5) * 0.5,
        vy: vy * 0.06 - 0.25 - Math.random() * 0.35,
        r: 9 + Math.random() * 6,
        grow: 0.7 + Math.random() * 0.5,
        life: 1,
        decay: 0.015 + Math.random() * 0.01,
        sprite: Math.floor((colorShift + Math.random() * 1.5) % sprites.length),
        spin: Math.random() * Math.PI * 2,
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const x = e.clientX;
      const y = e.clientY;
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        // Fill the gap on fast moves so the trail stays continuous
        const steps = Math.min(5, Math.max(1, Math.floor(Math.hypot(dx, dy) / 20)));
        for (let i = 1; i <= steps; i++) spawn(last.x + (dx * i) / steps, last.y + (dy * i) / steps, dx, dy);
      } else {
        spawn(x, y, 0, 0);
      }
      last = { x, y };
      colorShift = (colorShift + 0.02) % sprites.length;
      if (!running) start();
    };
    const onLeave = () => (last = null);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    let frame = 0;
    let running = false;
    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        // Gentle curl so the smoke swirls instead of rising in a straight line
        p.spin += 0.04;
        p.vx += Math.cos(p.spin + t) * 0.03;
        p.vy -= 0.004;
        p.vx *= 0.97;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.grow;
        p.life -= p.decay;
        if (p.life <= 0) {
          puffs.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life * p.life * 0.55;
        const d = p.r * 2;
        ctx.drawImage(sprites[p.sprite], p.x - p.r, p.y - p.r, d, d);
      }
      ctx.globalAlpha = 1;
      if (puffs.length) frame = requestAnimationFrame(tick);
      else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    const start = () => {
      running = true;
      frame = requestAnimationFrame(tick);
    };

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55] h-full w-full" />;
}
