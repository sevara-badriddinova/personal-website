import { posts } from "../data/posts";
import { page } from "../lib/url";
import PostList from "./PostList";
import Prompt from "./Prompt";

export default function Writing() {
  if (posts.length === 0) return null;

  return (
    <section id="writing" className="section" aria-labelledby="writing-title">
      <div className="wrap section__inner">
        <div className="section__head">
          <div>
            <Prompt command="ls -lt writing/" />
            <h2 id="writing-title" className="section__title">
              Notes from the work
            </h2>
          </div>
          <a className="text-link text-link--mono" href={page("/writing")}>
            all posts<span aria-hidden="true">&nbsp;→</span>
          </a>
        </div>

        <PostList posts={posts.slice(0, 3)} />
      </div>
    </section>
  );
}
