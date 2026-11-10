import { useState, type KeyboardEvent, type RefObject } from "react";
import { complete, optionLines, type Line } from "./commands";

type Props = {
  id: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onRun: (command: string) => void;
  onPrint: (lines: Line[]) => void;
  recall: (direction: -1 | 1) => string | undefined;
  placeholder?: string;
  className?: string;
};

/** The `~ $` line you type into. Enter runs, Tab completes, ↑/↓ walk history, Esc clears. */
export default function PromptInput({ id, inputRef, onRun, onPrint, recall, placeholder, className }: Props) {
  const [value, setValue] = useState("");

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && value.trim()) {
      e.preventDefault();
      const result = complete(value);
      setValue(result.value);
      if (result.options.length > 1) {
        const prefix = value.trim().includes(" ") ? value.trim().split(/\s+/)[0] : "";
        onPrint(optionLines(prefix, result.options));
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const next = recall(e.key === "ArrowUp" ? -1 : 1);
      if (next !== undefined) {
        e.preventDefault();
        setValue(next);
      }
    } else if (e.key === "Escape") {
      setValue("");
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      onRun("clear");
    }
  };

  return (
    <form
      className={className ? `term-prompt ${className}` : "term-prompt"}
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onRun(value);
        setValue("");
      }}
    >
      <label htmlFor={id} className="term-prompt__sign">
        <span aria-hidden="true">~ $</span>
        <span className="sr-only">Type a command</span>
      </label>
      <input
        id={id}
        ref={inputRef}
        className="term-prompt__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="go"
      />
    </form>
  );
}
