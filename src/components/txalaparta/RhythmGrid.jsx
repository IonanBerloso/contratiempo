// Txalaparta strike grid: herren/ttakun rows per plank or stone, optional tap-shoe row, one ocho per row.
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FOOT_STRIKES } from "../../data/txalaparta.js";
import {
  TXALAPARTA_PLANK_ROLES,
  TXALAPARTA_ROLE_LABELS,
  beatPositionLabel,
  beatToEightCount,
  isStrikePlayable,
  plankLabel,
  plankPitchLabel,
  strikeTargetKey,
} from "../../lib/txalaparta.js";
import { useMediaQuery } from "../../lib/dom.js";
export function TxalapartaRhythmGrid({
  rhythm,
  cols,
  L,
  q,
  slot,
  onToggle,
  onCycleFeet,
  feetName,
}) {
  const gridRef = useRef(null);
  const [gridWidth, setGridWidth] = useState(1000);
  const touch = useMediaQuery("(pointer: coarse)");
  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl || typeof ResizeObserver == "undefined") return;
    const resizeObserver = new ResizeObserver(([entry]) => setGridWidth(entry.contentRect.width));
    resizeObserver.observe(gridEl);
    return () => resizeObserver.disconnect();
  }, []);
  const cellsPerBeat = Math.round(1 / q);
  // With a mouse, 8 counts per row (4 below 560 px). With a finger, as many counts as keep each
  // half-cell at least 28 px wide, so a strike lands where you tap (2 counts per row on a phone).
  const countsPerRow = touch
    ? [8, 4, 2].find((n) => (gridWidth - 72) / (n * cellsPerBeat) >= 28) || 2
    : gridWidth < 560
      ? 4
      : 8;
  const strikeMap = useMemo(() => {
    const cellStates = new Map();
    for (let layer of rhythm.layers)
      for (let strike of layer.strikes) {
        if (!isStrikePlayable(strike, rhythm, cols, L)) continue;
        const cellIndex = Math.round(strike.b / q);
        if (strike.p === "pi") {
          const feetKey = `pi:${cellIndex}`;
          const existingFeet = cellStates.get(feetKey);
          if (!existingFeet || (!layer.muted && existingFeet.muted)) {
            cellStates.set(feetKey, {
              plank: strike.plank,
              muted: layer.muted,
            });
          }
          continue;
        }
        const cellKey = `${strike.p}:${strikeTargetKey(strike, rhythm)}:${cellIndex}`;
        if (layer.muted) {
          if (!cellStates.has(cellKey)) {
            cellStates.set(cellKey, "muted");
          }
        } else {
          cellStates.set(cellKey, "on");
        }
      }
    return cellStates;
  }, [rhythm, cols, L, q]);
  const rowStarts = [];
  for (let rowBeat = 0; rowBeat < L; rowBeat += countsPerRow)
    rowStarts.push(rowBeat);
  const nowCell = slot != null ? Math.floor(slot / q + 1e-6) : null;
  return (
    <div ref={gridRef} className="flex flex-col gap-4">
      {rowStarts.map((rowStart) => {
        const rowCells = Math.min(countsPerRow, L - rowStart) * cellsPerBeat;
        const firstCell = rowStart * cellsPerBeat;
        return (
          <div key={rowStart} className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {"Ocho "}
              {Math.floor(rowStart / 8) + 1}
              {countsPerRow < 8
                ? ` · cuentas ${(rowStart % 8) + 1}–${(rowStart % 8) + countsPerRow}`
                : ""}
            </span>
            <div
              className="tx-grid"
              style={{
                gridTemplateColumns: `4rem repeat(${rowCells}, minmax(0, 1fr))`,
              }}
            >
              <span />
              {Array.from(
                {
                  length: rowCells,
                },
                (m, headCol) => {
                  const headBeat = (firstCell + headCol) * q;
                  const isBeat = headCol % cellsPerBeat === 0;
                  return (
                    <span
                      key={`h${headCol}`}
                      className={`tx-head ${isBeat ? "is-beat" : ""} ${nowCell === firstCell + headCol ? "is-now" : ""}`}
                    >
                      {isBeat
                        ? beatToEightCount(headBeat)
                        : cellsPerBeat === 4
                          ? headCol % 4 === 2
                            ? "y"
                            : "·"
                          : "y"}
                    </span>
                  );
                },
              )}
              {cols.map((plankCol) => (
                <Fragment key={plankCol.key}>
                  <span
                    className={`tx-plank ${plankCol.m === "s" ? "is-stone" : ""}`}
                    title={plankLabel(plankCol)}
                  >
                    <b>{plankLabel(plankCol)}</b>
                    {plankPitchLabel(plankCol) && (
                      <span>{plankPitchLabel(plankCol)}</span>
                    )}
                  </span>
                  {Array.from(
                    {
                      length: rowCells,
                    },
                    (v, colIdx) => {
                      const cellIdx = firstCell + colIdx;
                      return (
                        <span
                          key={`${plankCol.key}-${colIdx}`}
                          className={`tx-cell ${colIdx % cellsPerBeat === 0 ? "is-beat" : ""} ${nowCell === cellIdx ? "is-now" : ""}`}
                        >
                          {TXALAPARTA_PLANK_ROLES.map((role) => {
                            const cellState = strikeMap.get(
                              `${role}:${plankCol.key}:${cellIdx}`,
                            );
                            return (
                              <button
                                key={role}
                                type="button"
                                className={`tx-half is-${role} ${cellState ? `is-${cellState}` : ""}`}
                                aria-pressed={cellState === "on"}
                                aria-label={`${TXALAPARTA_ROLE_LABELS[role]}, ${plankLabel(plankCol).toLowerCase()}, en el ${beatPositionLabel(cellIdx * q)}`}
                                onClick={() =>
                                  onToggle(cellIdx * q, {
                                    p: role,
                                    plank: plankCol.i,
                                    m: plankCol.m,
                                  })
                                }
                              >
                                <i />
                              </button>
                            );
                          })}
                        </span>
                      );
                    },
                  )}
                </Fragment>
              ))}
              {rhythm.feet && (
                <>
                  <span className="tx-plank is-feet">
                    <b>Pies</b>
                    <span>claqué</span>
                  </span>
                  {Array.from(
                    {
                      length: rowCells,
                    },
                    (m, feetCol) => {
                      const feetCell = firstCell + feetCol;
                      const feetHit = strikeMap.get(`pi:${feetCell}`);
                      return (
                        <button
                          key={`pi-${feetCol}`}
                          type="button"
                          className={`tx-cell tx-feet ${feetCol % cellsPerBeat === 0 ? "is-beat" : ""} ${nowCell === feetCell ? "is-now" : ""} ${feetHit ? (feetHit.muted ? "is-muted" : "is-on") : ""}`}
                          aria-label={`Pies en el ${beatPositionLabel(feetCell * q)}: ${feetHit ? feetName(feetHit.plank) : "nada"}. Toca para cambiar.`}
                          onClick={() => onCycleFeet(feetCell * q)}
                        >
                          {feetHit ? FOOT_STRIKES[feetHit.plank].short : ""}
                        </button>
                      );
                    },
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
