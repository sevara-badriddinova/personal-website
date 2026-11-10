import { about, stack } from "../data/content";
import Prompt from "./Prompt";
import { file } from "../lib/url";
import "./About.css";

export default function About() {
  return (
    <section id="about" className="section section--deep" aria-labelledby="about-title">
      <div className="wrap about">
        <figure className="panel about__photo">
          <figcaption className="panel__bar">{about.photo.file}</figcaption>
          <img src={file(about.photo.src)} alt={about.photo.alt} width={720} height={900} loading="lazy" decoding="async" />
        </figure>

        <div className="about__body">
          <Prompt command="cat about.md" />
          <h2 id="about-title" className="about__title">
            {about.title}
          </h2>
          <p className="about__lead">{about.lead}</p>

          <Prompt command="cat stack.txt" className="about__stack-prompt" />
          <dl className="stack">
            {stack.map((row) => (
              <div className="stack__row" key={row.key}>
                <dt>{row.key}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
