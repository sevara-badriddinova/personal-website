import { IconArrowUpRight } from "./icons";
import "./Header.css";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "/Sevara_Badriddinova_Resume.pdf" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <header className="header" data-reveal="nav">
      <a className="header__mark" href="#top">
        Sevara Badriddinova
      </a>

      <nav className="header__nav" aria-label="Primary">
        {NAV.map((item) => (
          <a key={item.label} className="header__link" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a
        className="header__ext"
        href="https://www.linkedin.com/in/sevarabadriddinova"
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn <IconArrowUpRight aria-hidden />
      </a>
    </header>
  );
}
