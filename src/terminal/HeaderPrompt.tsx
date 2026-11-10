import { useEffect, useRef, useState } from "react";
import PromptInput from "./PromptInput";
import TermLines from "./TermLines";
import { useSlashFocus, useTerminal } from "./useTerminal";
import { HEADER_RUN_EVENT } from "./headerBus";
import "./Terminal.css";

/** Version D: a prompt in the sticky header, reachable from anywhere on the page. */
export default function HeaderPrompt() {
  const term = useTerminal();
  const { run } = term;
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useSlashFocus(inputRef);

  const runAndShow = (command: string) => {
    run(command);
    setOpen(true);
  };

  useEffect(() => {
    const onRun = (e: Event) => {
      run((e as CustomEvent<string>).detail);
      setOpen(true);
      inputRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener(HEADER_RUN_EVENT, onRun);
    return () => window.removeEventListener(HEADER_RUN_EVENT, onRun);
  }, [run]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const last = term.entries[term.entries.length - 1];

  return (
    <div className="hprompt" ref={rootRef}>
      <PromptInput
        id="term-header-input"
        className="hprompt__form"
        inputRef={inputRef}
        onRun={runAndShow}
        onPrint={(lines) => {
          term.print(lines);
          setOpen(true);
        }}
        recall={term.recall}
        placeholder="type help…"
      />
      <kbd className="hprompt__kbd" aria-hidden="true">
        /
      </kbd>
      {open && last && (
        <div className="hprompt__pop panel" role="log" aria-live="polite" aria-label="Command output">
          <div className="panel__bar">
            <span>output</span>
            <button type="button" className="hprompt__close" onClick={() => setOpen(false)}>
              esc
            </button>
          </div>
          <div className="term__screen">
            {last.input !== undefined && (
              <p className="term__echo">
                <span className="prompt__sign">~ $</span> {last.input}
              </p>
            )}
            <TermLines lines={last.lines} onRun={runAndShow} />
          </div>
        </div>
      )}
    </div>
  );
}
