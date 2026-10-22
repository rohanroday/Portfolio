import Link from "next/link";

// Header for the ticket pages: a way back to the box office and the ticket you're holding.
export default function SubpageHeader({ label, tone }: { label: string; tone: "blush" | "marigold" }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-4 py-5 sm:px-[5%] sm:py-6">
      <Link href="/" className="flex min-h-11 items-center gap-2 text-[13px] no-underline hover:text-blush">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Back to the box office
      </Link>
      <span className={`text-[11px] tracking-[0.2em] sm:text-xs ${tone === "blush" ? "text-blush" : "text-marigold"}`}>{label}</span>
    </header>
  );
}
