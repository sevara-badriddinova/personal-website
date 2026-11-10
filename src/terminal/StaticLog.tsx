import { recentLog } from "../data/content";
import Prompt from "../components/Prompt";
import { runInHeader } from "./headerBus";

/** The read-only recent.log panel, used with version D where typing happens in the header. */
export default function StaticLog() {
  return (
    <div className="log panel" role="group" aria-label="Recent results">
      <div className="panel__bar log__bar" aria-hidden="true">
        <span>recent.log</span>
        <span>tail -n 5</span>
      </div>
      <div className="log__body">
        <Prompt command="cat recent.log" className="log__prompt" />
        <ul className="log__rows">
          {recentLog.map((entry) => (
            <li className="log__row" key={`${entry.scope}-${entry.label}`}>
              <span className="log__scope">[{entry.scope}]</span>
              <span className="log__label">
                <span className="log__long">{entry.label}</span>
                {entry.short && <span className="log__short">{entry.short}</span>}
              </span>
              <span className="log__value">{entry.value}</span>
            </li>
          ))}
        </ul>
        <p className="prompt log__prompt log__hint">
          <span className="prompt__sign">~ $</span> run commands from the bar up top, like{" "}
          <button type="button" className="term-seg term-seg--cmd" onClick={() => runInHeader("help")}>
            help
          </button>{" "}
          or{" "}
          <button type="button" className="term-seg term-seg--cmd" onClick={() => runInHeader("ls projects")}>
            ls projects
          </button>
        </p>
      </div>
    </div>
  );
}
