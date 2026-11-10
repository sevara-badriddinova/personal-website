import { useEffect, useRef, useState } from "react";
import { contact, experience, posts, projects, recentLog, site } from "../data/content";
import { recentLogLines } from "./commands";
import PromptInput from "./PromptInput";
import TermLines from "./TermLines";
import { useSlashFocus, useTerminal } from "./useTerminal";
import "./Terminal.css";

type Row = { perms: string; name: string; info: string; dir?: boolean; run?: string; href?: string; toggle?: boolean };

const ROWS: Row[] = [
  {
    perms: "drwxr-xr-x",
    name: "experience/",
    info: experience.map((e) => e.handle.split("-")[0]).join(", "),
    dir: true,
    run: "cd experience",
  },
  { perms: "drwxr-xr-x", name: "projects/", info: `${projects.length} projects`, dir: true, run: "cd projects" },
  ...(posts.length > 0 ? [{ perms: "drwxr-xr-x", name: "writing/", info: `${posts.length} drafts`, dir: true, run: "cd writing" }] : []),
  { perms: "-rw-r--r--", name: "recent.log", info: `${recentLog.length} results`, toggle: true },
  { perms: "-rw-r--r--", name: "about.md", info: "how I work", run: "whoami" },
  { perms: "-rw-r--r--", name: "resume.pdf", info: "1 page", href: site.resume },
  { perms: "-rw-r--r--", name: "contact.txt", info: contact.email, run: "mail" },
  { perms: "lrwxr-xr-x", name: "github", info: "→ sevara-badriddinova", href: contact.github },
  { perms: "lrwxr-xr-x", name: "linkedin", info: "→ sevarabadriddinova", href: contact.linkedin },
];

/** Version C: a clickable `ls -la` of the site. Every entry goes somewhere; typing works too. */
export default function TerminalLs() {
  const term = useTerminal();
  const [logOpen, setLogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  useSlashFocus(inputRef);

  useEffect(() => {
    const screen = screenRef.current;
    if (screen && term.entries.length > 0) screen.scrollTop = screen.scrollHeight;
  }, [term.entries]);

  return (
    <div className="term term--ls panel" role="group" aria-label="Site listing">
      <div className="panel__bar">
        <span>~/sevara</span>
        <span>click a name, or type</span>
      </div>
      <div className="term__screen" ref={screenRef}>
        <p className="term__echo">
          <span className="prompt__sign">~ $</span> ls -la
        </p>
        <ul className="ls">
          {ROWS.map((row) => (
            <li className="ls__row" key={row.name}>
              <span className="ls__perms" aria-hidden="true">
                {row.perms}
              </span>
              {row.href ? (
                <a
                  className="ls__name"
                  href={row.href}
                  {...(row.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {row.name}
                </a>
              ) : row.toggle ? (
                <button
                  type="button"
                  className="ls__name"
                  aria-expanded={logOpen}
                  aria-controls="ls-recent-log"
                  onClick={() => setLogOpen((o) => !o)}
                >
                  {row.name}
                </button>
              ) : (
                <button
                  type="button"
                  className={row.dir ? "ls__name ls__name--dir" : "ls__name"}
                  onClick={() => term.run(row.run!)}
                >
                  {row.name}
                </button>
              )}
              <span className="ls__info">{row.info}</span>
              {row.toggle && logOpen && (
                <div className="ls__cat" id="ls-recent-log">
                  <TermLines lines={recentLogLines()} onRun={term.run} />
                </div>
              )}
            </li>
          ))}
        </ul>
        <div role="log" aria-live="polite" aria-label="Terminal output">
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
      </div>
      <PromptInput
        id="term-ls-input"
        inputRef={inputRef}
        onRun={term.run}
        onPrint={(lines) => term.print(lines)}
        recall={term.recall}
        placeholder="try open jobradar or help…"
      />
    </div>
  );
}
