// Posts are markdown files in src/posts/. posts.plugin.ts compiles each one into
// { meta, html } at build time. To publish a new post, add a .md file there.
export type PostMeta = {
  slug: string;
  href: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  tags: string[];
  readMinutes: number;
  cover?: string;
  coverAlt?: string;
  coverSize?: { width: number; height: number };
};

// Metadata is bundled with the site; each post's HTML is a separate chunk, loaded only on its page.
const metas = import.meta.glob<PostMeta>("../posts/*.md", { eager: true, query: "?meta", import: "default" });
const bodies = import.meta.glob<string>("../posts/*.md", { query: "?html", import: "default" });

/** Newest first. */
export const posts: PostMeta[] = Object.values(metas).sort((a, b) => b.date.localeCompare(a.date));

export const findPost = (slug: string) => posts.find((p) => p.slug === slug);

/** The post's HTML, loaded as its own chunk. */
export async function loadPostHtml(slug: string): Promise<string | undefined> {
  return bodies[`../posts/${slug}.md`]?.();
}
