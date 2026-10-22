// A string of prayer flags sagging across the top of the screen. Each flag sways from its top edge.
// "slice" keeps flags their real size on narrow screens (the string is cropped at the sides instead).
const COLORS = ["#3E6FB0", "#F4EDE4", "#C8553D", "#3F8F5B", "#F2B544"];

// Points on the curve M0 120 Q720 230 1440 110 at every 72 units, matching the design
function curveY(x: number) {
  // Solve x(t) = 1440t (control point is centred) then y(t) on the quadratic
  const t = x / 1440;
  return (1 - t) * (1 - t) * 120 + 2 * (1 - t) * t * 230 + t * t * 110;
}

const flags = Array.from({ length: 19 }, (_, i) => {
  const x = 65 + i * 72;
  return { x, y: curveY(x + 7), color: COLORS[i % COLORS.length], delay: -((i * 0.37) % 4.5) };
});

export default function PrayerFlags({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 200"
      preserveAspectRatio="xMidYMin slice"
      className={`pointer-events-none absolute left-0 w-full ${className}`}
      data-intro="flags"
    >
      <path d="M0 120 Q720 230 1440 110" fill="none" stroke="#8C8AC2" strokeWidth="1.2" />
      {flags.map((f) => (
        <g key={f.x}>
          <rect className="flag" x={f.x} y={f.y} width="14" height="20" fill={f.color} style={{ animationDelay: `${f.delay}s` }} />
        </g>
      ))}
    </svg>
  );
}
