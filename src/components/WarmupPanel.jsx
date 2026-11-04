// Calentamiento panel: exercise list, edit mode (coreo), start button.
import { useState } from "react";
import { unlockAudio } from "../lib/audio.js";
import { formatCountdown } from "../lib/format.js";
import { isSpeechSupported, speakText } from "../lib/speech.js";
import { Icon } from "./ui/Icon.jsx";
export function WarmupPanel({ warmup, setWarmup, mode, onStart }) {
  const [editing, setEditing] = useState(false);
  const totalSecs = warmup.reduce(
    (sum, entry) => sum + (Number(entry.secs) || 0),
    0,
  );
  const updateExercise = (targetIndex, patch) =>
    setWarmup((prevList) =>
      prevList.map((item, itemIdx) =>
        itemIdx === targetIndex
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  return (
    <section
      className="panel flex flex-col gap-3 p-4"
      aria-label="Calentamiento"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="f-label">
            {warmup.length}
            {" ejercicios · "}
            {formatCountdown(totalSecs)}
            {" min"}
          </p>
          <h2 className="f-display mt-1 text-[1.9rem] uppercase leading-none">
            Calentamiento
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!warmup.length}
            onClick={() => {
              unlockAudio();
              if (isSpeechSupported()) {
                speakText("Empezamos");
              }
              onStart();
            }}
          >
            <Icon name="play" />
            Empezar
          </button>
          {mode === "coreo" && (
            <button
              type="button"
              className="btn"
              aria-pressed={editing}
              onClick={() => setEditing((i) => !i)}
            >
              <Icon name="edit" />
              Editar
            </button>
          )}
        </div>
      </div>
      {editing ? (
        <div className="flex flex-col gap-2">
          {warmup.map((exercise, exIndex) => (
            <div key={exIndex} className="wu-edit">
              <label className="sr-only" htmlFor={`wu-n-${exIndex}`}>
                {"Ejercicio "}
                {exIndex + 1}
              </label>
              <input
                id={`wu-n-${exIndex}`}
                className="field min-w-0 flex-1"
                value={exercise.name}
                onChange={(nameEvent) =>
                  updateExercise(exIndex, {
                    name: nameEvent.target.value,
                  })
                }
              />
              <label className="wu-num" htmlFor={`wu-s-${exIndex}`}>
                <input
                  id={`wu-s-${exIndex}`}
                  type="number"
                  min="5"
                  max="600"
                  className="field"
                  value={exercise.secs}
                  onChange={(secsEvent) =>
                    updateExercise(exIndex, {
                      secs: Math.max(
                        5,
                        Math.min(600, Number(secsEvent.target.value) || 5),
                      ),
                    })
                  }
                />
                <span>seg</span>
              </label>
              <label className="wu-num" htmlFor={`wu-b-${exIndex}`}>
                <input
                  id={`wu-b-${exIndex}`}
                  type="number"
                  min="0"
                  max="220"
                  className="field"
                  value={exercise.bpm}
                  onChange={(bpmEvent) =>
                    updateExercise(exIndex, {
                      bpm: Math.max(
                        0,
                        Math.min(220, Number(bpmEvent.target.value) || 0),
                      ),
                    })
                  }
                />
                <span>bpm</span>
              </label>
              <button
                type="button"
                className="btn btn-icon"
                aria-label={`Quitar ${exercise.name}`}
                onClick={() =>
                  setWarmup((listNow) =>
                    listNow.filter((row, rowIdx) => rowIdx !== exIndex),
                  )
                }
              >
                <Icon name="x" />
              </button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-xs"
              onClick={() =>
                setWarmup((prevWarmup) => [
                  ...prevWarmup,
                  {
                    name: "Nuevo ejercicio",
                    secs: 60,
                    bpm: 0,
                  },
                ])
              }
            >
              <span aria-hidden="true">+</span>
              {" Añadir ejercicio"}
            </button>
            <span className="text-[12px] text-muted">
              Con bpm a 0 no suena el metrónomo.
            </span>
          </div>
        </div>
      ) : (
        <ol className="wu-list">
          {warmup.map((listedExercise, listedIdx) => (
            <li key={listedIdx}>
              <span className="wu-n f-display">{listedIdx + 1}</span>
              <span className="min-w-0 flex-1 text-[14px] text-ink">
                {listedExercise.name}
              </span>
              <span className="font-mono text-[12px] tabular-nums text-muted">
                {formatCountdown(listedExercise.secs)}
                {listedExercise.bpm ? ` · ${listedExercise.bpm} bpm` : ""}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
