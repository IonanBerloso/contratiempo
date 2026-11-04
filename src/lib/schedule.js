export function buildSoundSchedule(stepEvents, timeAt, options) {
  const schedule = [];
  const addHit = (atBeat, kind, arg) => {
    const time = timeAt(atBeat);
    if (time >= 0) {
      schedule.push({
        time,
        kind,
        arg,
      });
    }
  };
  if (options.countIn)
    for (let leadInBeat = -4; leadInBeat < 0; leadInBeat++)
      addHit(leadInBeat, leadInBeat === -4 ? "clickHi" : "click");
  if (options.metro)
    for (let count = 0; count < options.counts; count++)
      addHit(count, count % 8 === 0 ? "clickHi" : "click");
  if (options.backing)
    for (let grooveHit of generateBackingGroove(
      0,
      options.counts,
      options.swing,
      (eightNumber) =>
        !!(options.acapella && options.acapella.includes(eightNumber)),
    ))
      addHit(grooveHit.b, grooveHit.s, grooveHit.arg);
  for (let stepEvent of stepEvents)
    addHit(stepEvent.b, stepEvent.s, stepEvent.arg);
  return schedule.sort((o, r) => o.time - r.time);
}
export function generateBackingGroove(startBeat, counts, swing, isMutedEight) {
  const hits = [];
  for (let count = 0; count < counts; count++) {
    if (isMutedEight && isMutedEight(Math.floor(count / 8) + 1)) continue;
    const beat = startBeat + count;
    const posInBar = count % 4;
    if (posInBar === 0 || posInBar === 2) {
      hits.push({
        b: beat,
        s: "kick",
      });
    }
    if (posInBar === 1 || posInBar === 3) {
      hits.push({
        b: beat,
        s: "snare",
      });
    }
    hits.push({
      b: beat,
      s: "ride",
    });
    if (!swing || posInBar === 1 || posInBar === 3) {
      hits.push({
        b: beat + 0.5,
        s: "rideSoft",
      });
    }
    hits.push({
      b: beat,
      s: "bass",
      arg: BACKING_BASS_LINE_HZ[count % BACKING_BASS_LINE_HZ.length],
    });
  }
  return hits;
}
const BACKING_BASS_LINE_HZ = [
  87.31, 110, 130.81, 146.83, 116.54, 146.83, 174.61, 196, 87.31, 110, 130.81,
  110, 130.81, 164.81, 196, 233.08,
];
