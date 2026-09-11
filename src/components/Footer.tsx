import { contact } from "../data/content";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer section">
      <p className="footer__credit">
        Designed &amp; built
        <br />
        by Sevara Badriddinova
      </p>

      <div className="footer__links">
        <a href={contact.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={contact.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="/Sevara_Badriddinova_Resume.pdf">Resume</a>
      </div>

      <p className="footer__legal">© {new Date().getFullYear()} — All rights reserved</p>
    </footer>
  );
}
