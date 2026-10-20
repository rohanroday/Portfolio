"use client";

import { useEffect, useState } from "react";

// Phones only: a floating "Work with me" pill that slides up once the hero is out of view
// and tucks away again when the Contact section is on screen.
export default function MobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const contact = document.getElementById("contact");
    if (!hero || !contact) return;
    let pastHero = false;
    let atContact = false;
    const update = () => setShow(pastHero && !atContact);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === contact) atContact = e.isIntersecting;
      }
      update();
    }, { threshold: 0.05 });
    io.observe(hero);
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href="#contact"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed bottom-5 left-1/2 z-50 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-line-strong bg-ink/85 py-3 pl-3 pr-5 text-sm font-semibold shadow-[0_12px_40px_-8px_#000000cc] backdrop-blur-md transition-all duration-500 ease-out active:scale-95 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <span className="relative flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-teal to-violet text-ink">
        <span className="absolute inset-0 animate-ping rounded-full bg-teal/40" />
        <span className="relative">✦</span>
      </span>
      Work with me
    </a>
  );
}
