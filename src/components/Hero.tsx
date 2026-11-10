import { contact, recentLog, site } from "../data/content";
import Prompt from "./Prompt";
import "./Hero.css";

export default function Hero() {
  return (
    <section id="top" className="hero" aria-label="Introduction">
      <div className="wrap hero__inner">
        <div className="hero__intro">
          <Prompt command="whoami" />
          <h1 className="hero__name">
            Sevara <br />
            Badriddinova
          </h1>
          <p className="hero__role">{site.role}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href={site.resume} target="_blank" rel="noopener">
              Download resume
            </a>
            <a className="btn btn--ghost" href={`mailto:${contact.email}`}>
              Email me
            </a>
            <div className="hero__links">
              <a className="text-link" href={contact.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className="text-link" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

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
            <p className="prompt log__prompt" aria-hidden="true">
              <span className="prompt__sign">~ $</span> <span className="cursor" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
