// Full-screen roulette runner: count-in, metronome, voice announces next combo.
import { useEffect, useRef, useState } from "react";
import {
  audioNow,
  playSound,
  setAudioKeepAlive,
  unlockAudio,
} from "../lib/audio.js";
import { buildImprovSequence } from "../lib/improv.js";
import { cancelSpeech, speakText } from "../lib/speech.js";
import { Icon } from "./ui/Icon.jsx";
export function ImprovRouletteRunner({
  settings,
  vocab,
  voice,
  onPractice,
  onClose,
}) {
  const { bpm, per, mins, pool } = settings;
  const beatSecs = 60 / bpm;
  const comboCount = Math.max(
    2,
    Math.round((mins * 60) / (beatSecs * 8 * per)),
  );
  const [combos] = useState(() => buildImprovSequence(pool, comboCount));
  const [beat, setBeat] = useState(-4);
  const [playing, setPlaying] = useState(true);
  const startTimeRef = useRef(0);
  const resumeBeatRef = useRef(-4);
  const announcedRef = useRef(-1);
  const stepLabel = (stepId) =>
    vocab.steps[stepId] ? vocab.steps[stepId].name : stepId;
  const comboPhrase = (comboSteps) => comboSteps.map(stepLabel).join(" y ");
  const totalBeats = comboCount * per * 8;
  useEffect(() => {
    if (!playing) return;
    unlockAudio();
    setAudioKeepAlive(true);
    const startAt = audioNow() + 0.15;
    startTimeRef.current = startAt - (resumeBeatRef.current + 4) * beatSecs;
    let nextBeat = Math.ceil(resumeBeatRef.current - 1e-6);
    const scheduler = setInterval(() => {
      const horizon = audioNow() + 0.12;
      for (; nextBeat < totalBeats;) {
        const beatTime = startTimeRef.current + (nextBeat + 4) * beatSecs;
        if (beatTime >= horizon) break;
        if (beatTime >= audioNow() - 0.02) {
          playSound(nextBeat % 8 === 0 ? "clickHi" : "click", null, beatTime);
        }
        nextBeat += 1;
      }
    }, 25);
    let rafId = 0;
    const tick = () => {
      const beatPos = (audioNow() - startTimeRef.current) / beatSecs - 4;
      if ((setBeat(beatPos), beatPos >= totalBeats)) {
        setPlaying(false);
        resumeBeatRef.current = totalBeats;
        if (voice) {
          speakText("¡Bien hecho!");
        }
        return;
      }
      const comboIdx = Math.floor((beatPos + 2) / (per * 8));
      if (
        voice &&
        comboIdx !== announcedRef.current &&
        comboIdx < comboCount &&
        beatPos + 2 >= comboIdx * per * 8
      ) {
        announcedRef.current = comboIdx;
        speakText(comboPhrase(combos[comboIdx]));
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      clearInterval(scheduler);
      cancelAnimationFrame(rafId);
      setAudioKeepAlive(false);
    };
  }, [playing]);
  useEffect(() => {
    if (!playing || !onPractice) return;
    const practiceTimer = setInterval(() => onPractice(5), 5e3);
    return () => clearInterval(practiceTimer);
  }, [playing]);
  useEffect(() => {
    const onKey = (keyEvent) => {
      if (keyEvent.key === "Escape") {
        handleExit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const handleExit = () => {
    cancelSpeech();
    onClose();
  };
  const done = beat >= totalBeats;
  const currentIdx = Math.max(
    0,
    Math.min(comboCount - 1, Math.floor(Math.max(0, beat) / (per * 8))),
  );
  const countDisplay =
    beat < 0 ? Math.floor(beat) + 9 : (Math.floor(beat + 1e-6) % 8) + 1;
  const currentCombo = combos[currentIdx];
  const nextCombo = combos[currentIdx + 1];
  return (
    <div
      className="wu-run"
      role="dialog"
      aria-modal="true"
      aria-label="Ruleta de improvisación"
    >
      <div className="wu-run-top">
        <span className="f-label">
          {"Ruleta · "}
          {bpm}
          {" bpm · "}
          {Math.min(currentIdx + 1, comboCount)}
          {" de "}
          {comboCount}
        </span>
        <button type="button" className="btn" onClick={handleExit}>
          <Icon name="x" />
          Salir
        </button>
      </div>
      <div className="wu-run-main">
        {done ? (
          <>
            <p className="wu-run-name f-display">¡Bien hecho!</p>
            <p className="wu-run-next">
              {"Has encadenado "}
              {comboCount}
              {" combinaciones."}
            </p>
          </>
        ) : (
          <>
            <p
              className={`wu-run-time f-display tabular-nums ${beat < 0 ? "is-pre" : ""}`}
              aria-live="off"
            >
              {countDisplay}
            </p>
            <p className="wu-run-name f-display">
              {beat < 0 ? "Prepárate" : currentCombo.map(stepLabel).join(" + ")}
            </p>
            <p className="wu-run-next">
              {beat < 0
                ? `Empieza con: ${currentCombo.map(stepLabel).join(" + ")}`
                : nextCombo
                  ? `Después: ${nextCombo.map(stepLabel).join(" + ")}`
                  : "Última combinación"}
            </p>
            <div className="wu-run-bar" aria-hidden="true">
              <span
                style={{
                  width: `${Math.max(0, Math.min(100, (beat / totalBeats) * 100))}%`,
                }}
              />
            </div>
          </>
        )}
      </div>
      {!done && (
        <div className="wu-run-ctrl">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              if (playing) {
                resumeBeatRef.current = Math.max(
                  -4,
                  Math.floor(beat / 8) * 8 - 4,
                );
                cancelSpeech();
              }
              setPlaying((wasPlaying) => !wasPlaying);
            }}
          >
            <Icon name={playing ? "pause" : "play"} />
            {playing ? "Pausa" : "Seguir"}
          </button>
        </div>
      )}
    </div>
  );
}
