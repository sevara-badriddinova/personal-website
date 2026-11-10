import type { PostMeta } from "../data/posts";
import { page } from "../lib/url";
import "./PostList.css";

/** The list of posts, used on the home page and on /writing. */
export default function PostList({ posts, headingLevel = 3 }: { posts: PostMeta[]; headingLevel?: 2 | 3 }) {
  const Title = headingLevel === 2 ? "h2" : "h3";
  return (
    <ol className="posts" reversed>
      {posts.map((post) => (
        <li key={post.slug}>
          <a className="post" href={page(post.href)}>
            <span className="post__meta">
              <time dateTime={post.date}>{post.date}</time>
              <span className="post__tags">{post.tags.join(" · ")}</span>
            </span>
            <span className="post__main">
              <Title className="post__title">{post.title}</Title>
              <span className="post__excerpt">{post.description}</span>
            </span>
            <span className="post__time">
              {post.readMinutes}&nbsp;min<span aria-hidden="true"> →</span>
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
