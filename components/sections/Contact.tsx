import CopyEmail from "@/components/ui/CopyEmail";
import { profile } from "@/content/site";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-4 py-24 sm:px-8 sm:py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#8b5cf633,#2dd4bf11_50%,transparent_70%)]" />
      <div data-anim className="relative mx-auto max-w-3xl text-center">
        <p className="eyebrow">Contact</p>
        <h2 className="mt-4 font-display text-[clamp(2.75rem,8vw,6rem)] font-bold leading-[0.95] tracking-tighter">
          Let&apos;s build <span className="text-gradient">something</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-muted">
          Have a full-stack role or a product idea in mind? I&apos;d love to work with you. My inbox is open.
        </p>
        <a href={`mailto:${profile.email}`} className="mt-8 inline-block break-all font-display text-xl underline decoration-line-strong underline-offset-8 transition-colors hover:text-teal hover:decoration-teal sm:text-2xl">
          {profile.email}
        </a>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${profile.email}`} className="btn btn-primary">Say hello</a>
          <CopyEmail email={profile.email} />
        </div>
      </div>
    </section>
  );
}
