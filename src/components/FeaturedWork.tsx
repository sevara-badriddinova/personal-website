import type { CSSProperties } from "react";
import { projects } from "../data/content";
import { IconArrowUpRight } from "./icons";
import "./FeaturedWork.css";

const palette = ["blue", "black", "yellow", "pink", "mint", "cream"] as const;

function ProjectVisual({ index, name, metrics }: { index: number; name: string; metrics: { label: string; value: string }[] }) {
  return (
    <div className="project-photo" aria-hidden="true">
      <div className="project-photo__screen">
        <div className="project-photo__bar">
          <span />
          <span />
          <span />
        </div>
        <div className={`project-photo__diagram project-photo__diagram--${index % 3}`}>
          <span className="project-photo__label">{name}</span>
          {metrics.map((metric, metricIndex) => (
            <span className="project-photo__chip" key={metric.label} style={{ "--chip-index": metricIndex } as CSSProperties}>
              <strong>{metric.value}</strong>
              {metric.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedWork() {
  return (
    <section className="featured section" id="work">
      <p className="featured__eyebrow">explore my work</p>
      <h2 className="featured__heading">Featured work</h2>
      <p className="featured__note">A few things I've built, from backend systems to tools I use myself.</p>

      <div className="featured__list">
        {projects.map((project, index) => {
          const color = palette[index % palette.length];
          return (
            <article className={`work-folder work-folder--${color}`} key={project.slug}>
              <div className="work-folder__tab">Project {String(index + 1).padStart(2, "0")}</div>
              <div className="work-folder__copy">
                <p className="work-folder__date">{project.stack.slice(0, 3).join(" / ")}</p>
                <h3 className="work-folder__title">{project.name}</h3>
                <p className="work-folder__desc">{project.description}</p>
                <a className="work-folder__cta" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`Go to ${project.name} on GitHub`}>
                  Go to project <IconArrowUpRight aria-hidden />
                </a>
                <div className="work-folder__tags">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>

              {project.image ? (
                <a className={`project-photo project-photo--image${project.slug === "bilimly" ? " project-photo--bilimly" : ""}`} href={project.image} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} preview at full size`}>
                  <img src={project.image} alt={project.slug === "bilimly" ? "Bilimly vocabulary flashcards and learning topics" : `${project.name} functionality diagram`} width="1672" height="941" loading="lazy" />
                  {project.slug === "bilimly" && (
                    <div className="project-photo__notes">
                      {project.metrics.map((metric) => (
                        <span className="project-photo__note" key={metric.label}>
                          <strong>{metric.value}</strong>{metric.label}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              ) : <ProjectVisual index={index} name={project.name} metrics={project.metrics} />}
            </article>
          );
        })}
      </div>
    </section>
  );
}
