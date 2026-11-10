import { contact, site } from "../data/content";
import Prompt from "./Prompt";
import TerminalShell from "../terminal/TerminalShell";
import { file } from "../lib/url";
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
            <a className="btn btn--primary" href={file(site.resume)} target="_blank" rel="noopener">
              View resume
            </a>
            <a className="btn btn--ghost" href={`mailto:${contact.email}`}>
              Email me
            </a>
            <div className="hero__links">
              <a className="text-link" href={contact.github} target="_blank" rel="noopener noreferrer">
                GitHub<span aria-hidden="true">&nbsp;↗</span>
              </a>
              <a className="text-link" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn<span aria-hidden="true">&nbsp;↗</span>
              </a>
            </div>
          </div>
        </div>

        <TerminalShell />
      </div>
    </section>
  );
}
