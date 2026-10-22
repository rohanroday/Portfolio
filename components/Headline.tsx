import type { Headline as H } from "@/content";

// Story headline with its one italic, coloured phrase.
export default function Headline({ h }: { h: H }) {
  return (
    <>
      {h.before}
      <em className={`italic ${h.tone === "blush" ? "text-blush" : "text-marigold"}`}>{h.em}</em>
      {h.after}
    </>
  );
}
