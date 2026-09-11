import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contact } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current) return;

      if (reduced) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top 70%", once: true },
      });

      tl.from(".contact__line", {
        yPercent: 110,
        duration: 0.7,
        ease: "power4.out",
        stagger: 0.12,
      })
        .fromTo(
          ".contact__cursor",
          { opacity: 0, x: -40, y: -20 },
          { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        );
    },
    { scope, dependencies: [reduced] }
  );

  return (
    <section className="contact section" id="contact" ref={scope}>
      <p className="contact__eyebrow">say hi</p>
      <h2 className="contact__headline">
        <span className="contact__line-wrap">
          <span className="contact__line">Contact</span>
        </span>
      </h2>

      <div className="contact__reach">
        <span className="contact__label">Have a project in mind or just want to say hi? I'd love to hear from you.</span>
        <a className="contact__email" href={`mailto:${contact.email}`}>
          {contact.email}
          <svg className="contact__cursor" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
            <path
              d="M4 3 L20 12 L12.5 13.5 L16 21 L13 22.4 L9.5 15 L4 19.5 Z"
              fill="#0a0a0a"
              stroke="#f7f5ee"
              strokeWidth="1.4"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
