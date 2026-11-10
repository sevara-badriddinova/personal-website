import { posts, site } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import "./Header.css";

const NAV = [
  { label: "experience", href: "#experience" },
  { label: "projects", href: "#projects" },
  ...(posts.length > 0 ? [{ label: "writing", href: "#writing" }] : []),
  { label: "about", href: "#about" },
  { label: "contact", href: "#contact" },
];
const NAV_IDS = NAV.map((n) => n.href.slice(1));

export default function Header() {
  const active = useActiveSection(NAV_IDS);

  return (
    <header className="header">
      <div className="wrap header__inner">
        <a className="header__home" href="#top" aria-label={`${site.name}, back to top`}>
          ~/sevara
        </a>
        <div className="header__right">
          <nav className="header__nav" aria-label="Primary">
            {NAV.map((item) => (
              <a
                key={item.href}
                className="header__link"
                href={item.href}
                aria-current={active === item.href.slice(1) ? "location" : undefined}
              >
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
