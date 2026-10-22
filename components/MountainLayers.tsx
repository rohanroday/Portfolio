// Three Himalayan ridges (far, mid, near) with a snow cap on the tallest peak.
// Each ridge is its own group so the intro can raise them one by one and scroll can parallax them.
// "slice" keeps peaks their real shape on phones (the range is cropped at the sides instead of squashed).
export default function MountainLayers({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 380"
      preserveAspectRatio="xMidYMax slice"
      data-intro="mountains"
      className={`pointer-events-none absolute bottom-0 left-0 h-[260px] w-full sm:h-[380px] ${className}`}
    >
      <g data-ridge="far">
        <path d="M0 230 L120 160 L210 200 L330 100 L420 160 L520 120 L640 64 L700 102 L760 78 L880 150 L1000 110 L1120 170 L1240 128 L1360 178 L1440 150 L1440 380 L0 380Z" fill="#545388" />
        {/* Snow caps */}
        <path d="M612 82 L640 64 L668 84 L652 80 L640 90 L626 78Z" fill="#F4EDE4" opacity="0.9" />
        <path d="M314 112 L330 100 L346 114 L330 110Z" fill="#F4EDE4" opacity="0.75" />
      </g>
      <g data-ridge="mid">
        <path d="M0 280 L160 212 L300 262 L460 200 L600 252 L760 210 L920 270 L1080 220 L1240 262 L1440 212 L1440 380 L0 380Z" fill="#3A3972" />
      </g>
      <g data-ridge="near">
        <path d="M0 330 L200 292 L380 322 L560 282 L760 326 L960 296 L1160 330 L1440 300 L1440 380 L0 380Z" fill="#100F28" />
      </g>
    </svg>
  );
}
