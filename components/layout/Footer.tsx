import { profile } from "@/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-8">
        <p>© 2026 {profile.name} · Built with Next.js, GSAP and Three.js</p>
        <div className="flex gap-5">
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-fg">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-fg">LinkedIn</a>
          <a href="#top" className="hover:text-fg">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
