import Header from "../components/Header";
import Prompt from "../components/Prompt";
import { page } from "../lib/url";
import "./WritingIndex.css";

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header current="other" />
      <main id="main">
        <section className="section writing-index" aria-labelledby="nf-title">
          <div className="wrap section__inner">
            <Prompt command="cd ./this-page" />
            <h1 id="nf-title" className="section__title">
              No such page.
            </h1>
            <p className="writing-index__lead">The link may be old, or the address has a typo.</p>
            <div className="writing-index__actions">
              <a className="btn btn--primary" href={page("/")}>
                Go to the home page
              </a>
              <a className="btn btn--ghost" href={page("/writing")}>
                Read the writing
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
