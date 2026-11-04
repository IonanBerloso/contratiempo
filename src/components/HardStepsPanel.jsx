// "Lo que te cuesta": the steps a dancer flagged with «Me cuesta», gathered on her home screen so
// she can go straight to them when she practises at home.
import { CLIP_ANGLE_LABELS } from "../data/clips.js";
import { Icon } from "./ui/Icon.jsx";

export function HardStepsPanel({ choreos, clipsById, hardIds, onOpenClip }) {
  const entries = hardIds
    .map((clipId) => {
      for (const choreo of choreos) {
        if (choreo.status === "Borrador") continue;
        const clip = (clipsById[choreo.id] || []).find(
          (candidate) => candidate.id === clipId,
        );
        if (clip)
          return {
            choreo,
            clip,
            block: choreo.blocks.find((b) => b.id === clip.block),
          };
      }
      return null;
    })
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
            <li key={clip.id}>
              <button
                type="button"
                className="catch-item"
                onClick={() => onOpenClip(choreo.id, clip)}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold leading-snug text-ink">
                    {clip.title}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                    {choreo.title}
                    {block ? ` · ${block.name}` : ""}
                    {CLIP_ANGLE_LABELS[clip.angle]
                      ? ` · ${CLIP_ANGLE_LABELS[clip.angle]}`
                      : ""}
                  </span>
                </span>
                <span className="catch-state">
                  <Icon name="play" size={14} />
                </span>
              </button>
            </li>
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
