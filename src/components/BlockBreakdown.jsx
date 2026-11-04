// Desglose por bloques: list of block cards with total ochos, duration and clip count.
import { useEffect, useRef, useState } from "react";
import { CLIP_ANGLE_LABELS } from "../data/clips.js";
import { DANCERS } from "../data/dancers.js";
import {
  choreoDurationSec,
  clipDurationSeconds,
  countEights,
  formatMinSec,
} from "../lib/time.js";
import { findDancerById } from "../lib/dancers.js";
import { formatClockTenths } from "../lib/format.js";
import { prefersReducedMotion } from "../lib/dom.js";
import { clamp } from "../lib/math.js";
import { ClipThumbnailGlyph } from "./ui/ClipThumbnailGlyph.jsx";
import { ConfirmButton } from "./ui/ConfirmButton.jsx";
import { Icon } from "./ui/Icon.jsx";
export function BlockBreakdown(props) {
  const { choreo, ranges, clips, mode, onAddBlock } = props;
  const isCoreo = mode === "coreo";
  // A block added from here opens straight in the editor, with its name selected.
  const [justAddedId, setJustAddedId] = useState(null);
  return (
    <div className="panel">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 pb-2 pt-4">
        <div>
          <p className="f-label">Desglose por bloques</p>
          <h2 className="f-display mt-1 text-[1.75rem] uppercase leading-none">
            Cuentas de 8
          </h2>
        </div>
        <p className="font-mono text-[12px] text-muted">
          {countEights(choreo.blocks)}
          {" ochos · "}
          {formatMinSec(choreoDurationSec(choreo))}
          {" · "}
          {clips.length}
          {" vídeos de pasos"}
        </p>
      </div>
      <div className="flex flex-col">
        {choreo.blocks.map((block) => (
          <BlockCard
            key={block.id}
            b={block}
            range={ranges[block.id]}
            {...props}
            autoEdit={block.id === justAddedId}
            blockClips={clips.filter((clip) => clip.block === block.id)}
            music={props.music.find((track) => track.block === block.id)}
          />
        ))}
      </div>
      {isCoreo && (
        <div className="border-t border-line px-4 py-4">
          <button
            type="button"
            className="btn"
            onClick={() => setJustAddedId(onAddBlock())}
          >
            <span aria-hidden="true">+</span>
            {" Añadir bloque"}
          </button>
        </div>
      )}
    </div>
  );
}
function BlockClipRow({
  c: clip,
  playingNow,
  isCoreo,
  wasSeen,
  onPlay,
  toggleNew,
  setAngle,
  removeUpload,
  onRemoveLink,
  hardOn,
  hardN,
  onToggleHard,
}) {
  const durationSec = clip.type === "upload" ? null : clipDurationSeconds(clip);
  const isMusic = clip.type === "music";
  return (
    <li
      className={`clip ${playingNow ? "is-playing" : ""} ${isMusic ? "is-music" : ""}`}
    >
      <button
        type="button"
        className="clip-main"
        onClick={() => onPlay(clip.id)}
      >
        <span
          className={`thumb thumb-${clip.type === "upload" ? "subido" : clip.type === "stage" ? "escenario" : isMusic ? "musica" : "pies"}`}
        >
          <ClipThumbnailGlyph
            angle={
              clip.type === "upload"
                ? "subido"
                : clip.type === "stage"
                  ? "escenario"
                  : isMusic
                    ? "musica"
                    : "pies"
            }
          />
          {durationSec != null && (
            <span className="thumb-dur">
              {formatClockTenths(durationSec).replace(/,\d$/, "")}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold leading-snug text-ink">
            {isMusic
              ? clip.rhythm
                ? `Practicar con el ritmo «${clip.rhythm.name}»`
                : "Practicar el bloque con música"
              : clip.title}
          </span>
          <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.05em] text-muted">
            {clip.linked ? "Del banco · " : ""}
            {clip.rhythm
              ? "Txalaparta"
              : CLIP_ANGLE_LABELS[clip.angle] || "Vídeo"}
            {clip.bpm ? ` · ${clip.bpm} bpm` : ""}
            {clip.acapella === true ? " · a capella" : ""}
            {playingNow ? " · en el reproductor" : ""}
          </span>
        </span>
        {!isCoreo && wasSeen && (
          <span className="seen" title="Ya lo has reproducido">
            <Icon name="check" size={14} />
          </span>
        )}
        {!isCoreo && clip.isNew && <span className="tag-new">Nuevo</span>}
        {isCoreo && hardN > 0 && (
          <span className="tag-hard">
            {"Les cuesta a "}
            {hardN}
          </span>
        )}
      </button>
      {!isCoreo && !isMusic && onToggleHard && (
        <div className="clip-tools">
          <button
            type="button"
            className={`btn btn-xs btn-hard ${hardOn ? "is-on" : ""}`}
            aria-pressed={!!hardOn}
            onClick={() => onToggleHard(clip.id)}
            title="Avisa a la profe de que este paso te cuesta"
          >
            <Icon name="flag" size={13} />
            Me cuesta
          </button>
        </div>
      )}
      {isCoreo && !isMusic && (
        <div className="clip-tools">
          <button
            type="button"
            className={`btn btn-xs btn-new ${clip.isNew ? "is-on" : ""}`}
            aria-pressed={clip.isNew}
            onClick={() => toggleNew(clip.id)}
          >
            Nuevo
          </button>
          {(clip.type === "feet" || clip.type === "upload") && (
            <div
              className="seg seg-xs"
              role="radiogroup"
              aria-label="Ángulo de la cámara"
            >
              {[
                ["frente", "Frente"],
                ["lado", "Lado"],
              ].map(([angleId, angleLabel]) => (
                <button
                  key={angleId}
                  type="button"
                  role="radio"
                  aria-checked={clip.angle === angleId}
                  className="seg-btn"
                  onClick={() => setAngle(clip.srcId || clip.id, angleId)}
                >
                  {angleLabel}
                </button>
              ))}
            </div>
          )}
          {clip.linked ? (
            <button
              type="button"
              className="btn btn-xs"
              onClick={() => onRemoveLink(clip.id)}
            >
              Quitar
            </button>
          ) : (
            clip.type === "upload" && (
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => removeUpload(clip.id)}
              >
                Quitar
              </button>
            )
          )}
        </div>
      )}
    </li>
  );
}
const draftFromBlock = (block) => ({
  name: block.name,
  formation: block.formation,
  len: block.len,
  notes: block.notes,
  personal: { ...(block.personal || {}) },
  isNew: block.isNew,
});
function BlockCard({
  choreo,
  b: block,
  range,
  blockClips,
  music,
  clipId,
  blockId,
  onPlay,
  onSelect,
  mode,
  me: myDancerId,
  seen,
  updateBlock,
  toggleNew,
  setAngle,
  onUpload,
  removeUpload,
  rhythms,
  onOpenRhythm,
  bank,
  onAddLink,
  onRemoveLink,
  hardMine,
  hardCount,
  onToggleHard,
  autoEdit,
  onRemoveBlock,
  onMoveBlock,
}) {
  const [bankOpen, setBankOpen] = useState(false);
  const [bankPick, setBankPick] = useState("");
  const usedClipIds = new Set(
    blockClips.map((blockClip) => blockClip.srcId || blockClip.id),
  );
  const bankChoices = (bank || []).filter(
    (entry) => !usedClipIds.has(entry.clip.id),
  );
  const rhythm =
    block.rhythmId && rhythms
      ? rhythms.find((candidate) => candidate.id === block.rhythmId)
      : null;
  const [draft, setDraft] = useState(() =>
    autoEdit ? draftFromBlock(block) : null,
  );
  const cardRef = useRef(null);
  const nameRef = useRef(null);
  useEffect(() => {
    if (!autoEdit) return;
    cardRef.current?.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    nameRef.current?.focus({ preventScroll: true });
    nameRef.current?.select();
  }, []);
  const isCoreo = mode === "coreo";
  // After moving, keep the pressed button on screen: the whole card changes place.
  const moveAndFollow = (button, step) => {
    onMoveBlock(block.id, step);
    requestAnimationFrame(() =>
      button.scrollIntoView({
        block: "center",
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      }),
    );
  };
  const blockIndex = choreo.blocks.findIndex(
    (candidate) => candidate.id === block.id,
  );
  const myNote = !isCoreo && block.personal ? block.personal[myDancerId] : null;
  const personalNotes = Object.entries(block.personal || {}).filter(
    ([, noteText]) => noteText,
  );
  const isActive = block.id === blockId;
  const startEdit = () => setDraft(draftFromBlock(block));
  const saveEdit = () => {
    const cleanPersonal = Object.fromEntries(
      Object.entries(draft.personal).filter(
        ([, noteVal]) => noteVal && noteVal.trim(),
      ),
    );
    updateBlock(block.id, {
      name: draft.name.trim() || block.name,
      formation: draft.formation.trim() || block.formation,
      len: clamp(Math.round(Number(draft.len) || block.len), 1, 16),
      notes: draft.notes,
      personal: cleanPersonal,
      isNew: draft.isNew,
    });
    setDraft(null);
  };
  return (
    <article ref={cardRef} className={`blk ${isActive ? "is-active" : ""}`}>
      <button
        type="button"
        className="block-head"
        onClick={() => onSelect(block.id)}
        aria-label={`Ver la formación de ${block.name} en el mapa`}
      >
        <span className="block-n f-display">{range.n}</span>
        <span className="min-w-0 flex-1">
          <span className="f-display block text-[1.6rem] uppercase leading-none">
            {block.name}
          </span>
          <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
            {range.start === range.end
              ? `Ocho ${range.start}`
              : `Ochos ${range.start}–${range.end}`}
            {" · "}
            {formatMinSec(((range.start - 1) * 8 * 60) / choreo.bpm)}–
            {formatMinSec((range.end * 8 * 60) / choreo.bpm)}
            {" · "}
            {block.formation}
          </span>
        </span>
        <span className="flex flex-wrap items-center justify-end gap-1.5">
          {!block.done && <span className="tag-todo">Por montar</span>}
          {block.isNew && (
            <span className="tag-new">Nuevo en la última clase</span>
          )}
        </span>
      </button>
      <div className="block-body">
        {draft ? (
          <div className="flex flex-col gap-3">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_6rem]">
              <label
                className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
                htmlFor={`bn-${block.id}`}
              >
                Nombre del bloque
                <input
                  ref={nameRef}
                  id={`bn-${block.id}`}
                  className="field"
                  value={draft.name}
                  onChange={(ev) =>
                    setDraft({
                      ...draft,
                      name: ev.target.value,
                    })
                  }
                />
              </label>
              <label
                className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
                htmlFor={`bf-${block.id}`}
              >
                Formación
                <input
                  id={`bf-${block.id}`}
                  className="field"
                  value={draft.formation}
                  onChange={(ev) =>
                    setDraft({
                      ...draft,
                      formation: ev.target.value,
                    })
                  }
                />
              </label>
              <label
                className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
                htmlFor={`bl-${block.id}`}
              >
                Ochos
                <input
                  id={`bl-${block.id}`}
                  type="number"
                  min="1"
                  max="16"
                  className="field"
                  value={draft.len}
                  onChange={(ev) =>
                    setDraft({
                      ...draft,
                      len: ev.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="f-label" htmlFor={`notes-${block.id}`}>
                Notas para todas
              </label>
              <textarea
                id={`notes-${block.id}`}
                rows={4}
                className="field note-field"
                value={draft.notes}
                onChange={(ev) =>
                  setDraft({
                    ...draft,
                    notes: ev.target.value,
                  })
                }
              />
            </div>
            <fieldset className="flex flex-col gap-1.5">
              <legend className="f-label mb-1.5">
                Notas personales (cada una ve solo la suya)
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {DANCERS.map((dancer) => (
                  <label
                    key={dancer.id}
                    className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
                    htmlFor={`pn-${block.id}-${dancer.id}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="tape-dot"
                        style={{
                          background: dancer.tape,
                        }}
                      />
                      {dancer.name}
                    </span>
                    <input
                      id={`pn-${block.id}-${dancer.id}`}
                      className="field"
                      value={draft.personal[dancer.id] || ""}
                      placeholder="Sin nota"
                      onChange={(ev) =>
                        setDraft({
                          ...draft,
                          personal: {
                            ...draft.personal,
                            [dancer.id]: ev.target.value,
                          },
                        })
                      }
                    />
                  </label>
                ))}
              </div>
            </fieldset>
            <label
              className="flex items-center gap-2 text-[13px] text-ink"
              htmlFor={`new-${block.id}`}
            >
              <input
                id={`new-${block.id}`}
                type="checkbox"
                className="h-4 w-4 accent-[var(--accent)]"
                checked={draft.isNew}
                onChange={(ev) =>
                  setDraft({
                    ...draft,
                    isNew: ev.target.checked,
                  })
                }
              />
              Marcar el bloque como «Nuevo en la última clase»
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveEdit}
              >
                Guardar
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setDraft(null)}
              >
                Cancelar
              </button>
              {onMoveBlock && (
                <span
                  className="flex gap-1"
                  role="group"
                  aria-label="Orden del bloque"
                >
                  <button
                    type="button"
                    className="btn"
                    disabled={blockIndex === 0}
                    onClick={(ev) => moveAndFollow(ev.currentTarget, -1)}
                    aria-label={`Mover ${block.name} antes`}
                    title="Mover antes"
                  >
                    <span aria-hidden="true">↑</span>
                  </button>
                  <button
                    type="button"
                    className="btn"
                    disabled={blockIndex === choreo.blocks.length - 1}
                    onClick={(ev) => moveAndFollow(ev.currentTarget, 1)}
                    aria-label={`Mover ${block.name} después`}
                    title="Mover después"
                  >
                    <span aria-hidden="true">↓</span>
                  </button>
                </span>
              )}
              {onRemoveBlock && (
                <ConfirmButton
                  className="ml-auto"
                  label="Quitar bloque"
                  confirmLabel="Pulsa otra vez para quitarlo"
                  onConfirm={() => onRemoveBlock(block.id)}
                >
                  <Icon name="x" size={14} />
                </ConfirmButton>
              )}
            </div>
          </div>
        ) : (
          <>
            <div>
              <p className="f-label">Notas de la coreógrafa</p>
              <p className="note mt-1">
                {block.notes || (
                  <span className="text-muted">Sin notas todavía.</span>
                )}
              </p>
            </div>
            {myNote && (
              <div className="foryou">
                <p className="f-label foryou-label">
                  {"Para ti, "}
                  {findDancerById(myDancerId).name}
                </p>
                <p className="mt-0.5 text-[14px] leading-snug text-ink">
                  {myNote}
                </p>
              </div>
            )}
            {isCoreo && personalNotes.length > 0 && (
              <ul className="flex flex-col gap-1 text-[13px]">
                {personalNotes.map(([noteDancerId, noteBody]) => (
                  <li key={noteDancerId} className="flex gap-2">
                    <span className="flex shrink-0 items-center gap-1.5 font-semibold text-ink">
                      <span
                        className="tape-dot"
                        style={{
                          background: findDancerById(noteDancerId).tape,
                        }}
                      />
                      {findDancerById(noteDancerId).name}
                    </span>
                    <span className="min-w-0 text-muted">{noteBody}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {rhythm && !draft && (
          <div className="tx-link">
            <Icon name="txala" />
            <span className="min-w-0 flex-1 text-[14px] text-ink">
              {"Música de este bloque: ritmo de txalaparta "}
              <b className="font-semibold">«{rhythm.name}»</b>
            </span>
            <button
              type="button"
              className="btn btn-xs"
              onClick={() => onOpenRhythm(rhythm.id)}
            >
              Abrir en el taller
            </button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="f-label">Vídeos de pasos sueltos</p>
          <ul className="flex flex-col gap-1.5">
            {music && (
              <BlockClipRow
                c={music}
                playingNow={clipId === music.id}
                isCoreo={isCoreo}
                wasSeen={false}
                onPlay={onPlay}
              />
            )}
            {blockClips.map((clip) => (
              <BlockClipRow
                key={clip.id}
                c={clip}
                playingNow={clipId === clip.id}
                isCoreo={isCoreo}
                wasSeen={!isCoreo && seen.includes(clip.id)}
                onPlay={onPlay}
                toggleNew={toggleNew}
                setAngle={setAngle}
                removeUpload={removeUpload}
                onRemoveLink={onRemoveLink}
                hardOn={(hardMine || []).includes(clip.id)}
                hardN={(hardCount || {})[clip.id] || 0}
                onToggleHard={onToggleHard}
              />
            ))}
          </ul>
          {blockClips.length === 0 && (
            <p className="text-[13px] text-muted">
              Aún no hay vídeos de pasos en este bloque.
            </p>
          )}
        </div>
        {isCoreo && !draft && (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn" onClick={startEdit}>
                <Icon name="edit" />
                Editar bloque y notas
              </button>
              <button
                type="button"
                className="btn"
                aria-pressed={!!block.done}
                onClick={() =>
                  updateBlock(block.id, {
                    done: !block.done,
                  })
                }
              >
                <Icon name="check" />
                {block.done ? "Montado" : "Marcar como montado"}
              </button>
              <button
                type="button"
                className="btn"
                aria-pressed={bankOpen}
                onClick={() => setBankOpen((wasOpen) => !wasOpen)}
                disabled={!bankChoices.length && !bankOpen}
              >
                <Icon name="copy" />
                Añadir paso del banco
              </button>
              <label className="btn btn-file">
                <Icon name="upload" />
                Subir vídeo de un paso
                <input
                  type="file"
                  accept="video/*"
                  className="sr-only"
                  onChange={(ev) => {
                    const videoFile = ev.target.files && ev.target.files[0];
                    if (videoFile) {
                      onUpload(block.id, videoFile);
                    }
                    ev.target.value = "";
                  }}
                />
              </label>
            </div>
            {bankOpen && (
              <div className="bank-pick">
                <label
                  className="flex min-w-0 flex-1 flex-col gap-1 text-[13px] font-semibold text-ink"
                  htmlFor={`bank-${block.id}`}
                >
                  Paso del banco
                  <select
                    id={`bank-${block.id}`}
                    className="field"
                    value={
                      bankPick || (bankChoices[0] ? bankChoices[0].clip.id : "")
                    }
                    onChange={(ev) => setBankPick(ev.target.value)}
                  >
                    {bankChoices.map((choice) => (
                      <option key={choice.clip.id} value={choice.clip.id}>
                        {choice.clip.title}
                        {" ("}
                        {choice.origin.choreo.title})
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="btn btn-primary self-end"
                  disabled={!bankChoices.length}
                  onClick={() => {
                    const pickedId =
                      bankPick || (bankChoices[0] && bankChoices[0].clip.id);
                    if (pickedId) {
                      onAddLink(block.id, pickedId);
                    }
                    setBankPick("");
                    setBankOpen(false);
                  }}
                >
                  Añadir
                </button>
              </div>
            )}
            <p className="text-[12px] text-muted">
              Mejor graba los pasos tú misma. Si sale alguna alumna, pide antes
              permiso a su familia. Un paso del banco usa el mismo vídeo en
              todas las coreografías.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
