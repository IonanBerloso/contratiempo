// 'Diccionario de pasos': edit the names/abbreviations of sounds and names of steps, with reset to sample names.
import { Fragment } from "react";
import {
  DEFAULT_TAP_VOCAB,
  TAP_SOUND_KEYS,
  TAP_STEP_KEYS,
  TAP_STEP_TERMS,
} from "../data/tapVocabulary.js";
import { deepClone } from "../lib/utils.js";
export function StepDictionary({ vocab, setVocab }) {
  const updateSound = (soundKey, field, value) =>
    setVocab((prevVocab) => ({
      ...prevVocab,
      sounds: {
        ...prevVocab.sounds,
        [soundKey]: {
          ...prevVocab.sounds[soundKey],
          [field]: value,
        },
      },
    }));
  const renameStep = (stepKey, stepName) =>
    setVocab((vocabBefore) => ({
      ...vocabBefore,
      steps: {
        ...vocabBefore.steps,
        [stepKey]: {
          name: stepName,
        },
      },
    }));
  return (
    <section className="panel p-4">
      <details open={true}>
        <summary className="vocab-summary">
          <span>
            <span className="f-label block">Cómo lo dices tú</span>
            <span className="f-display mt-1 block text-[1.9rem] uppercase leading-none">
              Diccionario de pasos
            </span>
          </span>
        </summary>
        <p className="mt-2 max-w-[70ch] text-[13px] text-muted">
          He puesto nombres orientativos en castellano. Cámbialos por los que
          usas en clase: la partitura, los vídeos y la vista con música usarán
          tus palabras. La abreviatura es lo que se ve dentro de cada casilla de
          la partitura.
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-ink">Sonidos</p>
            <div className="vocab-grid">
              <span className="f-label">Término</span>
              <span className="f-label">Cómo lo llamas</span>
              <span className="f-label">Abrev.</span>
              {TAP_SOUND_KEYS.map((soundTerm) => (
                <Fragment key={soundTerm}>
                  <span className="font-mono text-[12px] text-muted">
                    {soundTerm}
                  </span>
                  <input
                    aria-label={`Nombre para ${soundTerm}`}
                    id={`vs-${soundTerm}`}
                    className="field field-sm"
                    value={vocab.sounds[soundTerm].name}
                    onChange={(nameEvent) =>
                      updateSound(soundTerm, "name", nameEvent.target.value)
                    }
                  />
                  <input
                    aria-label={`Abreviatura para ${soundTerm}`}
                    id={`va-${soundTerm}`}
                    className="field field-sm text-center font-mono"
                    maxLength={3}
                    value={vocab.sounds[soundTerm].abbr}
                    onChange={(abbrEvent) =>
                      updateSound(soundTerm, "abbr", abbrEvent.target.value)
                    }
                  />
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-ink">Pasos</p>
            <div className="vocab-grid is-steps">
              <span className="f-label">Término</span>
              <span className="f-label">Cómo lo llamas</span>
              {TAP_STEP_KEYS.map((stepTerm) => (
                <Fragment key={stepTerm}>
                  <span className="font-mono text-[12px] text-muted">
                    {TAP_STEP_TERMS[stepTerm]}
                  </span>
                  <input
                    aria-label={`Nombre para ${TAP_STEP_TERMS[stepTerm]}`}
                    id={`vp-${stepTerm}`}
                    className="field field-sm"
                    value={vocab.steps[stepTerm].name}
                    onChange={(stepEvent) =>
                      renameStep(stepTerm, stepEvent.target.value)
                    }
                  />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn mt-4"
          onClick={() => setVocab(deepClone(DEFAULT_TAP_VOCAB))}
        >
          Restaurar los nombres de ejemplo
        </button>
      </details>
    </section>
  );
}
