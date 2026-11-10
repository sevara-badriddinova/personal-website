import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { execute, type Effect, type Line, type Result } from "./commands";

export type Entry = { id: number; input?: string; lines: Line[] };

/** Carry out a command's side effect: scroll to a section or open a link. */
export function perform(effect?: Effect) {
  if (!effect || typeof window === "undefined") return;
  if (effect.type === "scroll") {
    const id = effect.id;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Wait two frames so the command's own output has rendered; otherwise the page
    // grows mid-scroll and the jump lands short of the section.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      })
    );
    // Keep the URL in step so the place you jumped to can be shared or reloaded.
    const url = id === "top" ? window.location.pathname + window.location.search : `#${id}`;
    window.history.replaceState(null, "", url);
  } else if (effect.type === "open") {
    const external = /^https?:\/\//.test(effect.href);
    // Pages of this site (a post) open in place; other sites in a new tab.
    if (!external) window.location.assign(effect.href);
    else window.open(effect.href, "_blank", "noopener,noreferrer");
  }
}

/** Transcript, history and command running for one terminal. */
export function useTerminal(initial: Entry[] = []) {
  const [entries, setEntries] = useState<Entry[]>(initial);
  const nextId = useRef(initial.length);
  const history = useRef<string[]>([]);
  const cursor = useRef<number | null>(null);

  const print = useCallback((lines: Line[], input?: string) => {
    const id = nextId.current++;
    setEntries((prev) => [...prev, { id, input, lines }].slice(-40));
  }, []);

  const run = useCallback(
    (raw: string): Result => {
      const input = raw.trim();
      cursor.current = null;
      if (input && history.current[history.current.length - 1] !== input) history.current.push(input);
      const result = execute(input);
      if (result.effect?.type === "clear") setEntries([]);
      else print(result.lines, input);
      perform(result.effect);
      return result;
    },
    [print]
  );

  /** Step through history: -1 = older, 1 = newer. Returns undefined when there is nothing to show. */
  const recall = useCallback((direction: -1 | 1): string | undefined => {
    const items = history.current;
    if (items.length === 0) return undefined;
    let next = cursor.current ?? items.length;
    next = Math.min(Math.max(next + direction, 0), items.length);
    cursor.current = next;
    return next === items.length ? "" : items[next];
  }, []);

  return { entries, run, print, recall };
}

/** Focus `ref` when someone presses "/" or ⌘K/Ctrl+K outside a text field. */
export function useSlashFocus(ref: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      const slash = e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey;
      const commandK = e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey);
      if (slash || commandK) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ref]);
}
