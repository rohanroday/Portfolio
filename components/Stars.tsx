// A scattering of twinkling stars over the night sky. Positions come from a fixed seed so the
// server and browser render the same sky (no hydration mismatch).
function seeded(n: number) {
  let s = 20260101;
  return Array.from({ length: n }, () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  });
}

const r = seeded(48 * 4);
const stars = Array.from({ length: 48 }, (_, i) => ({
  left: r[i * 4] * 100,
  top: r[i * 4 + 1] * 70,
  size: r[i * 4 + 2] < 0.85 ? 1.5 : 2.5,
  opacity: 0.35 + r[i * 4 + 3] * 0.55,
  delay: -(r[i * 4 + 3] * 3.4),
}));

export default function Stars() {
  return (
    <div aria-hidden="true" data-intro="stars" className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star absolute rounded-full bg-cream"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            ["--o" as string]: s.opacity,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
