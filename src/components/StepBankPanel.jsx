// 'Banco de pasos': step videos with the blocks where each is used, buttons to open each use.
import { CLIP_ANGLE_LABELS } from "../data/clips.js";
export function StepBankPanel({ bank, onOpenUse }) {
  return (
    <section
      className="panel flex flex-col gap-3 p-4"
      aria-label="Banco de pasos"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="f-label">Se graban una vez, se usan en todas</p>
          <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
            Banco de pasos
          </h2>
        </div>
        <p className="font-mono text-[12px] text-muted">
          {bank.length}
          {" pasos con vídeo"}
        </p>
      </div>
      <p className="max-w-[70ch] text-[13px] text-muted">
        Cada vídeo de pasos que grabas entra aquí. Para usarlo en otra
        coreografía, abre el bloque y pulsa «Añadir paso del banco»: las alumnas
        verán siempre la misma explicación.
      </p>
      <ul className="bank-list">
        {bank.map((entry) => (
          <li key={entry.clip.id} className="bank-item">
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold leading-snug text-ink">
                {entry.clip.title}
              </span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.05em] text-muted">
                {CLIP_ANGLE_LABELS[entry.clip.angle] || "Vídeo"}
                {entry.clip.bpm ? ` · ${entry.clip.bpm} bpm` : ""}
                {" · "}
                {entry.uses.length === 1
                  ? "en 1 bloque"
                  : `en ${entry.uses.length} bloques`}
              </span>
            </span>
            <span className="flex flex-wrap justify-end gap-1.5">
              {entry.uses.map((usage, usageIdx) => (
                <button
                  key={usageIdx}
                  type="button"
                  className={`bank-use ${usageIdx > 0 ? "is-reused" : ""}`}
                  onClick={() => onOpenUse(usage.choreo.id, usage.block.id)}
                >
                  {usage.choreo.title}
                  {" · "}
                  {usage.block.name}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
