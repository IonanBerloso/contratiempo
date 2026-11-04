export const clamp = (value, lower, upper) =>
  Math.max(lower, Math.min(upper, value));
export function createSeededRandom(seed) {
  let state = seed;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}
export function rotatePoint(x, y, angle) {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  return [x * cosA - y * sinA, x * sinA + y * cosA];
}
export const easeInOutQuad = (progress) =>
  progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
export const positiveMod = (value, cycleLength) =>
  ((value % cycleLength) + cycleLength) % cycleLength;
