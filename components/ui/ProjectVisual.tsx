import Image from "next/image";
import type { Project } from "@/content/site";

// Screenshot of a featured project, in a phone or browser frame
export default function ProjectVisual({ p }: { p: Project }) {
  if (p.frame === "phone") {
    return (
      <div className="relative flex h-full min-h-[30rem] items-center justify-center overflow-hidden bg-[radial-gradient(55%_55%_at_50%_45%,#9b1c2e55,#d4a01722_45%,transparent_75%)] px-6 py-12 sm:min-h-[36rem]">
        <div data-parallax className="relative w-[min(58%,240px)]">
          <div className="overflow-hidden rounded-[2.4rem] border border-line-strong bg-ink p-2 shadow-[0_30px_80px_-20px_#9b1c2e99]">
            <div className="relative overflow-hidden rounded-[1.9rem]">
              {/* Crop to the top of the screen; the bottom of the login page is empty */}
              <Image src={p.image} alt={`${p.name} app screen`} width={780} height={1688} sizes="240px" className="aspect-[9/17] w-full object-cover object-top" />
            </div>
          </div>
          {p.badges?.map((b, i) => (
            <span
              key={b}
              className={`absolute whitespace-nowrap rounded-xl border border-line-strong bg-surface-2/90 px-3 py-2 text-xs font-medium shadow-xl shadow-black/40 backdrop-blur ${
                ["-left-16 top-[18%] sm:-left-24", "-right-14 top-[46%] sm:-right-24", "-left-12 bottom-[14%] sm:-left-20"][i % 3]
              }`}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full items-center overflow-hidden bg-[radial-gradient(60%_60%_at_50%_40%,#8b5cf622,transparent)] p-5 sm:p-10">
      <div data-parallax className="w-full overflow-hidden rounded-xl border border-line-strong bg-ink shadow-2xl shadow-black/60">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <Image src={p.image} alt={`${p.name} home page`} width={1440} height={900} sizes="(min-width: 1024px) 50vw, 100vw" className="w-full" />
      </div>
    </div>
  );
}
