// Txalaparta workshop panel 'Usar en una coreografía': lists the blocks already using the rhythm (open/remove) and picks a choreography + block to use the rhythm as that block's looped music.
import { useState } from "react";
import { Icon } from "../ui/Icon.jsx";
export function RhythmBlockAssignPanel({
  rhythm,
  choreos,
  usage,
  onAssign,
  onUnassign,
  onOpenBlock,
}) {
  const [selectedChoreoId, setSelectedChoreoId] = useState(
    choreos[0] ? choreos[0].id : "",
  );
  const selectedChoreo =
    choreos.find((choreoItem) => choreoItem.id === selectedChoreoId) ||
    choreos[0];
  const [selectedBlockId, setSelectedBlockId] = useState("");
  const selectedBlock = selectedChoreo
    ? selectedChoreo.blocks.find(
        (blockItem) => blockItem.id === selectedBlockId,
      ) || selectedChoreo.blocks[0]
    : null;
  return (
    <section
      className="panel flex flex-col gap-3 p-4 o-6"
      aria-label="Usar en una coreografía"
    >
      <div>
        <p className="f-label">Usar en una coreografía</p>
        <p className="mt-1 text-[13px] text-muted">
          El ritmo sonará en bucle en «Practicar con el ritmo» de ese bloque,
          durante todos sus ochos.
        </p>
      </div>
      {usage.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {usage.map(({ c, b }) => (
            <li key={b.id} className="tx-use">
              <Icon name="check" size={14} />
              <span className="min-w-0 flex-1 text-[14px] text-ink">
                {c.title}
                {" · "}
                <b className="font-semibold">{b.name}</b>
              </span>
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => onOpenBlock(c.id, b.id)}
              >
                Abrir
              </button>
              <button
                type="button"
                className="btn btn-xs"
                onClick={() => onUnassign(c.id, b.id)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedChoreo && (
        <div className="grid gap-2 sm:grid-cols-2">
          <label
            className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
            htmlFor="use-choreo"
          >
            Coreografía
            <select
              id="use-choreo"
              className="field"
              value={selectedChoreo.id}
              onChange={(choreoChange) => {
                setSelectedChoreoId(choreoChange.target.value);
                setSelectedBlockId("");
              }}
            >
              {choreos.map((choreoOption) => (
                <option key={choreoOption.id} value={choreoOption.id}>
                  {choreoOption.title}
                </option>
              ))}
            </select>
          </label>
          <label
            className="flex flex-col gap-1 text-[13px] font-semibold text-ink"
            htmlFor="use-block"
          >
            Bloque
            <select
              id="use-block"
              className="field"
              value={selectedBlock ? selectedBlock.id : ""}
              onChange={(blockChange) =>
                setSelectedBlockId(blockChange.target.value)
              }
            >
              {selectedChoreo.blocks.map((blockOption) => (
                <option key={blockOption.id} value={blockOption.id}>
                  {blockOption.name}
                  {blockOption.rhythmId && blockOption.rhythmId !== rhythm.id
                    ? " (ya tiene otro ritmo)"
                    : ""}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {selectedBlock && (
        <button
          type="button"
          className="btn self-start"
          disabled={selectedBlock.rhythmId === rhythm.id}
          onClick={() =>
            onAssign(rhythm.id, selectedChoreo.id, selectedBlock.id)
          }
        >
          {selectedBlock.rhythmId === rhythm.id
            ? "Ya suena en ese bloque"
            : "Usar como música de ese bloque"}
        </button>
      )}
    </section>
  );
}
