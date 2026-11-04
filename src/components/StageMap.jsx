// Mapa del escenario: block tabs, draggable dancer dots, formation presets, transition collision check.
import { useRef, useState } from "react";
import { DANCERS } from "../data/dancers.js";
import { FORMATION_PRESETS } from "../data/formations.js";
import { findDancerById } from "../lib/dancers.js";
import { clamp } from "../lib/math.js";
import {
  applyFormationPreset,
  detectStageConflicts,
  stageDepthLabel,
  stageNumber,
  stageNumberLabel,
  stageSideLabel,
} from "../lib/stage.js";
import { Icon } from "./ui/Icon.jsx";
function AudienceRuler({ flip }) {
  return (
    <div
      className="aud"
      title="Derecha e izquierda de la bailarina mirando al público"
    >
      <div className="aud-nums" aria-hidden="true">
        {[8, 6, 4, 2, 0, 2, 4, 6, 8].map((num, idx) => (
          <span
            key={idx}
            style={{
              left: `${idx * 12.5}%`,
            }}
            className={num === 0 ? "is-zero" : ""}
          >
            {num}
          </span>
        ))}
      </div>
      <div className="aud-row">
        <span>{flip ? "◂ tu izquierda" : "◂ su derecha"}</span>
        <span className="aud-title">Público · espejo del estudio</span>
        <span>{flip ? "tu derecha ▸" : "su izquierda ▸"}</span>
      </div>
    </div>
  );
}
export function StageMap({
  choreo,
  ranges,
  blockId,
  setBlockId,
  setPos,
  setFormation,
  copyPrev,
  mode,
  me,
  view,
  setView,
}) {
  const stageRef = useRef(null);
  const [dragId, setDragId] = useState(null);
  const blocks = choreo.blocks;
  const fromStage = view === "escenario";
  const isCoreo = mode === "coreo";
  const myId = isCoreo ? null : me;
  const blockIdx = Math.max(
    0,
    blocks.findIndex((candidate) => candidate.id === blockId),
  );
  const block = blocks[blockIdx];
  const formation = choreo.formations[block.id];
  const prevBlock = blockIdx > 0 ? blocks[blockIdx - 1] : null;
  const prevFormation = prevBlock ? choreo.formations[prevBlock.id] : null;
  const toView = ([px, _]) => (fromStage ? [100 - px, 100 - _] : [px, _]);
  const startDrag = (downEvent, dragTarget) => {
    if (isCoreo) {
      downEvent.preventDefault();
      downEvent.currentTarget.setPointerCapture(downEvent.pointerId);
      setDragId(dragTarget);
    }
  };
  const moveDrag = (moveEvent, movingId) => {
    if (dragId !== movingId || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const rawX = clamp(
      ((moveEvent.clientX - rect.left) / rect.width) * 100,
      4,
      96,
    );
    const rawY = clamp(
      ((moveEvent.clientY - rect.top) / rect.height) * 100,
      5,
      95,
    );
    const [stageX, stageY] = fromStage
      ? [100 - rawX, 100 - rawY]
      : [rawX, rawY];
    setPos(block.id, movingId, [
      Math.round(stageX * 2) / 2,
      Math.round(stageY * 2) / 2,
    ]);
  };
  const endDrag = () => setDragId(null);
  const nudgeWithKeys = (keyEvent, nudgedId) => {
    if (!isCoreo) return;
    const delta = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[keyEvent.key];
    if (!delta) return;
    keyEvent.preventDefault();
    const step = keyEvent.shiftKey ? 5 : 1;
    const dx = (fromStage ? -delta[0] : delta[0]) * step;
    const me = (fromStage ? -delta[1] : delta[1]) * step;
    const [curX, curY] = formation[nudgedId];
    setPos(block.id, nudgedId, [
      clamp(curX + dx, 4, 96),
      clamp(curY + me, 5, 95),
    ]);
  };
  const myPos = myId ? formation[myId] : null;
  const myPrevPos = myId && prevFormation ? prevFormation[myId] : null;
  const clashes = isCoreo ? detectStageConflicts(prevFormation, formation) : [];
  const clashIds = new Set(clashes.flatMap((clash) => [clash.a, clash.b]));
  return (
    <div className="panel flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="f-label">Mapa del escenario</p>
          <h2 className="f-display mt-1 text-[1.75rem] uppercase leading-none [text-wrap:balance]">
            {block.name}{" "}
            <span className="text-muted">
              {"· "}
              {block.formation}
            </span>
          </h2>
        </div>
        <div
          className="seg seg-sm"
          role="radiogroup"
          aria-label="Punto de vista del mapa"
        >
          {[
            ["publico", "Desde el público"],
            ["escenario", "Desde el escenario"],
          ].map(([viewId, viewLabel]) => (
            <button
              key={viewId}
              type="button"
              role="radio"
              aria-checked={view === viewId}
              className="seg-btn"
              onClick={() => setView(viewId)}
            >
              {viewLabel}
            </button>
          ))}
        </div>
      </div>
      <div className="tabs" role="tablist" aria-label="Bloques">
        {blocks.map((tabBlock) => (
          <button
            key={tabBlock.id}
            type="button"
            role="tab"
            aria-selected={tabBlock.id === block.id}
            className="tab"
            onClick={() => setBlockId(tabBlock.id)}
          >
            <span className="f-display text-[1.35rem] leading-none">
              {ranges[tabBlock.id].n}
            </span>
            <span className="tab-name">{tabBlock.name}</span>
            {tabBlock.isNew && (
              <span className="tab-new" title="Nuevo en la última clase" />
            )}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        {fromStage && <AudienceRuler flip={true} />}
        <div ref={stageRef} className={`stage ${isCoreo ? "is-edit" : ""}`}>
          <span className="stage-center" aria-hidden="true" />
          <span className={`stage-upstage ${fromStage ? "is-bottom" : ""}`}>
            Fondo
          </span>
          {isCoreo && prevFormation && (
            <svg
              className="stage-paths"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {DANCERS.map((pathDancer) => {
                if (!prevFormation[pathDancer.id] || !formation[pathDancer.id])
                  return null;
                const [x1, y1] = toView(prevFormation[pathDancer.id]);
                const [x2, y2] = toView(formation[pathDancer.id]);
                return Math.abs(x1 - x2) + Math.abs(y1 - y2) < 0.5 ? null : (
                  <line
                    key={pathDancer.id}
                    className={clashIds.has(pathDancer.id) ? "is-bad" : ""}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                  />
                );
              })}
            </svg>
          )}
          {myPos && myPrevPos && (
            <>
              <svg
                className="stage-path"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line
                  x1={toView(myPrevPos)[0]}
                  y1={toView(myPrevPos)[1]}
                  x2={toView(myPos)[0]}
                  y2={toView(myPos)[1]}
                />
              </svg>
              <span
                className="stage-ghost"
                style={{
                  left: `${toView(myPrevPos)[0]}%`,
                  top: `${toView(myPrevPos)[1]}%`,
                }}
                aria-hidden="true"
              />
            </>
          )}
          {DANCERS.map((dancer) => {
            if (!formation[dancer.id]) return null;
            const [dotX, dotY] = toView(formation[dancer.id]);
            const isMine = myId === dancer.id;
            const dotClass = [
              "dot",
              isCoreo ? "is-edit" : "",
              dragId === dancer.id ? "is-drag" : "",
              myId ? (isMine ? "is-me" : "is-dim") : "",
            ].join(" ");
            return (
              <button
                key={dancer.id}
                type="button"
                className={dotClass}
                style={{
                  left: `${dotX}%`,
                  top: `${dotY}%`,
                  "--tape": dancer.tape,
                  "--tape-ink": dancer.ink,
                }}
                onPointerDown={(pointerDown) =>
                  startDrag(pointerDown, dancer.id)
                }
                onPointerMove={(pointerMove) =>
                  moveDrag(pointerMove, dancer.id)
                }
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={(keyDown) => nudgeWithKeys(keyDown, dancer.id)}
                tabIndex={isCoreo || isMine ? 0 : -1}
                aria-label={`${dancer.name}: número ${stageNumberLabel(formation[dancer.id])}, ${stageDepthLabel(formation[dancer.id][1])}`}
              >
                <span className="disc">{dancer.name[0]}</span>
                <span className="name">{dancer.name}</span>
              </button>
            );
          })}
        </div>
        {!fromStage && <AudienceRuler />}
      </div>
      {isCoreo ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="min-w-0 flex-1 text-[13px] text-muted">
              {dragId
                ? `${findDancerById(dragId).name} → número ${stageNumberLabel(formation[dragId])}, ${stageDepthLabel(formation[dragId][1])}`
                : "Arrastra los círculos para colocar a cada bailarina. Con el teclado: tabulador y flechas."}
            </p>
            {prevBlock && (
              <button
                type="button"
                className="btn"
                onClick={() => copyPrev(block.id)}
              >
                <Icon name="copy" />
                {"Copiar de "}
                {prevBlock.name}
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="f-label">Plantillas</p>
            <div className="flex flex-wrap gap-1.5">
              {FORMATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="btn btn-xs"
                  onClick={() =>
                    setFormation(
                      block.id,
                      applyFormationPreset(preset.id, formation),
                      preset.name,
                    )
                  }
                >
                  {preset.name}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-muted">
              Cada una se coloca en el hueco más cercano por su lado, para que
              nadie cruce el escenario entero.
            </p>
          </div>
          {prevBlock && (
            <div
              className={`stage-check ${clashes.length ? "is-bad" : "is-ok"}`}
              role="status"
            >
              {clashes.length ? (
                <>
                  <p className="font-semibold">
                    {clashes.length === 1
                      ? "Ojo en la transición desde "
                      : `${clashes.length} avisos en la transición desde `}
                    {prevBlock.name}:
                  </p>
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {clashes.map((clashItem, clashIdx) => (
                      <li key={clashIdx}>
                        {findDancerById(clashItem.a).name}
                        {" y "}
                        {findDancerById(clashItem.b).name}{" "}
                        {clashItem.kind === "cruce"
                          ? "se cruzan muy cerca por el camino."
                          : "acaban demasiado juntas."}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-[12px] opacity-80">
                    Las líneas rojas son sus recorridos. Separa sus marcas o
                    cambia el orden.
                  </p>
                </>
              ) : (
                <p>
                  <Icon name="check" size={14} />
                  {" Nadie choca en la transición desde "}
                  {prevBlock.name}.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <MyStageMark
          block={block}
          pos={myPos}
          prevBlock={prevBlock}
          prevPos={myPrevPos}
        />
      )}
    </div>
  );
}
function MyStageMark({ block, pos, prevBlock, prevPos }) {
  if (!pos) return null;
  const markNum = stageNumber(pos[0]);
  const markSide = stageSideLabel(pos[0]);
  return (
    <div className="mark">
      <div className="mark-num" aria-hidden="true">
        <span className="f-display">{markNum}</span>
        <span className="mark-side">{markSide}</span>
      </div>
      <div className="min-w-0">
        <p className="f-label">
          {"Tu marca en "}
          {block.name}
        </p>
        <p className="mt-1 text-[15px] font-semibold leading-snug text-ink">
          {markNum === 0
            ? "Número 0, en el centro"
            : `Número ${markNum} a tu ${markSide}`}
          {", "}
          {stageDepthLabel(pos[1])}.
        </p>
        <p className="mt-0.5 text-[13px] text-muted">
          {prevPos
            ? `Vienes del ${stageNumberLabel(prevPos)} en ${prevBlock.name}; la línea discontinua es tu recorrido.`
            : "Es tu marca de inicio en esta coreografía."}
        </p>
      </div>
    </div>
  );
}
