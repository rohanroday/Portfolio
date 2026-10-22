"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import type { TicketData } from "@/content";

const TONE = { blush: "bg-blush", marigold: "bg-marigold" } as const;

// A cinema ticket: main body, a dashed perforation with half-circle notches, and a stub.
// Hover straightens and lifts it (CSS). Clicking tears the stub off along the perforation,
// then moves to the ticket's page. Cmd/Ctrl/middle clicks and reduced motion skip the tear.
export default function Ticket({ t }: { t: TicketData }) {
  const router = useRouter();
  const stub = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const tearing = useRef(false);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const plain = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!plain || reduced || !stub.current) return;
    e.preventDefault();
    if (tearing.current) return;
    tearing.current = true;
    gsap
      .timeline({ onComplete: () => router.push(t.href) })
      .to(body.current, { x: -6, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" })
      .to(stub.current, { rotation: 22, x: 46, y: 70, opacity: 0, duration: 0.55, ease: "power2.in", transformOrigin: "0% 0%" }, 0.05);
  };

  return (
    <div data-intro="ticket" className="flex w-full min-w-0 justify-center sm:max-w-[520px] sm:flex-[1_1_400px]">
      <Link
        href={t.href}
        onClick={onClick}
        className={`ticket relative flex w-full rounded-md text-left text-night no-underline ${TONE[t.tone]}`}
        style={{ ["--tilt" as string]: `${t.tilt}deg` }}
      >
        <div ref={body} className="flex min-w-0 flex-1 flex-col gap-2.5 px-5 pb-5 pt-6 sm:px-[26px] sm:pb-[22px] sm:pt-[26px]">
          <span className="caps text-[11px]">{t.kicker}</span>
          <span className="font-marquee text-[clamp(36px,9vw,46px)] font-extrabold leading-[0.95]">{t.title}</span>
          <span className="font-serif text-[clamp(19px,4.6vw,22px)] leading-[1.15]">
            {t.line.before}
            <em className="italic">{t.line.em}</em>
            {t.line.after}
          </span>
          <div className="mt-2 flex flex-wrap gap-x-[18px] gap-y-1 border-t border-night/35 pt-3 text-[11px]">
            {t.meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
        <div
          ref={stub}
          className="relative flex w-[84px] flex-none flex-col items-center justify-center gap-2 border-l-2 border-dashed border-night/45 sm:w-[110px]"
        >
          <span className="ticket-notch -top-3" aria-hidden="true" />
          <span className="ticket-notch -bottom-3" aria-hidden="true" />
          <span className="font-marquee rotate-180 text-xl font-extrabold tracking-[0.12em] [writing-mode:vertical-rl]">ADMIT ONE</span>
          <span className="text-[10px]">{t.number}</span>
        </div>
      </Link>
    </div>
  );
}
