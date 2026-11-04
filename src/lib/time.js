import { countEights } from "./choreography.js";
export function estimateTempoFromTaps(taps) {
  const count = taps.length;
  if (count < 2) return null;
  const meanIndex = (count - 1) / 2;
  const meanTime = taps.reduce((sum, time) => sum + time, 0) / count;
  let covariance = 0;
  let variance = 0;
  taps.forEach((tapTime, tapIdx) => {
    covariance += (tapIdx - meanIndex) * (tapTime - meanTime);
    variance += (tapIdx - meanIndex) * (tapIdx - meanIndex);
  });
  const r = covariance / variance;
  return r > 0.25 && r < 1.5
    ? {
        bpm: Math.round(600 / r) / 10,
        offset: Math.max(0, meanTime - r * meanIndex),
      }
    : null;
}
export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return null;
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 864e5);
}
const WEEKDAY_ABBR = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTH_ABBR = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
export function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `${WEEKDAY_ABBR[date.getDay()]} ${day} ${MONTH_ABBR[month - 1]}`;
}
export function daysLeftLabel(days) {
  return days == null
    ? ""
    : days < 0
      ? "ya pasó"
      : days === 0
        ? "¡es hoy!"
        : days === 1
          ? "falta 1 día"
          : `faltan ${days} días`;
}
const applySwing = (straightBeat) => {
  const wholeBeat = Math.floor(straightBeat);
  const fraction = straightBeat - wholeBeat;
  return (
    wholeBeat +
    (fraction <= 0.5
      ? (fraction * 4) / 3
      : 0.6666666666666666 + ((fraction - 0.5) * 2) / 3)
  );
};
const removeSwing = (swungBeat) => {
  const wholeBeat = Math.floor(swungBeat);
  const fraction = swungBeat - wholeBeat;
  return (
    wholeBeat +
    (fraction <= 0.6666666666666666
      ? fraction * 0.75
      : 0.5 + (fraction - 0.6666666666666666) * 1.5)
  );
};
const secondsPerBeat = (clip) => 60 / clip.bpm;
export function beatToSeconds(clip, beat) {
  let position = beat + 4;
  if (clip.swing) {
    position = applySwing(position);
  }
  return position * secondsPerBeat(clip);
}
export function secondsToBeat(clip, seconds) {
  let position = seconds / secondsPerBeat(clip);
  if (clip.swing) {
    position = removeSwing(position);
  }
  return position - 4;
}
export function clipDurationSeconds(clip) {
  return (clip.counts + 4) * secondsPerBeat(clip);
}
export function countInEight(beat) {
  return (((Math.floor(beat + 1e-6) % 8) + 8) % 8) + 1;
}
export const SUBDIVISION_MARKS = ["", "·", "y", "·"];
export function subdivisionMark(beat) {
  const sixteenth = Math.floor(beat * 4 + 1e-6);
  return SUBDIVISION_MARKS[((sixteenth % 4) + 4) % 4];
}
export function countLabel(beat) {
  return ((Math.floor(beat * 4 + 1e-6) % 4) + 4) % 4 === 2
    ? `${countInEight(beat)} y`
    : `${countInEight(beat)}`;
}
export const formatMinSec = (seconds) => {
  const rounded = Math.max(0, Math.round(seconds));
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, "0")}`;
};
export const parseMinSec = (text) => {
  const parts = String(text || "")
    .trim()
    .match(/^(\d{1,2})(?:[:.,'](\d{1,2}))?$/);
  return parts ? Number(parts[1]) * 60 + Number(parts[2] || 0) : null;
};
export const choreoDurationSec = (choreo) =>
  (countEights(choreo.blocks) * 8 * 60) / choreo.bpm;
export const localDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
