// Ruleta de improvisación settings panel (bpm, every 1/2 eights, minutes, step pool).
import { useState } from "react";
import { DEFAULT_IMPROV_POOL } from "../data/practice.js";
import { TAP_STEP_KEYS } from "../data/tapVocabulary.js";
import { unlockAudio } from "../lib/audio.js";
import { Icon } from "./ui/Icon.jsx";
export function ImprovRoulettePanel({ vocab, onStart }) {
  const [bpm, setBpm] = useState(112);
  const [eightsPer, setEightsPer] = useState(1);
  const [minutes, setMinutes] = useState(2);
  const [pool, setPool] = useState(DEFAULT_IMPROV_POOL);
  const stepName = (stepId) =>
    vocab.steps[stepId] ? vocab.steps[stepId].name : stepId;
  const togglePoolStep = (toggledId) =>
    setPool((prevPool) =>
      prevPool.includes(toggledId)
        ? prevPool.filter((poolId) => poolId !== toggledId)
        : [...prevPool, toggledId],
    );
  return (
    <section
      className="panel flex flex-col gap-3 p-4"
      aria-label="Ruleta de improvisación"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="f-label">Pasos al azar con metrónomo</p>
          <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
            Ruleta de improvisación
          </h2>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          disabled={pool.length < 2}
          onClick={() => {
            unlockAudio();
            onStart({
              bpm,
              per: eightsPer,
              mins: minutes,
              pool,
            });
          }}
        >
          <Icon name="spark" />
          Girar la ruleta
        </button>
      </div>
      <p className="max-w-[70ch] text-[13px] text-muted">
        {"Cada "}
        {eightsPer === 1 ? "ocho" : "dos ochos"}
        {
          " salen uno o dos pasos al azar y hay que encadenarlos a tiempo. La voz avisa del siguiente un poco antes."
        }
      </p>
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Pasos que pueden salir"
      >
        {TAP_STEP_KEYS.map((stepKey) => (
          <button
            key={stepKey}
            type="button"
            className="chip"
            aria-pressed={pool.includes(stepKey)}
            onClick={() => togglePoolStep(stepKey)}
          >
            {stepName(stepKey)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink">
        <label className="wu-num" htmlFor="impro-bpm">
          <input
            id="impro-bpm"
            type="number"
            min="60"
            max="200"
            className="field"
            value={bpm}
            onChange={(bpmEvent) =>
              setBpm(
                Math.max(
                  60,
                  Math.min(200, Number(bpmEvent.target.value) || 60),
                ),
              )
            }
          />
          <span>bpm</span>
        </label>
        <div
          className="seg seg-sm"
          role="radiogroup"
          aria-label="Cada cuánto cambia"
        >
          {[
            [1, "Cada ocho"],
            [2, "Cada dos ochos"],
          ].map(([perValue, perLabel]) => (
            <button
              key={perValue}
              type="button"
              role="radio"
              aria-checked={eightsPer === perValue}
              className="seg-btn"
              onClick={() => setEightsPer(perValue)}
            >
              {perLabel}
            </button>
          ))}
        </div>
        <div className="seg seg-sm" role="radiogroup" aria-label="Duración">
          {[1, 2, 3].map((minsOption) => (
            <button
              key={minsOption}
              type="button"
              role="radio"
              aria-checked={minutes === minsOption}
              className="seg-btn"
              onClick={() => setMinutes(minsOption)}
            >
              {minsOption}
              {" min"}
            </button>
          ))}
        </div>
      </div>
      {pool.length < 2 && (
        <p className="text-[12px] font-semibold text-[color:var(--warn)]">
          Elige al menos dos pasos.
        </p>
      )}
    </section>
  );
}
