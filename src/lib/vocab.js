export const vocabStepName = (vocab, stepKey) =>
  vocab.steps[stepKey] ? vocab.steps[stepKey].name : stepKey;
export const vocabSoundAbbr = (vocab, soundKey) =>
  vocab.sounds[soundKey] ? vocab.sounds[soundKey].abbr : soundKey;
