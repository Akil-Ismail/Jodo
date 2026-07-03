export function JodoMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 104" width={size} height={(size * 104) / 120} aria-hidden>
      <defs>
        <linearGradient id="jm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A855F7" />
          <stop offset="1" stopColor="#D946EF" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="7" r="6" fill="url(#jm)" />
      <path
        d="M60 16 C 48 34 30 42 10 46 C 4 47.5 4 52 11 52 L109 52 C 116 52 116 47.5 110 46 C 90 42 72 34 60 16 Z"
        fill="url(#jm)"
      />
      <rect x="30" y="58" width="60" height="38" rx="7" fill="none" stroke="#C084FC" strokeWidth="9" />
      <rect x="51" y="72" width="18" height="24" rx="8" fill="#D946EF" />
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 font-display font-bold text-ink">
      <span className="text-muted" style={{ fontSize: size * 0.9 }}>
        &lt;
      </span>
      <JodoMark size={size} />
      <span style={{ fontSize: size }}>Jodo</span>
      <span className="text-muted" style={{ fontSize: size * 0.9 }}>
        &gt;
      </span>
    </span>
  );
}
