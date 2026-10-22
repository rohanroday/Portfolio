import Link from "next/link";
import type { Act } from "@/content";
import Headline from "./Headline";
import Txt from "./Txt";

// One act of the story: act label, big numeral and date on the left; headline and copy on the right.
// Columns stack on narrow screens. data-* hooks are animated by StackMotion.
export default function ActSection({ act, divider = true }: { act: Act; divider?: boolean }) {
  return (
    <section
      id={act.id}
      aria-labelledby={`${act.id}-title`}
      data-act
      className={`mx-auto flex max-w-[1180px] flex-wrap gap-6 px-4 py-14 sm:gap-10 sm:px-[5%] sm:py-[72px] ${divider ? "border-t border-line" : ""}`}
    >
      <div className="flex flex-[1_1_220px] flex-col gap-1.5">
        <span className="text-xs tracking-[0.2em] text-marigold">{act.label}</span>
        <span
          data-numeral={act.numeral}
          aria-hidden="true"
          className="font-marquee text-[clamp(88px,14vw,120px)] font-extrabold leading-[0.85] text-dusk"
        >
          {act.numeral}
        </span>
        <span className="text-xs text-lavender">{act.date}</span>
      </div>

      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-[18px]">
        <h2 id={`${act.id}-title`} data-reveal className="font-serif m-0 text-[clamp(40px,5vw,64px)] font-normal leading-[1.02]">
          <Headline h={act.headline} />
        </h2>
        <p data-reveal className="m-0 max-w-[640px] text-[15px] leading-[1.75] text-lilac">
          <Txt>{act.body}</Txt>
        </p>

        {act.pills && (
          <ul data-reveal className="m-0 flex list-none flex-wrap gap-2.5 p-0">
            {act.pills.map((p) => (
              <li key={p} className="rounded-full border border-dusk px-3.5 py-2 text-xs">
                {p}
              </li>
            ))}
          </ul>
        )}

        {act.cards && (
          <div data-reveal className="grid max-w-[640px] grid-cols-1 gap-3 sm:grid-cols-3">
            {act.cards.map((c) => (
              <div key={c.label} className="flex flex-col gap-1.5 rounded-lg bg-surface p-[18px]">
                <span className="text-[11px] tracking-[0.16em] text-lavender">{c.label}</span>
                <span className="text-sm">{c.value}</span>
              </div>
            ))}
          </div>
        )}

        {act.cta && (
          <Link data-reveal href={act.cta.href} className="pill pill-marigold self-start">
            {act.cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
