import { useEffect, useState } from "react";
export const prefersReducedMotion = () =>
  typeof window != "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export function isComfortablyInView(element) {
  if (!element) return true;
  const rect = element.getBoundingClientRect();
  return rect.top >= 64 && rect.top < window.innerHeight * 0.6;
}
// Tracks a CSS media query. Reads it synchronously on first render to avoid a layout flash.
export function useMediaQuery(query) {
  const get = () => typeof window != "undefined" && !!window.matchMedia && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
