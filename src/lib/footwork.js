import { DANCERS } from "../data/dancers.js";
var makeFootEvent = (beat, foot, sound) => ({
  b: beat,
  f: foot,
  s: sound,
});
export var oppositeFoot = (foot) => (foot === "R" ? "L" : "R");
var makeStepGroup = (stepKey, footEvents) => ({
  key: stepKey,
  evs: footEvents,
});
export var tapStamp = (beat, foot) =>
  makeStepGroup("stamp", [makeFootEvent(beat, foot, "stamp")]);
var tapHop = (beat, foot) =>
  makeStepGroup("hop", [makeFootEvent(beat, foot, "hop")]);
export var tapStep = (beat, foot) =>
  makeStepGroup("step", [makeFootEvent(beat, foot, "step")]);
export var tapHeelDrop = (beat, foot) =>
  makeStepGroup("heel", [makeFootEvent(beat, foot, "heel")]);
export var tapFlap = (beat, foot, gap = 0.5) =>
  makeStepGroup("flap", [
    makeFootEvent(beat, foot, "brush"),
    makeFootEvent(beat + gap, foot, "step"),
  ]);
export var tapShuffle = (beat, foot, gap = 0.5) =>
  makeStepGroup("shuffle", [
    makeFootEvent(beat, foot, "brush"),
    makeFootEvent(beat + gap, foot, "spank"),
  ]);
export var tapBallChange = (beat, foot, gap = 0.5) =>
  makeStepGroup("ballChange", [
    makeFootEvent(beat, foot, "ball"),
    makeFootEvent(beat + gap, oppositeFoot(foot), "step"),
  ]);
export var tapPaddleRoll = (beat, foot, gap = 0.25) =>
  makeStepGroup("paddle", [
    makeFootEvent(beat, foot, "dig"),
    makeFootEvent(beat + gap, foot, "spank"),
    makeFootEvent(beat + 2 * gap, oppositeFoot(foot), "heel"),
    makeFootEvent(beat + 3 * gap, foot, "toe"),
  ]);
export var tapCrampRoll = (beat, foot, gap = 0.25) =>
  makeStepGroup("cramp", [
    makeFootEvent(beat, foot, "ball"),
    makeFootEvent(beat + gap, oppositeFoot(foot), "ball"),
    makeFootEvent(beat + 2 * gap, foot, "heel"),
    makeFootEvent(beat + 3 * gap, oppositeFoot(foot), "heel"),
  ]);
export var tapRiff = (beat, foot, gap = 0.25) =>
  makeStepGroup("riff", [
    makeFootEvent(beat, foot, "brush"),
    makeFootEvent(beat + gap, foot, "scuff"),
  ]);
export var tapParadiddle = (beat, foot, gap = 0.25) =>
  makeStepGroup("paradiddle", [
    makeFootEvent(beat, foot, "dig"),
    makeFootEvent(beat + gap, foot, "spank"),
    makeFootEvent(beat + 2 * gap, foot, "step"),
    makeFootEvent(beat + 3 * gap, foot, "heel"),
  ]);
export var tapTimeStepPhrase = (beat, foot) => [
  tapStamp(beat, foot),
  tapHop(beat + 0.5, oppositeFoot(foot)),
  tapStep(beat + 1, foot),
  tapFlap(beat + 1.5, oppositeFoot(foot)),
  tapStep(beat + 2.5, foot),
];
export function buildFootworkTrack(stepGroups) {
  let events = [],
    spans = [];
  for (let group of stepGroups.flat()) {
    events.push(...group.evs);
    let beats = group.evs.map((footEvent) => footEvent.b);
    spans.push({
      key: group.key,
      from: Math.min(...beats),
      to: Math.max(...beats),
    });
  }
  return (
    events.sort((evA, evB) => evA.b - evB.b),
    spans.sort((spanA, spanB) => spanA.from - spanB.from),
    {
      type: "feet",
      events,
      spans,
    }
  );
}
export function buildStageMoveTrack({
  counts,
  from,
  to,
  order = null,
  stagger = 0,
  move,
}) {
  let entryDelayOf = (dancerId) =>
      order ? order.indexOf(dancerId) * stagger : 0,
    stepEvents = [],
    foot = "R";
  for (let count = 0; count < counts; count++)
    DANCERS.some((dancer) => {
      let delay = entryDelayOf(dancer.id);
      return count >= delay - 1e-9 && count < delay + move;
    }) &&
      (stepEvents.push(makeFootEvent(count, foot, "step")),
      (foot = oppositeFoot(foot)));
  return {
    type: "stage",
    angle: "escenario",
    counts,
    from,
    to,
    order,
    stagger,
    move,
    events: stepEvents,
    spans: [],
  };
}
