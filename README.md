# Rohan Prasad · Portfolio

Personal portfolio of Rohan Prasad, a full stack developer from Sikkim, India.
A dark, one-page site with a Three.js particle mountain hero, a scroll-driven project showcase and a smoky cursor trail.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript
- Tailwind CSS 4
- [GSAP](https://gsap.com) + ScrollTrigger for scroll animations
- [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling
- [Three.js](https://threejs.org) for the hero scene

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx          fonts, metadata, smooth scroll, smoke cursor
  page.tsx            puts the sections together
  globals.css         colours, buttons, aurora, marquee and other shared styles
  icon.svg            favicon
components/
  sections/           one file per page section (Hero, About, Experience, FeaturedWork,
                      CreativeLab, Skills, Achievements, Contact)
  layout/             Nav and Footer
  ui/                 small reusable pieces (SectionHead, ProjectVisual, CopyEmail)
  effects/            motion and visuals (HeroScene, SmokeCursor, SmoothScroll, PageAnimations)
content/
  site.ts             all text, projects, skills and links
public/
  projects/           project screenshots
```

## Editing content

Everything you read on the site lives in `content/site.ts`: profile, experience, featured projects,
concept sites, skills and achievements. Change the text there and the page updates; no component edits needed.

To add a project screenshot, put the image in `public/projects/` and point the project's `image` field at it.

## Accessibility and performance

- Visitors who prefer reduced motion get static content: no smooth scroll, 3D animation, aurora or smoke.
- The smoke cursor only runs for mouse and trackpad users.
- The 3D scene loads after the page renders, pauses when off-screen, and uses fewer particles on phones.
