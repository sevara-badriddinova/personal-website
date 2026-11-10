import Header from "../components/Header";
import PostList from "../components/PostList";
import Prompt from "../components/Prompt";
import { posts } from "../data/posts";
import "./WritingIndex.css";

export default function WritingIndex() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header current="writing" />
      <main id="main">
        <section className="section writing-index" aria-labelledby="writing-title">
          <div className="wrap section__inner">
            <Prompt command="ls -lt writing/" />
            <h1 id="writing-title" className="section__title">
              Blog posts
            </h1>
            <p className="writing-index__lead">
              What I learn building backend systems: performance, testing, and the things that only break in production.
            </p>
            <PostList posts={posts} headingLevel={2} />
          </div>
        </section>
      </main>
    </>
  );
}
