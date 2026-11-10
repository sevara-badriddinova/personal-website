import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently under the sticky header, so the nav can
 * mark where you are. Uses IntersectionObserver: no scroll listeners.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const sections = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (records) => {
        for (const r of records) visible.set(r.target.id, r.isIntersecting);
        // When two sections share the band, the lower one has just arrived: it's current.
        const current = sections.findLast((s) => visible.get(s.id));
        setActive(current ? current.id : null);
      },
      // A thin band just below the header: the section crossing it is "current".
      { rootMargin: "-90px 0px -70% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
