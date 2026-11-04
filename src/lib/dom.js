export const prefersReducedMotion = () =>
  typeof window != "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export function isComfortablyInView(element) {
  if (!element) return true;
  const rect = element.getBoundingClientRect();
  return rect.top >= 64 && rect.top < window.innerHeight * 0.6;
}
