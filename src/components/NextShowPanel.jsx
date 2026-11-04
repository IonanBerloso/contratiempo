// Próxima función: countdown, progress, max time check, full rehearsal / class mode buttons, show-day info, count sheet download.
import { useState } from "react";
import { DANCERS } from "../data/dancers.js";
import { saveFile, useClaudeHook } from "../lib/claude.js";
import { resizeImageToJpeg } from "../lib/images.js";
import {
  choreoDurationSec,
  daysUntil,
  formatMinSec,
  formatShortDate,
  parseMinSec,
} from "../lib/time.js";
import { Icon } from "./ui/Icon.jsx";
const EMPTY_LOGISTICS = {
  schedule: [],
  costume: "",
  notes: {},
  auth: {},
};
export function NextShowPanel({
  choreo,
  mode,
  me,
  onSave,
  onSaveLogistics,
  onFull,
  onClass,
  playingFull,
  countSheet,
}) {
  const isCoreo = mode === "coreo";
  const [showDraft, setShowDraft] = useState(null);
  const [logisticsOpen, setLogisticsOpen] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState(null);
  const show = choreo.show || null;
  const daysLeft = show ? daysUntil(show.date) : null;
  const doneCount = choreo.blocks.filter((blk) => blk.done).length;
  const blockCount = choreo.blocks.length;
  const donePct = blockCount ? Math.round((doneCount / blockCount) * 100) : 0;
  const logistics = choreo.logistics || null;
  const countdownText = show
    ? daysLeft < 0
      ? "La función ya pasó."
      : daysLeft === 0
        ? "¡La función es hoy!"
        : `${daysLeft === 1 ? "Falta 1 día" : `Faltan ${daysLeft} días`} para la función.`
    : isCoreo
      ? "Pon la fecha de la actuación para ver la cuenta atrás."
      : "Todavía no hay fecha de función.";
  const missingAuth = logistics
    ? DANCERS.filter((dancer) => !logistics.auth[dancer.id])
    : [];
  const durationSec = choreoDurationSec(choreo);
  const overMax =
    logistics && logistics.maxTime ? durationSec - logistics.maxTime : 0;
  const downloadCountSheet = async () => {
    const { filename, html } = countSheet();
    setDownloadMsg(await saveFile(filename, html));
  };
  const countSheetButton = (
    <button type="button" className="btn btn-xs" onClick={downloadCountSheet}>
      <Icon name="download" size={13} />
      Descargar hoja de cuentas
    </button>
  );
  return (
    <section
      className="panel show-panel"
      aria-label="Función y ensayo completo"
    >
      <div className="show-main">
        <div
          className={`show-days ${show && daysLeft != null && daysLeft >= 0 && daysLeft <= 14 ? "is-soon" : ""}`}
          aria-hidden="true"
        >
          <span className="f-display">
            {show && daysLeft != null && daysLeft >= 0 ? daysLeft : "—"}
          </span>
          <span className="show-unit">
            {show && daysLeft === 1 ? "día" : "días"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="f-label">
            {show ? `${show.name} · ${formatShortDate(show.date)}` : "Función"}
          </p>
          <p className="mt-1 text-[16px] font-semibold leading-snug text-ink">
            {countdownText}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="progress" aria-hidden="true">
              <span
                style={{
                  width: `${donePct}%`,
                }}
              />
            </div>
            <span className="font-mono text-[12px] tabular-nums text-ink">
              {doneCount}
              {" de "}
              {blockCount}{" "}
              {blockCount === 1 ? "bloque montado" : "bloques montados"}
              {" · dura "}
              {formatMinSec(durationSec)}
            </span>
          </div>
          {logistics && logistics.maxTime ? (
            <p
              className={`mt-1.5 text-[12.5px] font-semibold ${overMax > 0 ? "text-[color:var(--warn)]" : "text-[color:var(--ok)]"}`}
            >
              {overMax > 0
                ? `Se pasa ${formatMinSec(overMax)} del máximo de la función (${formatMinSec(logistics.maxTime)}).`
                : `Cabe en el máximo de la función (${formatMinSec(logistics.maxTime)}); sobran ${formatMinSec(-overMax)}.`}
            </p>
          ) : null}
        </div>
        <div className="show-ctas">
          <button
            type="button"
            className="btn btn-primary btn-lg show-cta"
            onClick={onFull}
            aria-pressed={playingFull}
          >
            <Icon name="play" />
            Ensayar entera
          </button>
          <button
            type="button"
            className="btn show-cta"
            onClick={onClass}
            title="Pantalla grande para proyectar en clase o verla en la tele"
          >
            <Icon name="expand" />
            Modo clase
          </button>
        </div>
      </div>
      {choreo.week && !showDraft && (
        <p className="show-week">
          <span className="f-label">Esta semana</span>
          <span>{choreo.week}</span>
        </p>
      )}
      {!isCoreo &&
        logistics &&
        (logistics.schedule.length > 0 ||
          logistics.costume ||
          (logistics.photos && logistics.photos.length) ||
          logistics.notes[me] ||
          me) && (
          <div className="show-day">
            <p className="f-label">El día de la función</p>
            {logistics.schedule.length > 0 && (
              <ul className="show-sched">
                {logistics.schedule.map((slot, slotIdx) => (
                  <li key={slotIdx}>
                    <b className="font-mono tabular-nums">{slot.time}</b>{" "}
                    {slot.what}
                  </li>
                ))}
              </ul>
            )}
            {logistics.costume && (
              <p className="text-[14px] text-ink">
                <b className="font-semibold">Vestuario:</b> {logistics.costume}
              </p>
            )}
            {logistics.photos && logistics.photos.length > 0 && (
              <CostumePhotoGallery photos={logistics.photos} />
            )}
            {logistics.notes[me] && (
              <p className="text-[14px] text-ink">
                <b className="font-semibold">Para ti:</b> {logistics.notes[me]}
              </p>
            )}
            {me && (
              <p
                className={`text-[13px] font-semibold ${logistics.auth[me] ? "text-[color:var(--ok)]" : "text-[color:var(--warn)]"}`}
              >
                {logistics.auth[me]
                  ? "Tu familia ya ha firmado la autorización."
                  : "Falta la autorización de tu familia: recuérdaselo."}
              </p>
            )}
          </div>
        )}
      {isCoreo && !showDraft && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-xs"
            onClick={() =>
              setShowDraft({
                name: show ? show.name : "",
                date: show ? show.date : "",
                week: choreo.week || "",
              })
            }
          >
            <Icon name="edit" size={13} />
            {show
              ? "Editar función y plan de la semana"
              : "Poner fecha de función"}
          </button>
          <button
            type="button"
            className="btn btn-xs"
            aria-pressed={logisticsOpen}
            onClick={() => setLogisticsOpen((wasOpen) => !wasOpen)}
          >
            <Icon name="check" size={13} />
            Logística
            {logistics && missingAuth.length
              ? ` · faltan ${missingAuth.length} autorizaciones`
              : ""}
          </button>
          {countSheetButton}
        </div>
      )}
      {!isCoreo && <div>{countSheetButton}</div>}
      {downloadMsg && (
        <p className="text-[13px] font-semibold text-ink" role="status">
          {downloadMsg}
        </p>
      )}
      {showDraft && (
        <form
          className="flex flex-col gap-3"
          onSubmit={(ev) => {
            ev.preventDefault();
            onSave(
              showDraft.date
                ? {
                    name: showDraft.name.trim() || "Función",
                    date: showDraft.date,
                  }
                : null,
              showDraft.week.trim(),
            );
            setShowDraft(null);
          }}
        >
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <label
              className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
              htmlFor={`show-name-${choreo.id}`}
            >
              Nombre de la función
              <input
                id={`show-name-${choreo.id}`}
                className="field"
                value={showDraft.name}
                placeholder="Por ejemplo: Festival de Navidad"
                onChange={(ev) =>
                  setShowDraft({
                    ...showDraft,
                    name: ev.target.value,
                  })
                }
              />
            </label>
            <label
              className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
              htmlFor={`show-date-${choreo.id}`}
            >
              Fecha
              <input
                id={`show-date-${choreo.id}`}
                type="date"
                className="field"
                value={showDraft.date}
                onChange={(ev) =>
                  setShowDraft({
                    ...showDraft,
                    date: ev.target.value,
                  })
                }
              />
            </label>
          </div>
          <label
            className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
            htmlFor={`show-week-${choreo.id}`}
          >
            Plan de esta semana (lo ven las bailarinas)
            <textarea
              id={`show-week-${choreo.id}`}
              rows={2}
              className="field"
              value={showDraft.week}
              placeholder="Qué repasar en casa antes de la próxima clase"
              onChange={(ev) =>
                setShowDraft({
                  ...showDraft,
                  week: ev.target.value,
                })
              }
            />
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setShowDraft(null)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      {isCoreo && logisticsOpen && (
        <ShowLogisticsEditor
          choreo={choreo}
          lg={logistics || EMPTY_LOGISTICS}
          onSave={onSaveLogistics}
        />
      )}
    </section>
  );
}
function CostumePhotoGallery({ photos, onRemove }) {
  const [zoomed, setZoomed] = useState(null);
  return (
    <>
      <div className="lg-photos">
        {photos.map((photo, idx) => (
          <figure key={photo.id || idx} className="lg-photo">
            <button
              type="button"
              className="lg-photo-btn"
              onClick={() => setZoomed(photo)}
              aria-label={`Ver la foto ${idx + 1} del vestuario en grande`}
            >
              <img
                src={photo.url}
                alt={`Vestuario, foto ${idx + 1}`}
                loading="lazy"
              />
            </button>
            {onRemove && (
              <button
                type="button"
                className="btn btn-icon lg-photo-x"
                aria-label={`Quitar la foto ${idx + 1}`}
                onClick={() => onRemove(photo)}
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </figure>
        ))}
      </div>
      {zoomed && (
        <div
          className="lg-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Foto del vestuario"
          onClick={() => setZoomed(null)}
        >
          <img src={zoomed.url} alt="Vestuario" />
          <button type="button" className="btn" onClick={() => setZoomed(null)}>
            <Icon name="x" />
            Cerrar
          </button>
        </div>
      )}
    </>
  );
}
function ShowLogisticsEditor({ choreo, lg, onSave }) {
  const patch = (changes) =>
    onSave({
      ...lg,
      ...changes,
    });
  const pending = DANCERS.filter((dancer) => !lg.auth[dancer.id]);
  const assets = useClaudeHook("assets");
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [maxText, setMaxText] = useState(
    lg.maxTime ? formatMinSec(lg.maxTime) : "",
  );
  const photos = lg.photos || [];
  const addPhotos = async (files) => {
    setPhotoError(null);
    setSaving(true);
    const added = [];
    for (let file of files)
      if (/^image\//.test(file.type))
        try {
          if (assets) {
            const { blob } = await resizeImageToJpeg(file, 1600);
            const stored = await assets.upload(blob || file);
            added.push({
              id: stored.id,
              url: stored.url,
            });
          } else {
            const { canvas } = await resizeImageToJpeg(file, 900);
            added.push({
              url: canvas.toDataURL("image/jpeg", 0.78),
            });
          }
        } catch (err) {
          setPhotoError(
            err && err.code === "not_granted"
              ? "No se han podido guardar las fotos: falta el permiso."
              : "Una foto no se ha podido guardar.",
          );
        }
    if (added.length) {
      patch({
        photos: [...photos, ...added],
      });
    }
    setSaving(false);
  };
  const removePhoto = async (photo) => {
    if (
      (patch({
        photos: photos.filter((other) => other !== photo),
      }),
      assets && photo.id)
    )
      try {
        await assets.delete(photo.id);
      } catch {}
  };
  return (
    <div className="lg-editor">
      <label
        className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
        htmlFor={`lg-max-${choreo.id}`}
      >
        Tiempo máximo en la función (m:ss)
        <input
          id={`lg-max-${choreo.id}`}
          className="field lg-time"
          inputMode="numeric"
          placeholder="3:00"
          value={maxText}
          onChange={(ev) => {
            setMaxText(ev.target.value);
            const parsedMax = parseMinSec(ev.target.value);
            if (parsedMax || !ev.target.value.trim()) {
              patch({
                maxTime: parsedMax || null,
              });
            }
          }}
        />
        <span className="text-[12px] font-normal text-muted">
          {"La coreografía dura "}
          {formatMinSec(choreoDurationSec(choreo))}
          {" a "}
          {choreo.bpm}
          {" bpm."}
        </span>
      </label>
      <div className="flex flex-col gap-2">
        <p className="f-label">Horario del día</p>
        {lg.schedule.map((slot, slotIdx) => (
          <div key={slotIdx} className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor={`lg-t-${choreo.id}-${slotIdx}`}>
              Hora
            </label>
            <input
              id={`lg-t-${choreo.id}-${slotIdx}`}
              type="time"
              className="field lg-time"
              value={slot.time}
              onChange={(ev) =>
                patch({
                  schedule: lg.schedule.map((row, rowIdx) =>
                    rowIdx === slotIdx
                      ? {
                          ...row,
                          time: ev.target.value,
                        }
                      : row,
                  ),
                })
              }
            />
            <label className="sr-only" htmlFor={`lg-w-${choreo.id}-${slotIdx}`}>
              Qué
            </label>
            <input
              id={`lg-w-${choreo.id}-${slotIdx}`}
              className="field min-w-0 flex-1"
              value={slot.what}
              placeholder="Llegada, calentamiento, actuación…"
              onChange={(ev) =>
                patch({
                  schedule: lg.schedule.map((row, rowIdx) =>
                    rowIdx === slotIdx
                      ? {
                          ...row,
                          what: ev.target.value,
                        }
                      : row,
                  ),
                })
              }
            />
            <button
              type="button"
              className="btn btn-icon"
              aria-label="Quitar esta hora"
              onClick={() =>
                patch({
                  schedule: lg.schedule.filter(
                    (kept, keptIdx) => keptIdx !== slotIdx,
                  ),
                })
              }
            >
              <Icon name="x" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-xs self-start"
          onClick={() =>
            patch({
              schedule: [
                ...lg.schedule,
                {
                  time: "",
                  what: "",
                },
              ],
            })
          }
        >
          <span aria-hidden="true">+</span>
          {" Añadir hora"}
        </button>
      </div>
      <label
        className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
        htmlFor={`lg-c-${choreo.id}`}
      >
        Vestuario (para todas)
        <textarea
          id={`lg-c-${choreo.id}`}
          rows={2}
          className="field"
          value={lg.costume}
          onChange={(ev) =>
            patch({
              costume: ev.target.value,
            })
          }
        />
      </label>
      <div className="flex flex-col gap-1.5">
        <p className="f-label">Fotos del vestuario</p>
        {photos.length > 0 && (
          <CostumePhotoGallery photos={photos} onRemove={removePhoto} />
        )}
        <div className="flex flex-wrap items-center gap-2">
          <label className="btn btn-xs btn-file">
            <Icon name="upload" size={13} />
            {saving ? "Guardando…" : "Añadir fotos"}
            <input
              type="file"
              accept="image/*"
              multiple={true}
              className="sr-only"
              disabled={saving}
              onChange={(ev) => {
                addPhotos(Array.from(ev.target.files || []));
                ev.target.value = "";
              }}
            />
          </label>
          <span className="text-[12px] text-muted">
            Del vestido, el peinado o los zapatos. Mejor sin caras: las
            bailarinas son menores.
          </span>
        </div>
        {photoError && (
          <p
            className="text-[12px] font-semibold text-[color:var(--warn)]"
            role="status"
          >
            {photoError}
          </p>
        )}
      </div>
      <fieldset className="flex flex-col gap-1.5">
        <legend className="f-label mb-1.5">
          Notas para cada una (vestuario, peinado, lo que lleva)
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {DANCERS.map((dancer) => (
            <label
              key={dancer.id}
              className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
              htmlFor={`lg-n-${choreo.id}-${dancer.id}`}
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
                id={`lg-n-${choreo.id}-${dancer.id}`}
                className="field"
                value={lg.notes[dancer.id] || ""}
                placeholder="Sin nota"
                onChange={(ev) =>
                  patch({
                    notes: {
                      ...lg.notes,
                      [dancer.id]: ev.target.value,
                    },
                  })
                }
              />
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <p className="f-label">Autorizaciones de las familias</p>
        <div className="flex flex-wrap gap-2">
          {DANCERS.map((dancer) => {
            const signed = !!lg.auth[dancer.id];
            return (
              <button
                key={dancer.id}
                type="button"
                className={`chip chip-att ${signed ? "" : "is-out"}`}
                aria-pressed={signed}
                onClick={() =>
                  patch({
                    auth: {
                      ...lg.auth,
                      [dancer.id]: !signed,
                    },
                  })
                }
              >
                <span
                  className="tape-dot"
                  style={{
                    background: dancer.tape,
                  }}
                />
                {dancer.name}
                <span className="chip-state">
                  {signed ? "Firmada" : "Pendiente"}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[12px] text-muted">
          {pending.length
            ? `Faltan ${pending.length}: ${pending.map((pendingDancer) => pendingDancer.name).join(", ")}. Cada una ve en su móvil si la suya está pendiente.`
            : "Están todas firmadas."}
        </p>
      </div>
    </div>
  );
}
