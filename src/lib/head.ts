// Title, description and link-preview tags for each page. scripts/prerender.mjs writes
// them into the page's <head>.
import { site } from "../data/content";
import { findPost } from "../data/posts";
import type { Route } from "./routes";

export const SITE_URL = "https://sevara-badriddinova.vercel.app";

export type Head = {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt: string;
  type: "website" | "article";
  published?: string;
  tags?: string[];
};

const home: Head = {
  title: `${site.name} — Software Engineer`,
  description: `${site.name} — backend software engineer building fintech systems. Experience, projects and writing.`,
  path: "/",
  image: "/og.png",
  imageAlt: `${site.name}, backend software engineer building fintech systems`,
  type: "website",
};

export function headFor(route: Route): Head {
  if (route.kind === "writing") {
    return {
      ...home,
      title: `Blog — ${site.name}`,
      description: "Posts about building backend systems: performance, testing, and what breaks in production.",
      path: "/writing",
    };
  }
  if (route.kind === "post") {
    const post = findPost(route.slug);
    if (post) {
      return {
        title: `${post.title} — ${site.name}`,
        description: post.description,
        path: post.href,
        image: post.cover ? post.cover.replace(/[^/]+$/, "og.png") : home.image,
        imageAlt: post.coverAlt ?? post.title,
        type: "article",
        published: post.date,
        tags: post.tags,
      };
    }
  }
  if (route.kind === "notfound" || route.kind === "post") {
    return { ...home, title: `Not found — ${site.name}`, path: "/404" };
  }
  return home;
}
