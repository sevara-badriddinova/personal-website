import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillGroups } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import "./SkillCloud.css";

gsap.registerPlugin(ScrollTrigger);

export default function SkillCloud() {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current || reduced) return;
      const pills = gsap.utils.toArray<HTMLElement>(".skill-pill");

      gsap.set(pills, { opacity: 0, y: 22, rotate: 0 });
      gsap.to(pills, {
        opacity: 1,
        y: 0,
        rotate: (i) => Number(pills[i].dataset.rotate ?? 0),
        duration: 0.55,
        ease: "back.out(1.6)",
        stagger: 0.045,
        scrollTrigger: {
          trigger: scope.current,
          start: "top 82%",
          once: true,
        },
      });
    },
    { scope, dependencies: [reduced] }
  );

  return (
    <div className="skillcloud" ref={scope}>
      <span className="skillcloud__label">with my skills in:</span>
      {skillGroups.map((group) => (
        <div className="skillcloud__group" key={group.name}>
          <h3 className="skillcloud__group-title">{group.name}</h3>
          <ul className="skillcloud__list">
            {group.skills.map((skill) => (
              <li key={skill} className={`skill-pill skill-pill--${group.color}`}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
