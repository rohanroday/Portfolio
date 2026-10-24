import { contact, site } from "@/content";
import Txt from "./Txt";

const linkClass = "flex min-h-11 items-center text-night underline decoration-night/40 underline-offset-4 hover:decoration-night";

// "Based in Sikkim" with its number-plate badge, and the blush curtain-call card.
export default function ContactCards() {
  const { basedIn, curtain } = contact;
  return (
    <section id="contact" aria-label="Contact" className="mx-auto flex max-w-[1180px] scroll-mt-6 flex-wrap gap-6 px-4 pb-28 pt-12 sm:px-[5%] sm:pb-[120px]">
      <div data-reveal className="flex flex-[1_1_320px] flex-col gap-3.5 rounded-xl bg-surface p-7 sm:p-9">
        <span className="text-xs tracking-[0.2em] text-lavender">{basedIn.label}</span>
        <span className="font-serif text-[56px] leading-none">{basedIn.place}</span>
        <span className="font-marquee self-start rounded-md border-2 border-cream px-3.5 py-1 text-[28px] font-extrabold tracking-[0.08em]">
          {basedIn.plate}
        </span>
        <span className="text-[13px] leading-[1.7] text-lilac">
          <Txt>{basedIn.line}</Txt>
        </span>
      </div>

      <div data-reveal className="flex flex-[1_1_320px] flex-col gap-4 rounded-xl bg-blush p-7 text-night sm:p-9">
        <span className="text-xs tracking-[0.2em]">{curtain.label}</span>
        <h2 className="font-serif m-0 text-5xl font-normal leading-none">{curtain.title}</h2>
        <a href={`mailto:${site.email}`} className={`${linkClass} self-start text-[15px]`}>
          {site.email}
        </a>
        <div className="flex flex-wrap gap-5 text-[13px]">
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className={linkClass}>
            LinkedIn
          </a>
          <a href={site.links.github} target="_blank" rel="noreferrer" className={linkClass}>
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
