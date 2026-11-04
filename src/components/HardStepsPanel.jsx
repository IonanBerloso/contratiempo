// "Lo que te cuesta": the steps a dancer flagged with «Me cuesta», gathered on her home screen so
// she can go straight to them when she practises at home.
import { CLIP_ANGLE_LABELS } from "../data/clips.js";
import { findClipEntry } from "../lib/choreography.js";
import { CatchItem } from "./ui/CatchItem.jsx";

export function HardStepsPanel({ choreos, clipsById, hardIds, onOpenClip }) {
  const visible = choreos.filter((choreo) => choreo.status !== "Borrador");
  const entries = hardIds
    .map((clipId) => findClipEntry(visible, clipsById, clipId))
    .filter(Boolean);
  return (
    <section
      className="panel flex flex-col gap-3 p-4"
      aria-label="Lo que te cuesta"
    >
      <div>
        <p className="f-label">Para practicar en casa</p>
        <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
          Lo que te cuesta
        </h2>
      </div>
      {entries.length ? (
        <ol className="catch-list">
          {entries.map(({ choreo, clip, block }) => (
            <CatchItem
              key={clip.id}
              title={clip.title}
              detail={`${choreo.title}${block ? ` · ${block.name}` : ""}${CLIP_ANGLE_LABELS[clip.angle] ? ` · ${CLIP_ANGLE_LABELS[clip.angle]}` : ""}`}
              onClick={() => onOpenClip(choreo.id, clip)}
            />
          ))}
        </ol>
      ) : (
        <p className="text-[13px] text-muted">
          Cuando un paso se te atragante, márcalo con «Me cuesta» en el desglose
          de la coreografía y aparecerá aquí para practicarlo despacio. Tu profe
          también lo ve, para repasarlo en clase.
        </p>
      )}
    </section>
  );
}
