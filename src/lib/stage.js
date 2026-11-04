import { FORMATION_PRESETS } from "../data/formations.js";
export const stageNumber = (x) => Math.round((Math.abs(x - 50) / 50) * 8);
export const stageSideLabel = (x) =>
  stageNumber(x) === 0 ? "centro" : x < 50 ? "derecha" : "izquierda";
export const stageDepthLabel = (y) =>
  y >= 66
    ? "delante, cerca del público"
    : y >= 36
      ? "en medio del escenario"
      : "al fondo";
export const stageNumberLabel = ([x]) =>
  stageNumber(x) === 0
    ? "centro (0)"
    : `${stageNumber(x)} ${stageSideLabel(x)}`;
export function applyFormationPreset(presetId, positions) {
  const preset = FORMATION_PRESETS.find(
    (formation) => formation.id === presetId,
  );
  const dancerIds = Object.keys(positions);
  const slots = preset
    .slots(dancerIds.length)
    .map(([sx, sy]) => [Math.round(sx * 2) / 2, Math.round(sy * 2) / 2]);
  const dancersByPosition = [...dancerIds].sort(
    (idA, idB) =>
      positions[idA][0] - positions[idB][0] ||
      positions[idA][1] - positions[idB][1],
  );
  const slotOrder = slots
    .map((slot, slotIdx) => slotIdx)
    .sort(
      (slotA, slotB) =>
        slots[slotA][0] - slots[slotB][0] || slots[slotA][1] - slots[slotB][1],
    );
  const assigned = {};
  dancersByPosition.forEach((dancerId, rank) => {
    assigned[dancerId] = slots[slotOrder[rank]];
  });
  return assigned;
}
const STAGE_X_WEIGHT = 1;
const STAGE_Y_WEIGHT = 11 / 16;
const STAGE_COLLISION_DISTANCE = 7;
export function detectStageConflicts(prevPositions, positions) {
  if (!positions) return [];
  const ids = Object.keys(positions);
  const conflicts = [];
  for (let first = 0; first < ids.length; first++)
    for (let second = first + 1; second < ids.length; second++) {
      const idA = ids[first];
      const idB = ids[second];
      const posA = positions[idA];
      const posB = positions[idB];
      if (
        Math.hypot(
          (posA[0] - posB[0]) * STAGE_X_WEIGHT,
          (posA[1] - posB[1]) * STAGE_Y_WEIGHT,
        ) < STAGE_COLLISION_DISTANCE
      ) {
        conflicts.push({
          a: idA,
          b: idB,
          kind: "juntas",
        });
        continue;
      }
      if (!prevPositions || !prevPositions[idA] || !prevPositions[idB])
        continue;
      const prevA = prevPositions[idA];
      const prevB = prevPositions[idB];
      const startDelta = [
        (prevA[0] - prevB[0]) * STAGE_X_WEIGHT,
        (prevA[1] - prevB[1]) * STAGE_Y_WEIGHT,
      ];
      const motionDelta = [
        (posA[0] - prevA[0] - (posB[0] - prevB[0])) * STAGE_X_WEIGHT,
        (posA[1] - prevA[1] - (posB[1] - prevB[1])) * STAGE_Y_WEIGHT,
      ];
      const motionSq =
        motionDelta[0] * motionDelta[0] + motionDelta[1] * motionDelta[1];
      if (!motionSq) continue;
      const closestT = Math.max(
        0,
        Math.min(
          1,
          -(startDelta[0] * motionDelta[0] + startDelta[1] * motionDelta[1]) /
            motionSq,
        ),
      );
      if (
        Math.hypot(
          startDelta[0] + closestT * motionDelta[0],
          startDelta[1] + closestT * motionDelta[1],
        ) < STAGE_COLLISION_DISTANCE &&
        closestT > 0.02 &&
        closestT < 0.98
      ) {
        conflicts.push({
          a: idA,
          b: idB,
          kind: "cruce",
        });
      }
    }
  return conflicts;
}
