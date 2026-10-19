"use client";

import dynamic from "next/dynamic";

// Three.js is only loaded in the browser, after the page itself has rendered.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function HeroCanvas() {
  return <HeroScene />;
}
