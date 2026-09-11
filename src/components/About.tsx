import { IconBrackets, IconDatabase, IconGlobe, IconTerminalGlyph } from "./icons";
import SkillCloud from "./SkillCloud";
import "./About.css";

export default function About() {
  return (
    <section className="about section" id="about">
      <p className="about__eyebrow">
        about me
        <svg className="about__underline" viewBox="0 0 120 16" fill="none" aria-hidden="true">
          <path d="M2 5 Q12 0 22 5 T42 5 T62 5 T82 5 T102 5 T118 5 M2 12 Q12 7 22 12 T42 12 T62 12 T82 12 T102 12 T118 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </p>
      <div className="about__layout">
        <div className="about__portrait">
          <img className="about__portrait-image" src="/images/sevara.jpg" alt="Sevara at Rockefeller Center" width="640" height="640" loading="lazy" />
        </div>

        <div className="about__copy">
          <h2 className="about__label">what's up</h2>
          <p className="about__statement">
            Hi, I'm Sevara. I build backend systems that keep working as more
            people use them. My work spans databases <IconDatabase className="about__glyph" aria-hidden />,
            distributed systems <IconGlobe className="about__glyph" aria-hidden />,
            payment platforms, and developer tools <IconTerminalGlyph className="about__glyph" aria-hidden />.
            I care about making them fast and easy to maintain <IconBrackets className="about__glyph" aria-hidden />.
          </p>

          <p className="about__micro">
            I like figuring out why something is slow or keeps breaking, then
            making it simpler. I start by following the data, finding the
            bottleneck, and working out what actually needs to change.
          </p>
        </div>
      </div>

      <SkillCloud />
    </section>
  );
}
