// Full-screen warm-up runner with countdown, metronome and voice.
import { useEffect, useState } from "react";
import {
  audioNow,
  playSound,
  setAudioKeepAlive,
  unlockAudio,
} from "../lib/audio.js";
import { formatCountdown, spokenDuration } from "../lib/format.js";
import { cancelSpeech, speakText } from "../lib/speech.js";
import { Icon } from "./ui/Icon.jsx";
export function WarmupRunner({ warmup, onClose, onPractice, voice }) {
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [remaining, setRemaining] = useState(warmup[0] ? warmup[0].secs : 0);
  const [running, setRunning] = useState(true);
  const [finished, setFinished] = useState(false);
  const exercise = warmup[exerciseIdx];
  useEffect(() => {
    if (!running || finished) return;
    let lastTick = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      const elapsed = (now - lastTick) / 1e3;
      lastTick = now;
      setRemaining((prevRemaining) => prevRemaining - elapsed);
    }, 200);
    return () => clearInterval(timer);
  }, [running, exerciseIdx, finished]);
  useEffect(() => {
    if (!(remaining > 0 || finished)) {
      if (exerciseIdx + 1 < warmup.length) {
        setExerciseIdx(exerciseIdx + 1);
        setRemaining(warmup[exerciseIdx + 1].secs);
      } else {
        setFinished(true);
        setRunning(false);
        if (voice) {
          speakText("Calentamiento terminado. ¡A bailar!");
        }
      }
    }
  }, [remaining]);
  useEffect(() => {
    if (exercise && voice && !finished) {
      speakText(`${exercise.name}. ${spokenDuration(exercise.secs)}`);
    }
  }, [exerciseIdx]);
  useEffect(() => {
    if (!running || finished || !exercise || !exercise.bpm) return;
    unlockAudio();
    const beatSecs = 60 / exercise.bpm;
    let nextBeatTime = audioNow() + 0.15;
    let beatCount = 0;
    const scheduler = setInterval(() => {
      const horizon = audioNow() + 0.12;
      for (; nextBeatTime < horizon;) {
        playSound(
          beatCount % 8 === 0 ? "clickHi" : "click",
          null,
          nextBeatTime,
        );
        nextBeatTime += beatSecs;
        beatCount += 1;
      }
    }, 25);
    setAudioKeepAlive(true);
    return () => {
      clearInterval(scheduler);
      setAudioKeepAlive(false);
    };
  }, [running, exerciseIdx, finished]);
  useEffect(() => {
    if (!running || finished || !onPractice) return;
    const practiceTimer = setInterval(() => onPractice(5), 5e3);
    return () => clearInterval(practiceTimer);
  }, [running, finished]);
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
  const skipExercise = () => setRemaining(0);
  const progressPct = exercise
    ? Math.min(100, Math.max(0, (1 - remaining / exercise.secs) * 100))
    : 100;
  return (
    <div
      className="wu-run"
      role="dialog"
      aria-modal="true"
      aria-label="Calentamiento"
    >
      <div className="wu-run-top">
        <span className="f-label">
          {"Calentamiento · "}
          {Math.min(exerciseIdx + 1, warmup.length)}
          {" de "}
          {warmup.length}
        </span>
        <button type="button" className="btn" onClick={handleExit}>
          <Icon name="x" />
          Salir
        </button>
      </div>
      <div className="wu-run-main">
        {finished ? (
          <>
            <p className="wu-run-name f-display">¡Listas!</p>
            <p className="wu-run-next">
              Calentamiento terminado. Ahora, a ensayar.
            </p>
          </>
        ) : (
          <>
            <p className="wu-run-name f-display">{exercise.name}</p>
            <p className="wu-run-time f-display tabular-nums">
              {formatCountdown(remaining)}
            </p>
            <div className="wu-run-bar" aria-hidden="true">
              <span
                style={{
                  width: `${progressPct}%`,
                }}
              />
            </div>
            <p className="wu-run-next">
              {exercise.bpm
                ? `Metrónomo a ${exercise.bpm} bpm`
                : "Sin metrónomo"}
              {warmup[exerciseIdx + 1]
                ? ` · Después: ${warmup[exerciseIdx + 1].name}`
                : " · Último ejercicio"}
            </p>
          </>
        )}
      </div>
      {!finished && (
        <div className="wu-run-ctrl">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              unlockAudio();
              setRunning((wasRunning) => !wasRunning);
            }}
          >
            <Icon name={running ? "pause" : "play"} />
            {running ? "Pausa" : "Seguir"}
          </button>
          <button type="button" className="btn btn-lg" onClick={skipExercise}>
            <Icon name="arrow" />
            Siguiente ejercicio
          </button>
        </div>
      )}
    </div>
  );
}
