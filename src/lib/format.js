export const pluralizeCount = (count, singular, plural) =>
  `${count} ${count === 1 ? singular : plural}`;
export function joinSpanishList(items) {
  return items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}
export function formatClockTenths(totalSeconds) {
  if (!isFinite(totalSeconds) || totalSeconds < 0) {
    totalSeconds = 0;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((totalSeconds % 1) * 10);
  return `${minutes}:${String(seconds).padStart(2, "0")},${tenths}`;
}
export const formatRate = (rate) =>
  `${String(Math.round(rate * 100) / 100).replace(".", ",")}×`;
export const formatCountdown = (seconds) => {
  const totalSecs = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(totalSecs / 60)}:${String(totalSecs % 60).padStart(2, "0")}`;
};
export const spokenDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const restSecs = seconds % 60;
  return minutes
    ? restSecs
      ? `${minutes === 1 ? "un minuto" : `${minutes} minutos`} y ${restSecs} segundos`
      : minutes === 1
        ? "un minuto"
        : `${minutes} minutos`
    : `${restSecs} segundos`;
};
