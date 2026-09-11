import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import "./Hero.css";

const HERO_IMG =
  "/images/sevara-hero.jpg";

export default function Hero() {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current) return;

      if (reduced) {
        gsap.set(
          [
            ".hero__name",
            ".hero__rise-inner",
            ".hero__image-wrap",
            ".hero__meta",
            ".hero__sticky",
          ],
          { clearProps: "all" }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
          ".hero__name",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power2.inOut" },
        )
        .from(
          ".hero__sticky",
          { opacity: 0, y: 16, rotate: 0, duration: 0.5, stagger: 0.08 },
          "-=0.25"
        )
        .from(
          ".hero__rise-inner--software",
          { yPercent: 110, duration: 0.65, ease: "power4.out" },
          "-=0.2"
        )
        .from(
          ".hero__rise-inner--engineer",
          { yPercent: 110, duration: 0.65, ease: "power4.out" },
          "-=0.45"
        )
        .from(
          ".hero__image-wrap",
          { opacity: 0, y: 26, scale: 0.96, duration: 0.6 },
          "-=0.35"
        )
        .from(".hero__meta", { opacity: 0, y: 14, duration: 0.5 }, "-=0.3")
        .from(".hero__cta", { opacity: 0, y: 16, duration: 0.5 }, "-=0.35");
    },
    { scope, dependencies: [reduced] }
  );

  return (
    <section className="hero" id="top" ref={scope}>
      <p className="hero__eyebrow">my name is</p>
      <div className="hero__stage">
        <div className="hero__grid">
          <div className="hero__copy">
            <div className="hero__title-frame">
            <span className="hero__sticky hero__sticky--green">making chaos compile</span>
          <h1 className="hero__headline">
            <span className="hero__name" data-reveal>
              Sevara
            </span>
            <span className="hero__rise">
              <span className="hero__rise-inner hero__rise-inner--software hero__software">
                software
              </span>
            </span>
            <span className="hero__rise">
              <span className="hero__rise-inner hero__rise-inner--engineer hero__engineer">
                engineer
              </span>
            </span>
          </h1>
          </div>
      <div className="hero__foot">
        <a className="hero__cta" href="#contact">Contact me</a>
      </div>
        </div>

        <div className="hero__aside">
          <div className="hero__image-wrap">
            <span className="hero__sticky hero__sticky--yellow">Me in Boston!</span>
            <img
              className="hero__image"
              src={HERO_IMG}
              alt="Sevara by the Charles River with the Boston skyline behind her"
              width="3024"
              height="4032"
              loading="eager"
            />
          </div>
          <div className="hero__meta">
            <p className="hero__line">I like building things people can count on.</p>
          </div>
        </div>
      </div>
      </div>


    </section>
  );
}
