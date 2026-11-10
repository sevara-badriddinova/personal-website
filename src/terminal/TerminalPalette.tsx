import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { contact, posts, projects, recentLog } from "../data/content";
import { execute, type Line } from "./commands";
import TermLines from "./TermLines";
import { perform, useSlashFocus } from "./useTerminal";
import "./Terminal.css";

type Item = { command: string; label: string; hint?: string };

const value = (scope: string) => recentLog.find((e) => e.scope === scope)?.value;

// Each row is a command and where it takes you. Hints carry the proof from recent.log.
const ITEMS: Item[] = [
  { command: "cd experience", label: "Maya, Mayasoft, GDG, USF", hint: value("maya") },
  { command: "cd projects", label: `${projects.length} projects`, hint: `${value("jobradar")} LLM calls` },
  { command: "open jobradar", label: "JobRadar code", hint: "736K+ postings" },
  { command: "open bilimly", label: "Bilimly.ai live site", hint: `${value("bilimly")} daily users` },
  { command: "open eltunnel", label: "Eltunnel code", hint: "Go, WebSockets" },
  ...(posts.length > 0 ? [{ command: "cd writing", label: `${posts.length} drafts` }] : []),
  { command: "whoami", label: "About me" },
  { command: "open resume", label: "resume.pdf" },
  { command: "mail", label: contact.email },
  { command: "open github", label: "github.com/sevara-badriddinova" },
  { command: "open linkedin", label: "LinkedIn profile" },
];

function score(item: Item, query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const command = item.command.toLowerCase();
  if (command.startsWith(q)) return 0;
  if (command.includes(q)) return 1;
  const hay = `${command} ${item.label.toLowerCase()}`;
  if (hay.includes(q)) return 2;
  // fuzzy: every character, in order
  let i = 0;
  for (const ch of hay) if (ch === q[i]) i++;
  return i === q.length ? 3 : -1;
}

/** Version B: a filterable command list. Type to filter, arrows to move, Enter to go. */
export default function TerminalPalette() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [output, setOutput] = useState<{ input: string; lines: Line[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useSlashFocus(inputRef);

  const matches = useMemo(
    () =>
      ITEMS.map((item) => ({ item, s: score(item, query) }))
        .filter((m) => m.s >= 0)
        .sort((a, b) => a.s - b.s)
        .map((m) => m.item),
    [query]
  );
  const current = Math.min(active, Math.max(matches.length - 1, 0));

  const run = (command: string) => {
    const result = execute(command);
    setOutput(result.effect?.type === "clear" ? null : { input: command, lines: result.lines });
    perform(result.effect);
    setQuery("");
    setActive(0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (matches.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((current + step + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (matches.length > 0) run(matches[current].command);
      else if (query.trim()) run(query);
    } else if (e.key === "Escape") {
      if (query) setQuery("");
      else inputRef.current?.blur();
    }
  };

  const optionId = (i: number) => `palette-option-${i}`;

  return (
    <div className="term term--palette panel" role="group" aria-label="Command palette">
      <div className="panel__bar">
        <span>jump to</span>
        <span>
          <kbd>/</kbd> or <kbd>⌘K</kbd>
        </span>
      </div>
      <div className="palette__field">
        <label htmlFor="term-palette-input" className="term-prompt__sign">
          <span aria-hidden="true">~ $</span>
          <span className="sr-only">Filter commands, or type one and press Enter</span>
        </label>
        <input
          id="term-palette-input"
          ref={inputRef}
          className="term-prompt__input"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-autocomplete="list"
          aria-activedescendant={matches.length > 0 ? optionId(current) : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="filter, or type a command…"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
        />
      </div>
      <ul id="palette-list" className="palette__list" role="listbox" aria-label="Commands">
        {matches.map((item, i) => (
          <li
            key={item.command}
            id={optionId(i)}
            role="option"
            aria-selected={i === current}
            className="palette__item"
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setActive(i)}
            onClick={() => run(item.command)}
          >
            <span className="palette__cmd">{item.command}</span>
            <span className="palette__label">{item.label}</span>
            {item.hint && <span className="palette__hint">{item.hint}</span>}
          </li>
        ))}
        {matches.length === 0 && (
          <li className="palette__empty" role="presentation">
            No match. Press Enter to run “{query.trim()}” as a command.
          </li>
        )}
      </ul>
      {output && (
        <div className="palette__out" role="status">
          <p className="term__echo">
            <span className="prompt__sign">~ $</span> {output.input}
          </p>
          <TermLines lines={output.lines} onRun={run} />
        </div>
      )}
      <p className="palette__keys" aria-hidden="true">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> move
        </span>
        <span>
          <kbd>enter</kbd> go
        </span>
        <span>
          <kbd>esc</kbd> clear
        </span>
      </p>
    </div>
  );
}
