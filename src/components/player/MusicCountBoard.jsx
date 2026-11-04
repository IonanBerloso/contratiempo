// Big class-screen board shown instead of the video for music clips: source chip, a capella flag, count boxes 1-8, steps and moving formation.
import { DANCERS } from "../../data/dancers.js";
import {
  blendFormationPositions,
  findClipsAtEight,
  segmentAtEight,
} from "../../lib/musicTimeline.js";
import { countInEight, countLabel } from "../../lib/time.js";
import { vocabStepName } from "../../lib/footwork.js";
import { CountInBeats } from "../ui/CountInBeats.jsx";
function BoardStage({ pos, highlight, flip }) {
  return (
    <div className={`board-stage ${flip ? "is-flip" : ""}`} aria-hidden="true">
      <span className="board-stage-front">Público</span>
      {DANCERS.map((dancer) => {
        const rawPos = pos[dancer.id];
        if (!rawPos) return null;
        const shownPos = flip ? [100 - rawPos[0], 100 - rawPos[1]] : rawPos;
        const isMe = highlight === dancer.id;
        return (
          <i
            key={dancer.id}
            className={isMe ? "is-me" : highlight ? "is-dim" : ""}
            style={{
              left: `${shownPos[0]}%`,
              top: `${shownPos[1]}%`,
              background: isMe || highlight ? undefined : dancer.tape,
            }}
          >
            {isMe ? "TÚ" : ""}
          </i>
        );
      })}
    </div>
  );
}
function BoardEightSteps({ clip, seg, b, abs, blockClips, vocab }) {
  const segmentClips = clip.full
    ? blockClips.filter((segClip) => segClip.block === seg.id)
    : blockClips;
  const { feet, stage } = findClipsAtEight(segmentClips, abs);
  if (feet) {
    const feetStart = (abs - feet.eight) * 8;
    const beatInFeet = b - (feet.eight - clip.eight) * 8;
    const eightSpans = feet.spans.filter(
      (span) =>
        span.from >= feetStart - 1e-6 && span.from < feetStart + 8 - 1e-6,
    );
    const activeSpan =
      eightSpans.find(
        (candidate) =>
          beatInFeet >= candidate.from - 0.05 &&
          beatInFeet <= candidate.to + 0.2,
      ) || null;
    if (eightSpans.length)
      return eightSpans.map((stepSpan, spanIdx) => (
        <span
          key={spanIdx}
          className={`board-step ${stepSpan === activeSpan ? "is-on" : ""}`}
        >
          <b>{countLabel(stepSpan.from)}</b>{" "}
          {vocabStepName(vocab, stepSpan.key)}
        </span>
      ));
  }
  if (seg.rhythm && seg.rhythm.moves.some(Boolean)) {
    const beatInSeg = b - (seg.start - clip.eight) * 8;
    const loopPos = Math.floor(beatInSeg) % seg.rhythm.loopBeats;
    const eightStartInLoop = Math.floor(loopPos / 8) * 8;
    const activeCounts = [];
    for (let countIdx = 0; countIdx < 8; countIdx++) {
      if (seg.rhythm.moves[eightStartInLoop + countIdx]) {
        activeCounts.push(countIdx);
      }
    }
    if (activeCounts.length)
      return activeCounts.map((countOffset) => (
        <span
          key={countOffset}
          className={`board-step ${eightStartInLoop + countOffset === loopPos ? "is-on" : ""}`}
        >
          <b>{countOffset + 1}</b>{" "}
          {seg.rhythm.moves[eightStartInLoop + countOffset]}
        </span>
      ));
  }
  return stage ? (
    <span className="board-step is-on">
      {"Desplazamiento: "}
      {stage.title.toLowerCase()}
    </span>
  ) : (
    <span className="board-step">Sin paso grabado para este ocho</span>
  );
}
export function MusicCountBoard({
  clip,
  beat,
  block,
  blockClips,
  vocab,
  song,
  formations,
  highlight,
  flip,
  showStage,
}) {
  if (beat == null) return null;
  const isCountIn = beat < 0;
  const clampedBeat = isCountIn ? 0 : Math.min(beat, clip.counts - 0.001);
  const absEight = clip.eight + Math.floor(clampedBeat / 8);
  const seg = segmentAtEight(clip, block, absEight);
  const eightInSeg = absEight - seg.start + 1;
  const beatInSeg = clampedBeat - (seg.start - clip.eight) * 8;
  const countNow = countInEight(clampedBeat);
  const isAcapella = !isCountIn && (seg.acapella || []).includes(eightInSeg);
  const sourceLabel = song
    ? song.name
    : seg.rhythm
      ? `Txalaparta · ${seg.rhythm.name}`
      : "Pista de ensayo generada";
  const centerPanel = isCountIn ? (
    <div className="board-center">
      <span className="hud-small">
        {"Cuenta de entrada · "}
        {seg.name}
      </span>
      <CountInBeats beat={beat} />
    </div>
  ) : (
    <div className="board-center">
      <span className="hud-small">
        {clip.full
          ? `${seg.name} · ocho ${eightInSeg} de ${seg.len}`
          : `Ocho ${absEight} · ${eightInSeg}º de ${seg.len} en ${seg.name}`}
      </span>
      <div className="board-boxes" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((box) => (
          <span
            key={box}
            className={
              box === countNow ? "is-on" : box < countNow ? "is-past" : ""
            }
          >
            {box}
          </span>
        ))}
      </div>
      <div className="board-steps">
        <BoardEightSteps
          clip={clip}
          seg={seg}
          b={clampedBeat}
          abs={absEight}
          blockClips={blockClips}
          vocab={vocab}
        />
      </div>
    </div>
  );
  return (
    <div className={`board ${showStage ? "is-full" : ""}`}>
      <span className="hud-chip board-src">
        {clip.full
          ? `Entera · bloque ${seg.i + 1} de ${clip.segments.length}`
          : "Con música"}
        {" · "}
        {sourceLabel}
      </span>
      {isAcapella && (
        <span className="hud-chip is-on board-acap">A capella</span>
      )}
      {/* The formation is shown for the whole piece, and for a single block on the big screen,
          where the stage map is not visible. */}
      {showStage ? (
        <div className="board-full">
          {centerPanel}
          <BoardStage
            pos={blendFormationPositions(
              clip,
              seg,
              isCountIn ? 0 : beatInSeg,
              formations,
            )}
            highlight={highlight}
            flip={flip}
          />
        </div>
      ) : (
        centerPanel
      )}
    </div>
  );
}
