"use client";

import { useSyncExternalStore } from "react";
import { isOn, subscribe, toggle } from "@/lib/ambience";
import { sound } from "@/content";

// Pill button that turns the hill ambience on and off. Muted by default.
export default function SoundToggle() {
  const playing = useSyncExternalStore(subscribe, isOn, () => false);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-dusk bg-transparent px-4 py-2.5 text-xs text-cream transition-colors hover:border-blush hover:text-blush"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        {playing ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <>
            <path d="m23 9-6 6" />
            <path d="m17 9 6 6" />
          </>
        )}
      </svg>
      <span className="hidden sm:inline">{playing ? sound.on : sound.off}</span>
      <span className="sm:hidden">{playing ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
