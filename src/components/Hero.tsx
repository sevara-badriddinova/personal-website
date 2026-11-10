import { contact, site, type TerminalVariant } from "../data/content";
import Prompt from "./Prompt";
import StaticLog from "../terminal/StaticLog";
import TerminalLs from "../terminal/TerminalLs";
import TerminalPalette from "../terminal/TerminalPalette";
import TerminalShell from "../terminal/TerminalShell";
import "./Hero.css";

export default function Hero({ variant }: { variant: TerminalVariant }) {
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

        {variant === "shell" && <TerminalShell />}
        {variant === "palette" && <TerminalPalette />}
        {variant === "ls" && <TerminalLs />}
        {variant === "header" && <StaticLog />}
      </div>
    </section>
  );
}
