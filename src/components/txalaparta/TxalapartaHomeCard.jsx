// Home-page card previewing the latest rhythm with an 'Abrir el taller' button.
import {
  TXALAPARTA_ROLE_COLORS,
  isStrikePlayable,
  rhythmPlanks,
  strikeTargetKey,
} from "../../lib/txalaparta.js";
import { Icon } from "../ui/Icon.jsx";
export function TxalapartaHomeCard({ rhythms, instruments, onOpen }) {
  const featuredRhythm = rhythms[0];
  const columns = featuredRhythm
    ? rhythmPlanks(featuredRhythm, instruments)
    : [];
  const loopBeats = featuredRhythm ? featuredRhythm.eights * 8 : 8;
  const previewStrikes = featuredRhythm
    ? featuredRhythm.layers
        .filter((layer) => !layer.muted)
        .flatMap((layer) => layer.strikes)
        .filter(
          (strike) =>
            strike.b < Math.min(loopBeats, 4) &&
            strike.p !== "pi" &&
            isStrikePlayable(strike, featuredRhythm, columns, loopBeats),
        )
    : [];
  return (
    <section className="panel tx-card">
      <div
        className="tx-card-art"
        aria-hidden="true"
        style={{
          gridTemplateColumns: `repeat(${Math.max(1, columns.length)}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((column) => (
          <span key={column.key} className={column.m === "s" ? "is-stone" : ""}>
            {previewStrikes
              .filter(
                (strike) =>
                  strikeTargetKey(strike, featuredRhythm) === column.key,
              )
              .map((strike, strikeIdx) => (
                <i
                  key={strikeIdx}
                  style={{
                    bottom: `${12 + (strike.b / 4) * 80}%`,
                    background: TXALAPARTA_ROLE_COLORS[strike.p],
                  }}
                />
              ))}
          </span>
        ))}
        <b className="tx-card-line" />
      </div>
      <div className="flex min-w-0 flex-col gap-2 p-4 sm:p-5">
        <p className="f-label">Taller de txalaparta</p>
        <h2 className="f-display text-[2rem] uppercase leading-[0.92] [text-wrap:balance]">
          Cread el ritmo y los pasos a la vez
        </h2>
        <p className="max-w-[56ch] text-sm text-muted">
          Tocad la txalaparta en la pantalla, de madera, de piedra o las dos, y
          añadid los pies de claqué. Cada vuelta se graba y se queda repitiendo,
          como un pedal de loops, mientras apuntáis qué paso va en cada cuenta.
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onOpen(featuredRhythm ? featuredRhythm.id : null)}
          >
            <Icon name="txala" />
            Abrir el taller
          </button>
          <span className="font-mono text-[12px] text-muted">
            {rhythms.length}{" "}
            {rhythms.length === 1 ? "ritmo guardado" : "ritmos guardados"}
          </span>
        </div>
      </div>
    </section>
  );
}
