import { useEffect, useRef, type MouseEvent } from "react";
import { recentLogLines } from "./commands";
import PromptInput from "./PromptInput";
import TermLines from "./TermLines";
import { useSlashFocus, useTerminal } from "./useTerminal";
import "./Terminal.css";

const SUGGESTIONS = ["help", "ls projects", "cd experience", "open resume"];
const INITIAL = [{ id: 0, input: "cat recent.log", lines: recentLogLines() }];

/** Version A: a real prompt under the recent.log output, with one-click suggestions. */
export default function TerminalShell() {
  const term = useTerminal(INITIAL);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  useSlashFocus(inputRef);

  useEffect(() => {
    const screen = screenRef.current;
    if (screen) screen.scrollTop = screen.scrollHeight;
  }, [term.entries]);

  // Clicking empty space in the terminal puts the cursor in the prompt, like a real one.
  const focusPrompt = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button, input") || window.getSelection()?.toString()) return;
    inputRef.current?.focus();
  };

  return (
    <div className="term panel" role="group" aria-label="Terminal" onClick={focusPrompt}>
      <div className="panel__bar">
        <span>zsh: ~/sevara</span>
        <span>tab completes</span>
      </div>
      <div className="term__screen" ref={screenRef} role="log" aria-live="polite" aria-label="Terminal output">
        {term.entries.map((entry) => (
          <div className="term__entry" key={entry.id}>
            {entry.input !== undefined && (
              <p className="term__echo">
                <span className="prompt__sign">~ $</span> {entry.input}
              </p>
            )}
            <TermLines lines={entry.lines} onRun={term.run} />
          </div>
        ))}
      </div>
      <PromptInput
        id="term-shell-input"
        inputRef={inputRef}
        onRun={term.run}
        onPrint={(lines) => term.print(lines)}
        recall={term.recall}
        placeholder="try help or cd projects…"
      />
      <div className="term__chips" aria-label="Suggested commands">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className="term__chip" onClick={() => term.run(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
