import { DEFAULT_PLANK_COUNTS, FOOT_STRIKES } from "../data/txalaparta.js";
import { findDancerById } from "./dancers.js";
import { positiveMod } from "./math.js";
export const plankFrequency = (plankIndex, plankCount) =>
  170 * Math.pow(380 / 170, plankCount > 1 ? plankIndex / (plankCount - 1) : 0);
export const txalapartaMaterialLabel = (material) =>
  material === "piedra"
    ? "piedra"
    : material === "ambas"
      ? "madera y piedra"
      : "madera";
const strikeMaterialCode = (strike, rhythm) =>
  strike.m || (rhythm.material === "piedra" ? "s" : "w");
export function rhythmPlanks(rhythm, instruments) {
  const woodPlanks = Array.from(
    {
      length: instruments.wood,
    },
    (l, woodIdx) => ({
      m: "w",
      i: woodIdx,
      n: instruments.wood,
      key: `w${woodIdx}`,
    }),
  );
  const stonePlanks = Array.from(
    {
      length: instruments.stone,
    },
    (l, stoneIdx) => ({
      m: "s",
      i: stoneIdx,
      n: instruments.stone,
      key: `s${stoneIdx}`,
    }),
  );
  return rhythm.material === "piedra"
    ? stonePlanks
    : rhythm.material === "ambas"
      ? [...woodPlanks, ...stonePlanks]
      : woodPlanks;
}
export const strikeTargetKey = (strike, rhythm) =>
  strike.p === "pi"
    ? `f${strike.plank}`
    : `${strikeMaterialCode(strike, rhythm)}${strike.plank}`;
export function isStrikePlayable(strike, rhythm, planks, totalBeats) {
  if (strike.b >= totalBeats) return false;
  if (strike.p === "pi")
    return !!rhythm.feet && strike.plank < FOOT_STRIKES.length;
  const targetKey = strikeTargetKey(strike, rhythm);
  return planks.some((plank) => plank.key === targetKey);
}
export function strikeToSound(strike, rhythm, instruments) {
  if (strike.p === "pi")
    return {
      s: FOOT_STRIKES[strike.plank].key,
      arg: {
        key: `f${strike.plank}`,
      },
    };
  const materialCode = strikeMaterialCode(strike, rhythm);
  const plankCount =
    materialCode === "s" ? instruments.stone : instruments.wood;
  return {
    s: "tx",
    arg: {
      f: plankFrequency(strike.plank, plankCount),
      hr: strike.p === "hr",
      stone: materialCode === "s",
      key: `${materialCode}${strike.plank}`,
    },
  };
}
function rhythmSoundEvents(rhythm, instruments) {
  const totalBeats = rhythm.eights * 8;
  const planks = rhythmPlanks(rhythm, instruments);
  return rhythm.layers
    .filter((layer) => !layer.muted)
    .flatMap((activeLayer) =>
      activeLayer.strikes
        .filter((strike) =>
          isStrikePlayable(strike, rhythm, planks, totalBeats),
        )
        .map((playable) => ({
          b: playable.b,
          ...strikeToSound(playable, rhythm, instruments),
        })),
    );
}
export function withRhythmMaterial(rhythm, material) {
  if (material === rhythm.material) return rhythm;
  if (material !== "ambas" || rhythm.material === "ambas")
    return {
      ...rhythm,
      material,
    };
  const previousCode = rhythm.material === "piedra" ? "s" : "w";
  return {
    ...rhythm,
    material,
    layers: rhythm.layers.map((layer) => ({
      ...layer,
      strikes: layer.strikes.map((strike) =>
        strike.p === "pi" || strike.m
          ? strike
          : {
              ...strike,
              m: previousCode,
            },
      ),
    })),
  };
}
export function countUnplayableStrikes(rhythm, instruments) {
  const totalBeats = rhythm.eights * 8;
  const planks = rhythmPlanks(rhythm, instruments);
  let unplayable = 0;
  for (let layer of rhythm.layers)
    for (let strike of layer.strikes) {
      if (
        strike.b < totalBeats &&
        !isStrikePlayable(strike, rhythm, planks, totalBeats)
      ) {
        unplayable++;
      }
    }
  return unplayable;
}
export function migrateLegacyRhythm(rhythm) {
  return rhythm.layers.some((layer) =>
    layer.strikes.some((strike) => strike.lane != null),
  )
    ? {
        ...rhythm,
        material: rhythm.material || "madera",
        layers: rhythm.layers.map((rhythmLayer) => ({
          ...rhythmLayer,
          strikes: rhythmLayer.strikes.map((oldStrike) =>
            oldStrike.lane != null
              ? {
                  b: oldStrike.b,
                  plank: oldStrike.lane % 2,
                  p: oldStrike.lane < 2 ? "tk" : "hr",
                }
              : oldStrike,
          ),
        })),
      }
    : {
        material: "madera",
        ...rhythm,
      };
}
export function rhythmToLoop(rhythm, instruments) {
  return {
    id: rhythm.id,
    name: rhythm.name,
    loopBeats: rhythm.eights * 8,
    sounds: rhythmSoundEvents(rhythm, instruments || DEFAULT_PLANK_COUNTS),
    moves: rhythm.moves || [],
  };
}
export const plankLabel = (plank) =>
  `${plank.m === "s" ? "Piedra" : "Madera"} ${plank.i + 1}`;
export const TXALAPARTA_PLANK_ROLES = ["hr", "tk"];
export const TXALAPARTA_ROLE_LABELS = {
  tk: "Ttakun",
  hr: "Herren",
  pi: "Pies",
};
export const TXALAPARTA_ROLE_KEYS = {
  hr: "asdfghjkl",
  tk: "zxcvbnm,.",
  pi: "1234",
};
export const TXALAPARTA_ROLE_COLORS = {
  tk: "#EE7447",
  hr: "#38B8CC",
  pi: "#B794F6",
};
export const TXALAPARTA_SNAP_STEPS = {
  8: 0.5,
  16: 0.25,
  free: null,
};
export const TXALAPARTA_COUNT_IN_BEATS = 4;
export const TXALAPARTA_LOOKAHEAD_SEC = 0.12;
export const TXALAPARTA_LABEL_COLUMN_PX = 26;
export const TXALAPARTA_FEET_COLUMN_SHARE = 0.16;
export const TXALAPARTA_HIT_WINDOW_SEC = 0.11;
export const beatToEightCount = (beat) =>
  (((Math.floor(beat + 1e-6) % 8) + 8) % 8) + 1;
export const rhythmAuthorLabel = (author) =>
  author === "profe"
    ? "la profe"
    : findDancerById(author)
      ? findDancerById(author).name
      : author;
export const beatPositionLabel = (beat) => {
  const quarters = Math.round(beat * 4);
  return `${beatToEightCount(Math.floor(quarters / 4))}${["", " ·", " y", " ·"][positiveMod(quarters, 4)]}`;
};
export const plankPitchLabel = (column) =>
  column.n < 2
    ? ""
    : column.i === 0
      ? "grave"
      : column.i === column.n - 1
        ? "aguda"
        : "";
export const scoreStars = (hits, total) => {
  if (!total) return "";
  const ratio = hits / total;
  return ratio >= 1
    ? "★★★"
    : ratio >= 0.8
      ? "★★☆"
      : ratio >= 0.5
        ? "★☆☆"
        : "☆☆☆";
};
export function layerRoles(layer) {
  return {
    tk: layer.strikes.some((strike) => strike.p === "tk"),
    hr: layer.strikes.some((strike) => strike.p === "hr"),
    pi: layer.strikes.some((strike) => strike.p === "pi"),
  };
}
