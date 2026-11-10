import { experience } from "../data/content";
import Prompt from "./Prompt";
import "./Experience.css";

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="wrap section__inner">
        <Prompt command="cat experience.log" />
        <h2 id="experience-title" className="section__title">
          Production work in fintech
        </h2>

        <div className="exp">
          {experience.map((item) => (
            <article className="exp-item" key={item.handle}>
              <div className="exp-item__meta">
                <p className="exp-item__dates">{item.dates}</p>
                <p className="exp-item__handle">{item.handle}</p>
                <p className="exp-item__context">{item.context}</p>
              </div>
              <div className="exp-item__body">
                <h3 className="exp-item__role">{item.role}</h3>
                {item.points && (
                  <ul className="arrow-list exp-item__points">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                {item.text && <p className="exp-item__text">{item.text}</p>}
                {item.stack && <p className="exp-item__stack">{item.stack}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
