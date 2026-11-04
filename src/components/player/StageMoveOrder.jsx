// Panel for stage-movement clips: entrance/exit order with each dancer's start count, or 'all at once' instructions.
import { DANCERS } from "../../data/dancers.js";
import { countLabel } from "../../lib/time.js";
export function StageMoveOrder({ clip, me, mode }) {
  const isDancerView = mode === "bailarina";
  if (!clip.order)
    return (
      <div className="flex flex-col gap-1.5">
        <p className="f-label">Movimiento</p>
        <p className="text-sm text-ink">
          {"Todas a la vez: salís en el 1 y llegáis a la nueva marca en "}
          {clip.move}
          {" tiempos, sin correr."}
        </p>
        <p className="text-[12px] text-muted">
          Los círculos son del color de la cinta de cada una en el suelo.
        </p>
      </div>
    );
  const myIndex = clip.order.indexOf(me);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="f-label">
          {clip.from === "entrada" ? "Orden de entrada" : "Orden de salida"}
        </p>
        {isDancerView && myIndex >= 0 && (
          <p className="text-sm font-semibold text-ink">
            {"Tú sales en el "}
            {countLabel(myIndex * clip.stagger)}
            {" y llegas en el "}
            {countLabel(myIndex * clip.stagger + clip.move)}.
          </p>
        )}
      </div>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {clip.order.map((dancerId, orderIdx) => {
          const dancer = DANCERS.find((candidate) => candidate.id === dancerId);
          return (
            <li
              key={dancerId}
              className={`order-item ${isDancerView && me === dancerId ? "is-me" : ""}`}
            >
              <span
                className="tape-dot"
                style={{
                  background: dancer.tape,
                }}
              />
              <span className="min-w-0 truncate font-semibold">
                {dancer.name}
              </span>
              <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums">
                {"en el "}
                {countLabel(orderIdx * clip.stagger)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
