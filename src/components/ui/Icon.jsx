// Inline SVG icon component.
const ICON_PATHS = {
  play: {
    fill: true,
    d: ["M8 5.5v13l10.5-6.5z"],
  },
  pause: {
    fill: true,
    d: ["M7 5h3.5v14H7z", "M13.5 5H17v14h-3.5z"],
  },
  restart: {
    d: ["M4 5v5h5", "M5.2 15a7.5 7.5 0 1 0 1.3-7.8L4 10"],
  },
  mirror: {
    d: ["M12 3v18", "M9 7 4 17h5z", "M15 7l5 10h-5z"],
  },
  loop: {
    d: [
      "M17 3l3 3-3 3",
      "M4 12v-1a5 5 0 0 1 5-5h11",
      "M7 21l-3-3 3-3",
      "M20 12v1a5 5 0 0 1-5 5H4",
    ],
  },
  metro: {
    d: ["M9 3h6l4 18H5z", "M8 15h8", "M12 15l5-9"],
  },
  sound: {
    d: [
      "M4 9h4l5-4v14l-5-4H4z",
      "M16.5 8.5a5 5 0 0 1 0 7",
      "M19 6a8.5 8.5 0 0 1 0 12",
    ],
  },
  mute: {
    d: ["M4 9h4l5-4v14l-5-4H4z", "M17 9l5 6", "M22 9l-5 6"],
  },
  upload: {
    d: ["M12 15V4", "M7 9l5-5 5 5", "M5 20h14"],
  },
  edit: {
    d: ["M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z"],
  },
  copy: {
    d: ["M9 9h11v11H9z", "M5 15H4V4h11v1"],
  },
  check: {
    d: ["M5 12.5l4.5 4.5L19 7.5"],
  },
  x: {
    d: ["M6 6l12 12", "M18 6 6 18"],
  },
  arrow: {
    d: ["M5 12h14", "M13 6l6 6-6 6"],
  },
  txala: {
    d: ["M3 10h18", "M3 15h18", "M8 3.5l1.2 6.5", "M16 3.5l-1.2 6.5"],
  },
  record: {
    fill: true,
    d: ["M12 6.5a5.5 5.5 0 1 0 0.001 0z"],
  },
  stop: {
    fill: true,
    d: ["M7 7h10v10H7z"],
  },
  undo: {
    d: ["M9 14 4 9l5-5", "M4 9h10.5a5.5 5.5 0 0 1 0 11H11"],
  },
  ladder: {
    d: ["M3 20h5v-5h5v-5h5V5h3"],
  },
  feet: {
    d: [
      "M7 4c2 0 3 1.6 3 4s-1 4.5-3 4.5S4 10.5 4 8s1-4 3-4z",
      "M5 15.5h4v3.5H5z",
      "M16 7c2 0 3 1.6 3 4s-1 4.5-3 4.5-3-2-3-4.5S14 7 16 7z",
      "M14 18.5h4V22h-4z",
    ],
  },
  download: {
    d: ["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"],
  },
  expand: {
    d: ["M4 9V4h5", "M20 9V4h-5", "M4 15v5h5", "M20 15v5h-5"],
  },
  flag: {
    d: ["M5 21V4", "M5 4h11l-2 4 2 4H5"],
  },
  compare: {
    d: ["M4 5h7v14H4z", "M13 5h7v14h-7z"],
  },
  spark: {
    d: [
      "M12 3v5",
      "M12 16v5",
      "M3 12h5",
      "M16 12h5",
      "M6.5 6.5l2.5 2.5",
      "M15 15l2.5 2.5",
      "M17.5 6.5 15 9",
      "M9 15l-2.5 2.5",
    ],
  },
  voice: {
    d: [
      "M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z",
      "M5 11a7 7 0 0 0 14 0",
      "M12 18v3",
    ],
  },
  sun: {
    d: [
      "M12 8a4 4 0 1 0 0.001 0z",
      "M12 2v2",
      "M12 20v2",
      "M2 12h2",
      "M20 12h2",
      "M4.9 4.9l1.4 1.4",
      "M17.7 17.7l1.4 1.4",
      "M4.9 19.1l1.4-1.4",
      "M17.7 6.3l1.4-1.4",
    ],
  },
  remote: {
    d: [
      "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
      "M10.5 8.5 14 11l-3.5 2.5z",
      "M11 17.5h2",
    ],
  },
  save: {
    d: ["M5 4h11l3 3v13H5z", "M8 4v5h7V4", "M8 20v-6h8v6"],
  },
};
export function Icon({ name, size = 16 }) {
  const icon = ICON_PATHS[name];
  return icon ? (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={icon.fill ? "currentColor" : "none"}
      stroke={icon.fill ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {icon.d.map((pathData, pathIndex) => (
        <path key={pathIndex} d={pathData} />
      ))}
    </svg>
  ) : null;
}
