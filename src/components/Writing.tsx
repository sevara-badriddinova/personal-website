import type { ReactNode } from "react";
import { allPostsHref, posts, type Post } from "../data/content";
import Prompt from "./Prompt";
import "./Writing.css";

function PostRow({ post }: { post: Post }) {
  const inner: ReactNode = (
    <>
      <span className="post__date">{post.date ?? "soon"}</span>
      <span className="post__tag">{post.tag}</span>
      <span className="post__main">
        <span className="post__title">{post.title}</span>
        <span className="post__excerpt">{post.excerpt}</span>
      </span>
      {post.href && (
        <span className="post__time">
          {post.readTime ?? "read"}
          <span aria-hidden="true"> →</span>
        </span>
      )}
    </>
  );

  return post.href ? (
    <a className="post" href={post.href}>
      {inner}
    </a>
  ) : (
    <div className="post post--soon">{inner}</div>
  );
}

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
          {allPostsHref && (
            <a className="text-link text-link--mono" href={allPostsHref}>
              all posts<span aria-hidden="true">&nbsp;→</span>
            </a>
          )}
        </div>

        <div className="posts">
          {posts.map((post) => (
            <PostRow key={post.title} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
