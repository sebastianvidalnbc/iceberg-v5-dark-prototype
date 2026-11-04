import type { AtomPosterId } from "../contentPages";

// 4:3 title stills for the ATOM picker and Streamly hero. Graphic key art —
// no likenesses. Width is the long edge; height is 3/4 of width.
const ART: Record<AtomPosterId, { bg: string; ink: string; accent: string }> = {
  "scorpion-king": { bg: "#1a0e06", ink: "#f4d27a", accent: "#c47a22" },
  "the-office": { bg: "#2b3324", ink: "#e6e0c8", accent: "#8a9a5b" },
  snapped: { bg: "#14080c", ink: "#f2d6dc", accent: "#c43b4a" },
  "office-pilot": { bg: "#243038", ink: "#d7e4ea", accent: "#6f8f9c" },
};

export function AtomPoster({
  poster,
  title,
  size = 112,
  className,
}: {
  poster: AtomPosterId;
  title: string;
  size?: number;
  className?: string;
}) {
  const art = ART[poster];
  const h = Math.round((size * 3) / 4);
  return (
    <svg
      className={["size-auto", className].filter(Boolean).join(" ")}
      width={size}
      height={h}
      viewBox="0 0 160 120"
      role="img"
      aria-label={`${title} still`}
      style={{ flex: "none", borderRadius: 4, display: "block" }}
    >
      <rect width="160" height="120" fill={art.bg} />
      {poster === "scorpion-king" && (
        <>
          <path d="M0 78 C36 58 70 92 160 64 V120 H0 Z" fill={art.accent} opacity="0.4" />
          <path d="M80 18 L92 48 L124 50 L98 70 L106 102 L80 84 L54 102 L62 70 L36 50 L68 48 Z" fill={art.ink} />
          <circle cx="132" cy="28" r="16" fill={art.accent} opacity="0.35" />
        </>
      )}
      {poster === "the-office" && (
        <>
          <rect x="12" y="16" width="136" height="52" fill={art.accent} opacity="0.28" />
          <rect x="20" y="24" width="36" height="28" fill={art.ink} opacity="0.2" />
          <rect x="62" y="24" width="36" height="28" fill={art.ink} opacity="0.35" />
          <rect x="104" y="24" width="36" height="28" fill={art.ink} opacity="0.2" />
          <rect x="18" y="76" width="28" height="30" fill={art.ink} opacity="0.45" />
          <rect x="54" y="76" width="28" height="30" fill={art.ink} opacity="0.3" />
          <rect x="90" y="76" width="28" height="30" fill={art.ink} opacity="0.45" />
          <rect x="126" y="76" width="18" height="30" fill={art.accent} opacity="0.5" />
        </>
      )}
      {poster === "snapped" && (
        <>
          <rect x="0" y="0" width="160" height="14" fill={art.accent} />
          <circle cx="58" cy="52" r="22" fill={art.accent} />
          <path d="M36 98 C44 72 72 72 80 98 L86 120 H30 Z" fill={art.ink} opacity="0.55" />
          <rect x="108" y="36" width="36" height="6" fill={art.ink} opacity="0.45" />
          <rect x="108" y="50" width="28" height="6" fill={art.ink} opacity="0.28" />
        </>
      )}
      {poster === "office-pilot" && (
        <>
          <rect x="14" y="18" width="90" height="84" fill={art.ink} opacity="0.12" />
          <rect x="22" y="28" width="74" height="8" fill={art.accent} />
          <rect x="22" y="44" width="58" height="6" fill={art.ink} opacity="0.4" />
          <rect x="22" y="56" width="46" height="6" fill={art.ink} opacity="0.25" />
          <rect x="22" y="68" width="64" height="6" fill={art.ink} opacity="0.25" />
          <circle cx="128" cy="70" r="22" fill={art.accent} opacity="0.4" />
        </>
      )}
      <rect x="5" y="5" width="150" height="110" fill="none" stroke={art.ink} strokeOpacity="0.22" />
    </svg>
  );
}

export function posterWash(poster: AtomPosterId): string {
  return ART[poster].bg;
}
