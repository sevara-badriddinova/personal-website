import { useEffect, useState } from "react";

/** Copies `text` to the clipboard and confirms in place ("copied") for two seconds. */
export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const id = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(id);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <button type="button" className="copy-btn" onClick={copy} aria-label={label}>
      <span aria-live="polite">{state === "copied" ? "copied" : state === "failed" ? "press ⌘C" : "copy"}</span>
    </button>
  );
}
