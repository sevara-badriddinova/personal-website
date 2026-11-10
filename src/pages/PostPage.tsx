import { useEffect, useRef, type RefObject } from "react";
import Header from "../components/Header";
import Prompt from "../components/Prompt";
import { contact } from "../data/content";
import type { PostMeta } from "../data/posts";
import { file, page } from "../lib/url";
import "./PostPage.css";

type PostPageProps = { post: PostMeta; html: string };

// Code blocks in the post HTML come with a "copy" button (see posts.plugin.ts).
// One listener on the article handles all of them.
function useCopyButtons(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const timers = new Set<number>();

    const onClick = async (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(".post-code__copy");
      const code = button?.closest(".post-code")?.querySelector("pre");
      if (!button || !code) return;
      try {
        await navigator.clipboard.writeText(code.innerText.replace(/\n$/, ""));
        button.textContent = "copied";
      } catch {
        button.textContent = "press ⌘C";
      }
      timers.add(window.setTimeout(() => (button.textContent = "copy"), 2000));
    };

    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("click", onClick);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [ref]);
}

export default function PostPage({ post, html }: PostPageProps) {
  const articleRef = useRef<HTMLElement>(null);
  useCopyButtons(articleRef);

  // Image paths in the post are site-absolute; file() keeps them working in relative builds.
  const body = html.replace(/(src|href)="\/images\//g, `$1="${file("/images/")}`);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header current="writing" />
      <main id="main">
        <article ref={articleRef} className="article" aria-labelledby="post-title">
          <header className="article__head">
            <Prompt command={`cat writing/${post.slug}.md`} />
            <h1 id="post-title" className="article__title">
              {post.title}
            </h1>
            <p className="article__meta">
              <time dateTime={post.date}>{post.date}</time>
              <span aria-hidden="true"> · </span>
              <span>{post.readMinutes}&nbsp;min read</span>
              {post.tags.length > 0 && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className="article__tags">{post.tags.join(" · ")}</span>
                </>
              )}
            </p>
          </header>

          <div className="article__body" dangerouslySetInnerHTML={{ __html: body }} />

          <footer className="article__end">
            <p className="article__thanks">
              Spotted a mistake, or have a question?{" "}
              <a className="article__mail" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </p>
            <nav className="article__nav" aria-label="More">
              <a className="text-link text-link--mono" href={page("/writing")}>
                <span aria-hidden="true">←&nbsp;</span>all writing
              </a>
              <a className="text-link text-link--mono" href={page("/")}>
                cd ~
              </a>
            </nav>
          </footer>
        </article>
      </main>
    </>
  );
}
