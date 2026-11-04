// Thumbnail glyph per clip kind (pies, escenario, musica, subido).
export function ClipThumbnailGlyph({ angle }) {
  return angle === "pies" ? (
    <svg viewBox="0 0 48 30" aria-hidden="true" className="thumb-glyph">
      <path
        d="M18 3c2.6 0 4 1.8 4 4.4 0 2.4-1 3.4-1 6 0 2.4 1.4 3.6 1.4 6.4 0 3.4-1.8 6.2-4.6 6.2s-4.6-2.8-4.6-6.2c0-2.8 1.4-4 1.4-6.4 0-2.6-1-3.6-1-6C13.6 4.8 15.4 3 18 3z"
        fill="#16151B"
      />
      <path
        d="M30 3c2.6 0 4.4 1.8 4.4 4.4 0 2.4-1 3.4-1 6 0 2.4 1.4 3.6 1.4 6.4 0 3.4-1.8 6.2-4.6 6.2s-4.6-2.8-4.6-6.2c0-2.8 1.4-4 1.4-6.4 0-2.6-1-3.6-1-6C26 4.8 27.4 3 30 3z"
        fill="#16151B"
      />
      <path d="M15 12.5h6M27 12.5h6" stroke="var(--foot-r)" strokeWidth="1.6" />
    </svg>
  ) : angle === "escenario" ? (
    <svg viewBox="0 0 48 30" aria-hidden="true" className="thumb-glyph">
      <rect
        x="4"
        y="4"
        width="40"
        height="19"
        rx="1"
        fill="none"
        stroke="rgba(255,244,228,.55)"
      />
      <circle cx="13" cy="10" r="2.6" fill="#E2453C" />
      <circle cx="21" cy="13" r="2.6" fill="#EDB92E" />
      <circle cx="29" cy="16" r="2.6" fill="#2F6FE4" />
      <circle cx="37" cy="19" r="2.6" fill="#2E9E58" />
      <path
        d="M4 26.5h40"
        stroke="rgba(255,244,228,.4)"
        strokeDasharray="2 3"
      />
    </svg>
  ) : angle === "musica" ? (
    <svg viewBox="0 0 48 30" aria-hidden="true" className="thumb-glyph">
      {[6, 12, 18, 9, 22, 14, 8, 17, 11, 20, 7].map((barHeight, barIndex) => (
        <rect
          key={barIndex}
          x={4 + barIndex * 3.8}
          y={15 - barHeight / 2}
          width="2.2"
          height={barHeight}
          rx="1"
          fill="rgba(255,255,255,.85)"
        />
      ))}
    </svg>
  ) : (
    <svg viewBox="0 0 48 30" aria-hidden="true" className="thumb-glyph">
      <rect
        x="9"
        y="5"
        width="30"
        height="20"
        rx="2"
        fill="none"
        stroke="rgba(255,255,255,.7)"
        strokeWidth="1.5"
      />
      <path d="M21 10.5v9l7-4.5z" fill="rgba(255,255,255,.85)" />
    </svg>
  );
}
