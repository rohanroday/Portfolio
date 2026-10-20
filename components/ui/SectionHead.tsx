import type { ReactNode } from "react";

export default function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div data-anim className="mb-8 max-w-2xl sm:mb-12">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {children && <p className="mt-4 text-muted">{children}</p>}
    </div>
  );
}
