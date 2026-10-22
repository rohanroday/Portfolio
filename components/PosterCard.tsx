import Txt from "./Txt";

const TONES = {
  blush: "bg-blush text-night",
  dusk: "bg-dusk text-cream",
  cream: "bg-cream text-night",
} as const;

// A tall "coming soon" trailer poster. Not a link until the project has somewhere to go.
export default function PosterCard({ kicker, title, line, tone }: { kicker: string; title: string; line: string; tone: keyof typeof TONES }) {
  return (
    <article
      data-reveal
      className={`flex min-h-[320px] flex-[1_1_300px] flex-col justify-between gap-5 rounded-xl p-7 transition-transform duration-500 hover:-translate-y-1.5 sm:min-h-[380px] ${TONES[tone]}`}
    >
      <span className="text-[11px] tracking-[0.2em]">{kicker}</span>
      <div className="flex flex-col gap-2">
        <h3 className="font-marquee m-0 text-[clamp(40px,8vw,48px)] font-extrabold leading-[0.9]">
          <Txt>{title}</Txt>
        </h3>
        <span className="font-serif text-xl italic">{line}</span>
      </div>
    </article>
  );
}
