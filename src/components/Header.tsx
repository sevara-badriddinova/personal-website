import { site } from "../data/content";
import { posts } from "../data/posts";
import { useActiveSection } from "../hooks/useActiveSection";
import { file, page } from "../lib/url";
import "./Header.css";

const SECTIONS = ["experience", "projects", ...(posts.length > 0 ? ["writing"] : []), "about", "contact"];
const NONE: string[] = [];

type HeaderProps = {
  /** "home" scrolls between sections; other pages link back to them. */
  current?: "home" | "writing" | "other";
};

export default function Header({ current = "home" }: HeaderProps) {
  const onHome = current === "home";
  const active = useActiveSection(onHome ? SECTIONS : NONE);

  const hrefFor = (id: string) => {
    if (onHome) return `#${id}`;
    return id === "writing" ? page("/writing") : page(`/#${id}`);
  };
  const currentFor = (id: string) => {
    if (onHome) return active === id ? "location" : undefined;
    return current === "writing" && id === "writing" ? "page" : undefined;
  };

  return (
    <header className="header">
      <div className="wrap header__inner">
        <a
          className="header__home"
          href={onHome ? "#top" : page("/")}
          aria-label={onHome ? `${site.name}, back to top` : `${site.name}, home`}
        >
          ~/sevara
        </a>
        <div className="header__right">
          <nav className="header__nav" aria-label="Primary">
            {SECTIONS.map((id) => (
              <a key={id} className="header__link" href={hrefFor(id)} aria-current={currentFor(id)}>
                {id}
              </a>
            ))}
          </nav>
          <a className="header__resume" href={file(site.resume)} target="_blank" rel="noopener">
            resume.pdf
          </a>
        </div>
      </div>
    </header>
  );
}
