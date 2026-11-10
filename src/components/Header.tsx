import { posts, site } from "../data/content";
import "./Header.css";

const NAV = [
  { label: "experience", href: "#experience" },
  { label: "projects", href: "#projects" },
  ...(posts.length > 0 ? [{ label: "writing", href: "#writing" }] : []),
  { label: "about", href: "#about" },
  { label: "contact", href: "#contact" },
];

export default function Header() {
  return (
    <header className="header">
      <div className="wrap header__inner">
        <a className="header__home" href="#top" aria-label={`${site.name}, back to top`}>
          ~/sevara
        </a>
        <div className="header__right">
          <nav className="header__nav" aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.href} className="header__link" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="header__resume" href={site.resume} target="_blank" rel="noopener">
            resume.pdf
          </a>
        </div>
      </div>
    </header>
  );
}
