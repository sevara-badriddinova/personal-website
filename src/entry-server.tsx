import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App, { type AppProps } from "./App";
import { findPost, loadPostHtml, posts } from "./data/posts";
import { headFor } from "./lib/head";
import { depthOf, routeKey, type Route } from "./lib/routes";
import { setDepth } from "./lib/url";

// Used only at build time, by scripts/prerender.mjs, to write one HTML file per page.
export { depthOf, routeKey };

export const routes: Route[] = [
  { kind: "home" },
  { kind: "writing" },
  ...posts.map((p): Route => ({ kind: "post", slug: p.slug })),
  { kind: "notfound" },
];

export const sitemapPaths = ["/", "/writing", ...posts.map((p) => p.href)];

export async function render(route: Route) {
  setDepth(depthOf(route));
  const props: AppProps = { route };
  if (route.kind === "post") {
    const meta = findPost(route.slug);
    const html = await loadPostHtml(route.slug);
    if (meta && html !== undefined) props.post = { meta, html };
  }
  const html = renderToString(
    <StrictMode>
      <App {...props} />
    </StrictMode>
  );
  return { html, head: headFor(route) };
}
