import { easeInOutQuad } from "./math.js";
import { vocabStepName } from "./vocab.js";
export function findClipsAtEight(clips, eight) {
  const feetClips = clips
    .filter(
      (feetClip) =>
        feetClip.type === "feet" &&
        eight >= feetClip.eight &&
        eight < feetClip.eight + Math.ceil(feetClip.counts / 8),
    )
    .sort((clipA, clipB) => clipB.bpm - clipA.bpm);
  const stageClips = clips.filter(
    (stageClip) =>
      stageClip.type === "stage" &&
      eight >= stageClip.eight &&
      eight < stageClip.eight + Math.ceil(stageClip.counts / 8),
  );
  return {
    feet: feetClips[0] || null,
    stage: stageClips[0] || null,
  };
}
export function buildStepVoiceCues(clip, blockClips, vocab) {
  const cues = [];
  const describeSpans = (spans) => {
    const stepNames = [];
    for (let span of spans) {
      const stepName = vocabStepName(vocab, span.key);
      if (
        (stepNames.includes(stepName) || stepNames.push(stepName),
        stepNames.length >= 3)
      )
        break;
    }
    return stepNames.join(", ");
  };
  if (clip.type === "feet") {
    for (let eightStart = 0; eightStart < clip.counts; eightStart += 8) {
      const phrase = describeSpans(
        clip.spans.filter(
          (eightSpan) =>
            eightSpan.from >= eightStart - 1e-6 &&
            eightSpan.from < eightStart + 8 - 1e-6,
        ),
      );
      if (phrase) {
        cues.push({
          b: eightStart - 2,
          s: "say",
          arg: phrase,
        });
      }
    }
    return cues;
  }
  if (clip.type !== "music") return cues;
  const segments = clip.full
    ? clip.segments
    : [
        {
          id: clip.block,
          name: null,
          start: clip.eight,
          len: clip.counts / 8,
          rhythm: clip.rhythm,
        },
      ];
  for (let segment of segments)
    for (let eightIdx = 0; eightIdx < segment.len; eightIdx++) {
      const absEight = segment.start + eightIdx;
      const parts = [];
      if (eightIdx === 0 && clip.full) {
        parts.push(segment.name);
      }
      const segmentClips = clip.full
        ? blockClips.filter((blockClip) => blockClip.block === segment.id)
        : blockClips;
      const { feet } = findClipsAtEight(segmentClips, absEight);
      if (feet) {
        const feetOffset = (absEight - feet.eight) * 8;
        const feetPhrase = describeSpans(
          feet.spans.filter(
            (feetSpan) =>
              feetSpan.from >= feetOffset - 1e-6 &&
              feetSpan.from < feetOffset + 8 - 1e-6,
          ),
        );
        if (feetPhrase) {
          parts.push(feetPhrase);
        }
      } else if (segment.rhythm) {
        const moves = [];
        for (let beatIdx = 0; beatIdx < 8; beatIdx++) {
          const move =
            segment.rhythm.moves[
              (eightIdx * 8 + beatIdx) % segment.rhythm.loopBeats
            ];
          if (move && !moves.includes(move)) {
            moves.push(move);
          }
        }
        if (moves.length) {
          parts.push(moves.slice(0, 3).join(", "));
        }
      }
      if (parts.length) {
        cues.push({
          b: (absEight - clip.eight) * 8 - 2,
          s: "say",
          arg: parts.join(". "),
        });
      }
    }
  return cues;
}
export function segmentAtEight(clip, block, eight) {
  if (!clip.full)
    return {
      id: block.id,
      name: block.name,
      start: clip.eight,
      len: block.len,
      acapella: block.acapella || [],
      rhythm: clip.rhythm,
      i: 0,
    };
  const segIndex = Math.max(
    0,
    clip.segments.findIndex(
      (seg) => eight >= seg.start && eight < seg.start + seg.len,
    ),
  );
  return {
    ...clip.segments[segIndex],
    i: segIndex,
  };
}
export function blendFormationPositions(clip, seg, beatInSeg, formations) {
  const targetPos = formations[seg.id] || {};
  if (seg.i === 0 || beatInSeg >= 4) return targetPos;
  const prevPos = formations[clip.segments[seg.i - 1].id] || targetPos;
  const progress = easeInOutQuad(Math.max(0, beatInSeg) / 4);
  const blended = {};
  for (let dancerId of Object.keys(targetPos)) {
    const fromPos = prevPos[dancerId] || targetPos[dancerId];
    blended[dancerId] = [
      fromPos[0] + (targetPos[dancerId][0] - fromPos[0]) * progress,
      fromPos[1] + (targetPos[dancerId][1] - fromPos[1]) * progress,
    ];
  }
  return blended;
}
