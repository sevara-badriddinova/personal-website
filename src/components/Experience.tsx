import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience, education } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import "./Experience.css";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current || reduced) return;
      gsap.utils.toArray<HTMLElement>(".exp-card").forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });
      });
    },
    { scope, dependencies: [reduced] }
  );

  return (
    <section className="experience section" ref={scope}>
      <div className="experience__intro">
        <p className="experience__eyebrow">work notes</p>
        <h2 className="experience__heading">Experience</h2>
        <p className="experience__summary">
          Where I've worked, what I've built, and the communities I've been part of.
        </p>
      </div>

      <div className="experience__list">
        {experience.map((item, index) => (
          <article className="exp-card" key={item.org}>
            <div className="exp-card__date">
              <span>{item.date}</span>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
            </div>

            <div className="exp-card__paper">
              <div className="exp-card__pin" aria-hidden="true" />
              <p className="exp-card__role">{item.role}</p>
              <h3 className="exp-card__org">
                {item.org}
              </h3>
              <p className="exp-card__context">{item.context}</p>
              <ul className="exp-card__highlights">
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <p className="exp-card__stack">{item.stack}</p>
            </div>
          </article>
        ))}
      </div>

      <article className="exp-education">
        <p className="exp-education__eyebrow">Education</p>
        <div className="exp-education__copy">
          <h3 className="exp-education__school">{education.school}</h3>
          <p className="exp-education__degree">{education.degree}</p>
          <p className="exp-education__grad">Graduating {education.graduation}</p>
          <ul className="exp-education__courses" aria-label="Relevant coursework">
            {education.coursework.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>

        <div className="exp-education__photo">
          <div className="exp-education__photo-frame">
            <img src="/images/usf-campus.jpg" alt="Sevara beside the USF bull at the Marshall Student Center" loading="lazy" />
          </div>
          <p>USF / computer science</p>
        </div>
      </article>
    </section>
  );
}
