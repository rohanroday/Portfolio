import Image from "next/image";
import { starring } from "@/content";

// The lobby poster: Rohan's portrait in a marigold frame with marquee bulbs, "Starring" billing below.
export default function StarringPoster() {
  const bulbs = Array.from({ length: 9 }, (_, i) => i);
  return (
    <figure data-reveal className="relative m-0 w-full max-w-[380px] rotate-[1.5deg] rounded-lg bg-marigold p-3 text-night shadow-[0_30px_70px_rgba(8,7,24,0.55)] sm:p-4">
      {/* Bulb rows along the top and bottom edges */}
      {(["top-1", "bottom-1"] as const).map((pos) => (
        <div key={pos} aria-hidden="true" className={`absolute inset-x-5 ${pos} flex justify-between`}>
          {bulbs.map((i) => (
            <span key={i} className="marquee-bulb size-1.5 rounded-full bg-cream" style={{ animationDelay: `${(i % 3) * 0.4}s` }} />
          ))}
        </div>
      ))}
      <div className="overflow-hidden rounded-[4px]">
        <Image
          src="/images/rohan-portrait.webp"
          alt={starring.alt}
          width={1200}
          height={1500}
          sizes="(min-width: 640px) 380px, 90vw"
          priority
          className="h-auto w-full"
        />
      </div>
      <figcaption className="flex flex-col items-center gap-1 pb-1 pt-4 text-center">
        <span className="text-[11px] tracking-[0.32em]">{starring.kicker}</span>
        <span className="font-marquee text-[44px] font-extrabold leading-[0.9]">{starring.name}</span>
        <span className="font-serif text-lg italic">{starring.role}</span>
      </figcaption>
    </figure>
  );
}
