import { useEffect, useState } from "react";

function getInitial(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion(): boolean {
  // Lazy-initialize from matchMedia synchronously on first render so the
  // very first GSAP effect run already sees the correct value instead of
  // briefly starting an animation it then has to tear down.
  const [reduced, setReduced] = useState(getInitial);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
