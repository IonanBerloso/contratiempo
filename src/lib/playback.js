export function rhythmBackingEvents(
  rhythm,
  startBeat,
  spanBeats,
  isSilentEight,
) {
  const events = [];
  for (let loopStart = 0; loopStart < spanBeats; loopStart += rhythm.loopBeats)
    for (let sound of rhythm.sounds) {
      const beat = loopStart + sound.b;
      if (!(beat >= spanBeats || isSilentEight(Math.floor(beat / 8) + 1))) {
        events.push({
          b: startBeat + beat,
          s: sound.s,
          arg: sound.arg,
        });
      }
    }
  return events;
}
