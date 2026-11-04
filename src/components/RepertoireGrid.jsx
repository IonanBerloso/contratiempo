// Repertoire section: grid of choreography cards with status, novelties count, days to show and block/eight/bpm summary.
import { useState } from "react";
import { DANCERS } from "../data/dancers.js";
import { listNewForDancer } from "../lib/choreography.js";
import { countEights, daysUntil } from "../lib/time.js";
function RepertoireMiniStage({ positions, highlight }) {
  return (
    <span className="mini-stage" aria-hidden="true">
      {DANCERS.map((dancer) => {
        const pos = positions[dancer.id];
        if (!pos) return null;
        const isMe = highlight === dancer.id;
        return (
          <i
            key={dancer.id}
            className={isMe ? "is-me" : highlight ? "is-dim" : ""}
            style={{
              left: `${pos[0]}%`,
              top: `${pos[1]}%`,
              background: isMe || highlight ? undefined : dancer.tape,
            }}
          />
        );
      })}
    </span>
  );
}
export function RepertoireGrid({
  choreos,
  clipsById,
  mode,
  me,
  onOpen,
  onCreate,
}) {
  const isCoreo = mode === "coreo";
  const visibleChoreos = isCoreo
    ? choreos
    : choreos.filter((listed) => listed.status !== "Borrador");
  return (
    <section className="flex flex-col gap-3" aria-label="Repertorio">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="f-display text-[1.9rem] uppercase leading-none">
          Repertorio
        </h2>
        <p className="font-mono text-[12px] text-muted">
          {visibleChoreos.length}
          {" coreografías"}
          {isCoreo ? " · las de borrador no las ven las bailarinas" : ""}
        </p>
      </div>
      <div className="rep-grid">
        {visibleChoreos.map((choreo) => {
          const clips = clipsById[choreo.id] || [];
          const newCount = isCoreo
            ? choreo.blocks.filter((newBlock) => newBlock.isNew).length +
              clips.filter((newClip) => newClip.isNew).length
            : listNewForDancer(choreo, clips, me).length;
          return (
            <button
              key={choreo.id}
              type="button"
              className="rep-card"
              onClick={() => onOpen(choreo.id)}
            >
              <RepertoireMiniStage
                positions={choreo.formations[choreo.blocks[0].id] || {}}
                highlight={isCoreo ? null : me}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5 p-3.5">
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    className={`status ${choreo.status === "Borrador" ? "is-draft" : ""}`}
                  >
                    {choreo.status}
                  </span>
                  {newCount > 0 && (
                    <span className="tag-new">
                      {newCount} {newCount === 1 ? "novedad" : "novedades"}
                    </span>
                  )}
                  {choreo.show && daysUntil(choreo.show.date) >= 0 && (
                    <span className="status is-show">
                      {"Función: "}
                      {daysUntil(choreo.show.date) === 0
                        ? "hoy"
                        : `en ${daysUntil(choreo.show.date)} ${daysUntil(choreo.show.date) === 1 ? "día" : "días"}`}
                    </span>
                  )}
                </span>
                <span className="f-display text-[1.7rem] uppercase leading-[0.95] text-ink [text-wrap:balance]">
                  {choreo.title}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                  {choreo.blocks.length}{" "}
                  {choreo.blocks.length === 1 ? "bloque" : "bloques"}
                  {" · "}
                  {countEights(choreo.blocks)}
                  {" ochos · "}
                  {choreo.bpm}
                  {" bpm"}
                </span>
              </span>
            </button>
          );
        })}
        {isCoreo && <NewChoreoCard onCreate={onCreate} />}
      </div>
    </section>
  );
}
function NewChoreoCard({ onCreate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [bpm, setBpm] = useState(120);
  return isOpen ? (
    <form
      className="rep-card rep-new is-form"
      onSubmit={(submitEvent) => {
        submitEvent.preventDefault();
        if (title.trim()) {
          onCreate(
            title.trim(),
            Math.max(40, Math.min(240, Number(bpm) || 120)),
          );
        }
      }}
    >
      <label
        className="flex w-full flex-col gap-1 text-[13px] font-semibold text-ink"
        htmlFor="new-title"
      >
        Título
        <input
          id="new-title"
          className="field"
          value={title}
          onChange={(titleEvent) => setTitle(titleEvent.target.value)}
          placeholder="Por ejemplo: Gala de primavera"
          autoFocus={true}
        />
      </label>
      <label
        className="flex w-full flex-col gap-1 text-[13px] font-semibold text-ink"
        htmlFor="new-bpm"
      >
        Tempo de la canción (bpm)
        <input
          id="new-bpm"
          type="number"
          min="40"
          max="240"
          className="field"
          value={bpm}
          onChange={(bpmEvent) => setBpm(bpmEvent.target.value)}
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!title.trim()}
        >
          Crear
        </button>
        <button type="button" className="btn" onClick={() => setIsOpen(false)}>
          Cancelar
        </button>
      </div>
    </form>
  ) : (
    <button
      type="button"
      className="rep-card rep-new"
      onClick={() => setIsOpen(true)}
    >
      <span className="rep-plus" aria-hidden="true">
        +
      </span>
      <span className="text-[15px] font-semibold text-ink">
        Nueva coreografía
      </span>
      <span className="text-[13px] text-muted">
        Empieza como borrador: las bailarinas no la ven hasta que la publiques.
      </span>
    </button>
  );
}
