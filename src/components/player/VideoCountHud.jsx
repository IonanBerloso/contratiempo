// Practice-player overlay on step videos: count-in, 'Ocho N', big count with '·/y' subdivision and the step being danced.
import { countInEight, subdivisionMark } from "../../lib/time.js";
import { vocabStepName } from "../../lib/footwork.js";
import { CountInBeats } from "../ui/CountInBeats.jsx";
export function VideoCountHud({ clip, beat, vocab }) {
  if (beat == null) return null;
  if (beat < 0)
    return (
      <div className="hud-count">
        <span className="hud-small">Cuenta de entrada</span>
        <CountInBeats beat={beat} />
      </div>
    );
  const clampedBeat = Math.min(beat, clip.counts - 0.001);
  const eightNumber = (clip.eight || 1) + Math.floor(clampedBeat / 8);
  const activeSpan =
    clip.spans &&
    clip.spans.find(
      (span) => clampedBeat >= span.from - 0.05 && clampedBeat <= span.to + 0.2,
    );
  return (
    <div className="hud-count">
      <span className="hud-small">
        {"Ocho "}
        {eightNumber}
      </span>
      <div className="hud-big">
        <span className="f-display">{countInEight(clampedBeat)}</span>
        <span className="hud-sub">{subdivisionMark(clampedBeat)}</span>
      </div>
      {activeSpan && (
        <span className="hud-step">{vocabStepName(vocab, activeSpan.key)}</span>
      )}
    </div>
  );
}
