import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader";
import ActSection from "@/components/ActSection";
import Intermission from "@/components/Intermission";
import ContactCards from "@/components/ContactCards";
import Headline from "@/components/Headline";
import StackMotion from "@/components/StackMotion";
import StarringPoster from "@/components/StarringPoster";
import CinemaVideo from "@/components/CinemaVideo";
import ProjectorBackdrop from "@/components/ProjectorBackdrop";
import { actsAfterIntermission, actsBeforeIntermission, stack } from "@/content";

export const metadata: Metadata = {
  title: "The Stack, in five acts",
  description: "Rohan Prasad's story in five acts: a hostel childhood, the full stack, Chito, code for the state of Sikkim, and client work.",
};

// "/stack" Ticket 1: the portfolio told in five acts, with an intermission.
export default function StackPage() {
  return (
    <div data-scene className="min-h-svh bg-night">
      <SubpageHeader label={stack.ticketLabel} tone="blush" />
      <ProjectorBackdrop watch="[data-act]" />
      <main id="main" className="relative z-10">
        {/* Inside the hall: the camera pushes down the aisle toward the screen, behind the title */}
        <div className="relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0">
            <CinemaVideo src="/cinema/auditorium.mp4" phoneSrc="/cinema/auditorium-m.mp4" poster="/cinema/auditorium-end.jpg" className="opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-night via-night/75 to-night/20" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
          </div>
        <section className="relative mx-auto flex max-w-[1180px] flex-col items-start gap-12 px-4 pb-16 pt-20 sm:px-[5%] sm:pb-24 sm:pt-[120px] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-[18px]">
            <p className="m-0 text-xs tracking-[0.32em] text-lavender">{stack.kicker}</p>
            <h1 className="font-serif m-0 text-[clamp(52px,8vw,120px)] font-normal leading-[0.95]">
              <Headline h={stack.title} />
            </h1>
            <p className="m-0 max-w-[620px] text-[15px] leading-[1.7] text-lilac">{stack.intro}</p>
          </div>
          <div className="flex w-full justify-center lg:w-auto lg:flex-none">
            <StarringPoster />
          </div>
        </section>
        </div>

        {actsBeforeIntermission.map((act) => (
          <ActSection key={act.id} act={act} />
        ))}
        <Intermission />
        {actsAfterIntermission.map((act, i) => (
          <ActSection key={act.id} act={act} divider={i > 0} />
        ))}
        <ContactCards />
      </main>
      <StackMotion />
    </div>
  );
}
