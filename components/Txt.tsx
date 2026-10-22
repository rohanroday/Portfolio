// Renders copy from content.ts, outlining any [PLACEHOLDER] so missing content is obvious.
export default function Txt({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <mark key={i} className="ph">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
