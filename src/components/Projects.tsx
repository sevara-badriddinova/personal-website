import { contact, projectAnchor, projects, type Project } from "../data/content";
import Prompt from "./Prompt";
import "./Projects.css";

const IMAGE_SIZE = { width: 1400, height: 788 };

// The diagrams are dense; tapping one opens it full size (helps most on phones).
function Shot({ project }: { project: Project }) {
  return (
    <figure className="panel shot">
      <figcaption className="panel__bar">
        <span>{project.image.file}</span>
        <span aria-hidden="true">full size ↗</span>
      </figcaption>
      <a className="shot__zoom" href={project.image.src} target="_blank" rel="noopener">
        <img
          src={project.image.src}
          alt={`${project.image.alt} (opens full size)`}
          width={IMAGE_SIZE.width}
          height={IMAGE_SIZE.height}
          loading="lazy"
          decoding="async"
        />
      </a>
    </figure>
  );
}

function Links({ project }: { project: Project }) {
  return (
    <div className="project__links">
      {project.links.map((link) => (
        <a
          key={link.href}
          className="text-link text-link--mono"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
          <span className="sr-only"> {project.name}</span>
          <span aria-hidden="true">&nbsp;↗</span>
        </a>
      ))}
    </div>
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="section section--deep" aria-labelledby="projects-title">
      <div className="wrap section__inner projects">
        <div className="section__head projects__head">
          <div>
            <Prompt command="ls projects/" />
            <h2 id="projects-title" className="section__title">
              Things I’ve built
            </h2>
          </div>
          <p className="projects__note">Each project comes with a one-page diagram of how it works.</p>
        </div>

        <div className="projects__featured">
          {featured.map((project, i) => (
            <article key={project.slug} id={projectAnchor(project.slug)} className={i % 2 === 1 ? "feature feature--flip" : "feature"}>
              <div className="feature__media">
                <Shot project={project} />
              </div>
              <div className="feature__body">
                <p className="project__tags">{project.tags}</p>
                <h3 className="feature__title">{project.name}</h3>
                <p className="feature__summary">{project.summary}</p>
                {project.points && (
                  <ul className="arrow-list feature__points">
                    {project.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                <Links project={project} />
              </div>
            </article>
          ))}
        </div>

        {more.length > 0 && (
          <>
            <div className="projects__more-head">
              <Prompt command="ls projects/ --more" />
              <a
                className="text-link text-link--mono projects__all projects__all--top"
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/sevara-badriddinova<span aria-hidden="true">&nbsp;↗</span>
              </a>
            </div>
            <div className="projects__grid">
              {more.map((project) => (
                <article key={project.slug} id={projectAnchor(project.slug)} className="card">
                  <Shot project={project} />
                  <p className="project__tags">{project.tags}</p>
                  <h3 className="card__title">{project.name}</h3>
                  <p className="card__summary">{project.summary}</p>
                  {project.note && <p className="card__note">{project.note}</p>}
                  <Links project={project} />
                </article>
              ))}
            </div>
            <a
              className="btn btn--ghost projects__all projects__all--bottom"
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              everything on github<span aria-hidden="true">&nbsp;↗</span>
            </a>
          </>
        )}
      </div>
    </section>
  );
}
