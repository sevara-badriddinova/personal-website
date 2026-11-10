import { site } from "../data/content";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.name} · designed and built by me
        </p>
        <p>
          <span className="prompt__sign">~ $</span> making chaos compile
        </p>
      </div>
    </footer>
  );
}
