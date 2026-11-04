// Dancer banner: 'Al día' if she came, otherwise 'Faltaste…' with the ordered list of new clips/personal notes and review progress.
import { CLIP_ANGLE_LABELS } from "../data/clips.js";
import { lastClassDate, missedClassGroups } from "../lib/choreography.js";
import { findDancerById } from "../lib/dancers.js";
import { Icon } from "./ui/Icon.jsx";
export function MissedClassSummary({
  me,
  choreos,
  clipsById,
  lastClass,
  seen,
  onOpenItem,
}) {
  const dancer = findDancerById(me);
  const wasAbsent = lastClass.absent.includes(me);
  const seenIds = seen[me] || [];
  const classDate = lastClassDate(lastClass);
  const groups = missedClassGroups(choreos, clipsById, lastClass, me);
  const allItems = groups.flatMap((groupEntry) => groupEntry.items);
  const seenCount = allItems.filter((catchItem) =>
    seenIds.includes(catchItem.id),
  ).length;
  if (wasAbsent && !allItems.length)
    return (
      <section className="panel flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <p className="min-w-0 flex-1 text-sm text-ink">
          {`Faltaste ${classDate.long}, pero ese día no se marcó nada nuevo: repasa las coreografías como siempre.`}
        </p>
      </section>
    );
  if (!wasAbsent)
    return (
      <section className="panel flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <span className="ok-badge">
          <Icon name="check" size={14} />
          Al día
        </span>
        <p className="min-w-0 flex-1 text-sm text-ink">
          {"Viniste a la última clase, "}
          {classDate.long}
          {". Lo que se cambió ese día lleva la etiqueta "}
          <span className="tag-new">Nuevo</span>
          {" por si quieres repasarlo."}
        </p>
      </section>
    );
  let itemNumber = 0;
  return (
    <section className="panel catch">
      <div className="catch-head">
        <p className="f-label">
          {"Última clase · "}
          {classDate.short}
        </p>
        <h2 className="f-display mt-1 text-[2.2rem] uppercase leading-[0.92] [text-wrap:balance]">
          {"Faltaste "}
          {classDate.day}
          {", "}
          {dancer.name}
        </h2>
        <p className="mt-2 max-w-[48ch] text-sm text-muted">
          Esto es lo que se hizo nuevo, en el orden en que te conviene
          estudiarlo. Cada vídeo se marca como repasado cuando lo reproduces.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="progress" aria-hidden="true">
            <span
              style={{
                width: `${allItems.length ? (seenCount / allItems.length) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="font-mono text-[12px] tabular-nums text-ink">
            {seenCount}
            {" de "}
            {allItems.length}
            {" repasado"}
            {allItems.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {groups.map((choreoGroup) => (
          <div key={choreoGroup.choreo.id} className="flex flex-col gap-1.5">
            <p className="f-label">{choreoGroup.choreo.title}</p>
            <ol className="catch-list">
              {choreoGroup.items.map((entry) => {
                const index = itemNumber;
                itemNumber += 1;
                const isSeen = seenIds.includes(entry.id);
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      className={`catch-item ${isSeen ? "is-seen" : ""}`}
                      onClick={() => onOpenItem(index)}
                    >
                      <span className="catch-num f-display">{itemNumber}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold leading-snug text-ink">
                          {entry.kind === "clip"
                            ? entry.clip.title
                            : `Nota para ti en ${entry.block.name}`}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                          {entry.kind === "clip"
                            ? `${entry.block.name} · ${CLIP_ANGLE_LABELS[entry.clip.angle] || "Vídeo"}${entry.clip.bpm ? ` · ${entry.clip.bpm} bpm` : ""}`
                            : entry.text}
                        </span>
                      </span>
                      <span className="catch-state">
                        {isSeen ? (
                          <Icon name="check" size={16} />
                        ) : (
                          <Icon
                            name={entry.kind === "clip" ? "play" : "arrow"}
                            size={14}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
