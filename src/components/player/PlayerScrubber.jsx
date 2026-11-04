// Pointer/keyboard seek slider with count-in pre-roll shading and A-B loop marks.
import { useRef } from "react";
import { formatClockTenths } from "../../lib/format.js";
import { clamp } from "../../lib/math.js";
export function PlayerScrubber({
  t: position,
  duration,
  loop,
  preroll,
  onSeek,
}) {
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const toPercent = (seconds) =>
    duration > 0 ? clamp((seconds / duration) * 100, 0, 100) : 0;
  const timeFromPointer = (pointerEvent) => {
    const rect = trackRef.current.getBoundingClientRect();
    return (
      clamp((pointerEvent.clientX - rect.left) / rect.width, 0, 1) * duration
    );
  };
  return (
    <div
      ref={trackRef}
      className="scrub"
      role="slider"
      tabIndex={0}
      aria-label="Posición"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration * 10) / 10}
      aria-valuenow={Math.round(position * 10) / 10}
      aria-valuetext={formatClockTenths(position)}
      onPointerDown={(downEvent) => {
        if (duration) {
          draggingRef.current = true;
          downEvent.currentTarget.setPointerCapture(downEvent.pointerId);
          onSeek(timeFromPointer(downEvent));
        }
      }}
      onPointerMove={(moveEvent) => {
        if (draggingRef.current) {
          onSeek(timeFromPointer(moveEvent));
        }
      }}
      onPointerUp={() => {
        draggingRef.current = false;
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
      }}
      onKeyDown={(keyEvent) => {
        if (keyEvent.key === "ArrowRight") {
          keyEvent.preventDefault();
          onSeek(position + 0.25);
        } else if (keyEvent.key === "ArrowLeft") {
          keyEvent.preventDefault();
          onSeek(position - 0.25);
        }
      }}
    >
      <div className="scrub-track">
        {preroll > 0 && (
          <div
            className="scrub-pre"
            style={{
              width: `${toPercent(preroll)}%`,
            }}
            title="Cuenta de entrada"
          />
        )}
        {loop.a != null && loop.b != null && (
          <div
            className={`scrub-loop ${loop.on ? "is-on" : ""}`}
            style={{
              left: `${toPercent(loop.a)}%`,
              width: `${toPercent(loop.b) - toPercent(loop.a)}%`,
            }}
          />
        )}
        <div
          className="scrub-fill"
          style={{
            width: `${toPercent(position)}%`,
          }}
        />
      </div>
      {loop.a != null && (
        <span
          className="scrub-mark"
          style={{
            left: `${toPercent(loop.a)}%`,
          }}
        >
          A
        </span>
      )}
      {loop.b != null && (
        <span
          className="scrub-mark"
          style={{
            left: `${toPercent(loop.b)}%`,
          }}
        >
          B
        </span>
      )}
      <span
        className="scrub-thumb"
        style={{
          left: `${toPercent(position)}%`,
        }}
      />
    </div>
  );
}
