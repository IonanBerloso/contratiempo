import { SAMPLE_CHOREOS } from "../data/choreographies.js";
import { DEMO_ACCESS_CODES } from "../data/dancers.js";
import { SAMPLE_LAST_CLASS } from "../data/lastClass.js";
import { DEFAULT_WARMUP, buildDemoPracticeLog } from "../data/practice.js";
import { SAMPLE_RHYTHMS } from "../data/rhythms.js";
import { DEFAULT_TAP_VOCAB } from "../data/tapVocabulary.js";
import { DEFAULT_PLANK_COUNTS } from "../data/txalaparta.js";
import { migrateLegacyRhythm } from "./txalaparta.js";
export const createDefaultState = () => ({
  mode: "bailarina",
  me: "laura",
  choreoId: null,
  view: "publico",
  prefs: {
    rate: 1,
    metro: true,
    muted: false,
    voice: false,
  },
  choreos: deepClone(SAMPLE_CHOREOS),
  clipMeta: {},
  lastClass: deepClone(SAMPLE_LAST_CLASS),
  seen: {
    nerea: ["c6"],
  },
  hard: {
    irati: ["c3"],
    maialen: ["c5"],
    nerea: ["c5"],
    sofia: ["c8"],
  },
  codes: {
    ...DEMO_ACCESS_CODES,
  },
  vocab: deepClone(DEFAULT_TAP_VOCAB),
  sync: {},
  sel: {
    otono: {
      blockId: "o3",
      clipId: "c5",
    },
  },
  rhythms: deepClone(SAMPLE_RHYTHMS),
  tallerId: null,
  instruments: {
    ...DEFAULT_PLANK_COUNTS,
  },
  warmup: deepClone(DEFAULT_WARMUP),
  practice: buildDemoPracticeLog(),
});
export function migrateState(saved) {
  const defaults = createDefaultState();
  if (!saved || (saved.v !== 2 && saved.v !== 3 && saved.v !== 4))
    return defaults;
  const merged = {
    ...defaults,
    ...saved,
    prefs: {
      ...defaults.prefs,
      ...(saved.prefs || {}),
    },
    vocab: {
      sounds: {
        ...defaults.vocab.sounds,
        ...(saved.vocab || {}).sounds,
      },
      steps: {
        ...defaults.vocab.steps,
        ...(saved.vocab || {}).steps,
      },
    },
  };
  if (saved.v === 2) {
    merged.choreos = [
      ...saved.choreos,
      ...defaults.choreos.filter(
        (defChoreo) =>
          !saved.choreos.some((savedChoreo) => savedChoreo.id === defChoreo.id),
      ),
    ];
    merged.rhythms = defaults.rhythms;
    merged.tallerId = null;
  }
  merged.choreos = merged.choreos.map((choreo) => {
    const defaultChoreo = defaults.choreos.find(
      (candidate) => candidate.id === choreo.id,
    );
    return !defaultChoreo || choreo.show !== undefined
      ? choreo
      : {
          ...choreo,
          show: defaultChoreo.show || null,
          week: defaultChoreo.week || "",
          links: defaultChoreo.links || [],
          blocks: choreo.blocks.map((block) => {
            const defaultBlock = defaultChoreo.blocks.find(
              (candidateBlock) => candidateBlock.id === block.id,
            );
            return defaultBlock && block.done === undefined
              ? {
                  ...block,
                  done: !!defaultBlock.done,
                }
              : block;
          }),
        };
  });
  merged.choreos = merged.choreos.map((choreoItem) => {
    const sampleChoreo = defaults.choreos.find(
      (sampleCandidate) => sampleCandidate.id === choreoItem.id,
    );
    return sampleChoreo &&
      sampleChoreo.logistics &&
      choreoItem.logistics === undefined
      ? {
          ...choreoItem,
          logistics: sampleChoreo.logistics,
        }
      : choreoItem;
  });
  merged.rhythms = (merged.rhythms || defaults.rhythms).map((rhythm) => {
    const normalized = migrateLegacyRhythm(rhythm);
    return rhythm.id === "rx1" && normalized.planks === 2
      ? {
          ...defaults.rhythms[0],
          name: rhythm.name,
          moves: rhythm.moves,
        }
      : normalized;
  });
  for (let defaultRhythm of defaults.rhythms) {
    if (
      !merged.rhythms.some((existing) => existing.id === defaultRhythm.id) &&
      saved.v !== 4
    ) {
      merged.rhythms.push(defaultRhythm);
    }
  }
  merged.instruments = {
    ...DEFAULT_PLANK_COUNTS,
    ...(saved.instruments || {}),
  };
  merged.hard = saved.hard || defaults.hard;
  merged.warmup = Array.isArray(saved.warmup) ? saved.warmup : defaults.warmup;
  merged.practice = saved.practice || defaults.practice;
  return merged;
}
export const deepClone = (value) => JSON.parse(JSON.stringify(value));
