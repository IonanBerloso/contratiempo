// 'Partitura de sonidos': rows of eights in 16th cells showing step phrases and right/left foot sound events, clickable to seek and loop.
import { useEffect, useMemo, useRef, useState } from "react";
import { SUBDIVISION_MARKS, countInEight, countLabel } from "../../lib/time.js";
import { vocabSoundAbbr, vocabStepName } from "../../lib/footwork.js";
import { Icon } from "../ui/Icon.jsx";
export function SoundScore({ clip, beat, vocab, onSeekBeat, onLoopBeats }) {
  const containerRef = useRef(null);
  const [rowLength, setRowLength] = useState(8);
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver == "undefined") return;
    const observer = new ResizeObserver(([entry]) =>
      setRowLength(entry.contentRect.width < 560 ? 4 : 8),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const rows = useMemo(() => {
    const rowList = [];
    if (clip.events.some((soundEvent) => soundEvent.b < 0)) {
      rowList.push({
        start: -4,
        len: 4,
        pickup: true,
      });
    }
    for (let rowStart = 0; rowStart < clip.counts; rowStart += rowLength)
      rowList.push({
        start: rowStart,
        len: Math.min(rowLength, clip.counts - rowStart),
      });
    return rowList;
  }, [clip, rowLength]);
  const quarterBeat = beat == null ? null : Math.floor(beat * 4 + 1e-6) / 4;
  const usedSounds = [...new Set(clip.events.map((soundEv) => soundEv.s))];
  const activeSpan =
    beat == null
      ? null
      : clip.spans.find(
          (span) => beat >= span.from - 0.05 && beat <= span.to + 0.2,
        );
  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="f-label">Partitura de sonidos</p>
        <p className="text-[12px] text-muted">
          {"Cada fila es un ocho contado "}
          <span className="font-mono">1 · y · 2</span>. Toca una casilla para ir
          a ese sonido.
        </p>
      </div>
      {rows.map((row) => {
        const cellCount = row.len * 4;
        const eightNumber = (clip.eight || 1) + Math.floor(row.start / 8);
        const firstCount = (((row.start % 8) + 8) % 8) + 1;
        const rowLabel = row.pickup
          ? "Entrada · 5 6 7 8"
          : row.len === 8
            ? `Ocho ${eightNumber}`
            : `Ocho ${eightNumber} · cuentas ${firstCount}–${firstCount + row.len - 1}`;
        const isPlayingRow =
          quarterBeat != null &&
          quarterBeat >= row.start &&
          quarterBeat < row.start + row.len;
        const rowSpans = clip.spans.filter(
          (candidateSpan) =>
            candidateSpan.from >= row.start - 1e-6 &&
            candidateSpan.from < row.start + row.len - 1e-6,
        );
        return (
          <div key={row.start} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                {rowLabel}
              </span>
              {!row.pickup && (
                <button
                  type="button"
                  className="btn btn-xs"
                  onClick={() => onLoopBeats(row.start, row.start + row.len)}
                >
                  <Icon name="loop" size={13} />
                  {"Repetir "}
                  {row.len === 8 ? "este ocho" : "estas cuentas"}
                </button>
              )}
            </div>
            {rowSpans.length > 0 && (
              <p className="phrase-line">
                {rowSpans.map((phraseSpan, phraseIdx) => (
                  <span
                    key={phraseIdx}
                    className={`phrase ${phraseSpan === activeSpan ? "is-on" : ""}`}
                  >
                    <b>{countLabel(phraseSpan.from)}</b>{" "}
                    {vocabStepName(vocab, phraseSpan.key)}
                  </span>
                ))}
              </p>
            )}
            <div
              className="rgrid"
              style={{
                gridTemplateColumns: `1.5rem repeat(${cellCount}, minmax(0, 1fr))`,
              }}
            >
              {isPlayingRow && (
                <div
                  className="rplay"
                  style={{
                    gridColumn: `${Math.round((quarterBeat - row.start) * 4) + 2}`,
                    gridRow: "1 / 5",
                  }}
                />
              )}
              {Array.from(
                {
                  length: cellCount,
                },
                (v, cellIdx) => {
                  const isBeat = cellIdx % 4 === 0;
                  const T = isBeat
                    ? countInEight(row.start + cellIdx / 4)
                    : SUBDIVISION_MARKS[cellIdx % 4];
                  return (
                    <span
                      key={`h${cellIdx}`}
                      className={`rcount ${isBeat ? "is-beat" : ""}`}
                      style={{
                        gridColumn: cellIdx + 2,
                        gridRow: 1,
                      }}
                    >
                      {T}
                    </span>
                  );
                },
              )}
              {rowSpans.map((stepSpan, spanIdx) => {
                const colStart = Math.round((stepSpan.from - row.start) * 4);
                const colEnd = Math.min(
                  cellCount,
                  Math.round((stepSpan.to - row.start) * 4) + 1,
                );
                return (
                  <span
                    key={`s${spanIdx}`}
                    className={`rspan ${stepSpan === activeSpan ? "is-on" : ""}`}
                    style={{
                      gridColumn: `${colStart + 2} / ${colEnd + 2}`,
                      gridRow: 2,
                    }}
                    title={vocabStepName(vocab, stepSpan.key)}
                  />
                );
              })}
              <span
                className="rlane"
                style={{
                  gridColumn: 1,
                  gridRow: 3,
                }}
                title="Pie derecho"
              >
                D
              </span>
              <span
                className="rlane is-l"
                style={{
                  gridColumn: 1,
                  gridRow: 4,
                }}
                title="Pie izquierdo"
              >
                I
              </span>
              {Array.from(
                {
                  length: cellCount,
                },
                (v, seekIdx) => (
                  <button
                    key={`c${seekIdx}`}
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    className={`rcell ${seekIdx % 4 === 0 ? "is-beat" : ""}`}
                    style={{
                      gridColumn: seekIdx + 2,
                      gridRow: "3 / 5",
                    }}
                    onClick={() => onSeekBeat(row.start + seekIdx / 4 - 0.01)}
                  />
                ),
              )}
              {clip.events
                .filter(
                  (rowEvent) =>
                    rowEvent.b >= row.start - 1e-6 &&
                    rowEvent.b < row.start + row.len - 1e-6,
                )
                .map((hit, hitIdx) => {
                  const hitCol = Math.round((hit.b - row.start) * 4);
                  const isHit =
                    beat != null && beat >= hit.b - 1e-6 && beat - hit.b < 0.22;
                  const soundName = vocab.sounds[hit.s]
                    ? vocab.sounds[hit.s].name
                    : hit.s;
                  return (
                    <span
                      key={`e${hitIdx}`}
                      className={`rev ${hit.f === "R" ? "is-r" : "is-l"} ${isHit ? "is-hit" : ""}`}
                      style={{
                        gridColumn: hitCol + 2,
                        gridRow: hit.f === "R" ? 3 : 4,
                      }}
                      title={`${countLabel(hit.b)} · ${soundName} · pie ${hit.f === "R" ? "derecho" : "izquierdo"}`}
                    >
                      {vocabSoundAbbr(vocab, hit.s)}
                    </span>
                  );
                })}
            </div>
          </div>
        );
      })}
      <p className="font-mono text-[11px] leading-relaxed text-muted">
        {usedSounds.map((soundKey, keyIdx) => (
          <span key={soundKey}>
            {keyIdx > 0 ? " · " : ""}
            <b className="font-medium text-ink">
              {vocabSoundAbbr(vocab, soundKey)}
            </b>{" "}
            {vocab.sounds[soundKey] ? vocab.sounds[soundKey].name : soundKey}
          </span>
        ))}
      </p>
    </div>
  );
}
