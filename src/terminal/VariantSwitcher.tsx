import { useEffect } from "react";
import type { TerminalVariant } from "../data/content";
import "./Terminal.css";

const VARIANTS: { id: TerminalVariant; label: string }[] = [
  { id: "shell", label: "A shell" },
  { id: "palette", label: "B palette" },
  { id: "ls", label: "C ls -la" },
  { id: "header", label: "D header prompt" },
];

/** Preview-only bar for comparing terminal versions. Built only with VITE_TERMINAL_SWITCHER=1. */
export default function VariantSwitcher({
  value,
  onChange,
}: {
  value: TerminalVariant;
  onChange: (v: TerminalVariant) => void;
}) {
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("terminal");
    const match = VARIANTS.find((v) => v.id === wanted);
    if (match) onChange(match.id);
  }, [onChange]);

  return (
    <div className="switcher" role="group" aria-label="Terminal version">
      <span className="switcher__label">terminal version</span>
      {VARIANTS.map((v) => (
        <button
          key={v.id}
          type="button"
          className="switcher__btn"
          aria-pressed={value === v.id}
          onClick={() => {
            onChange(v.id);
            window.scrollTo({ top: 0 });
          }}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
