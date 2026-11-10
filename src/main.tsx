import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App, { type AppProps } from "./App.tsx";
import { findPost, loadPostHtml } from "./data/posts";
import { depthOf, parseRouteKey, routeFromPath } from "./lib/routes";
import { setDepth } from "./lib/url";

const container = document.getElementById("root")!;

// Prerendered pages say which page they are; in dev, work it out from the URL.
const route = container.dataset.route ? parseRouteKey(container.dataset.route) : routeFromPath(window.location.pathname);
setDepth(depthOf(route));

const props: AppProps = { route };
if (route.kind === "post") {
  const meta = findPost(route.slug);
  const html = await loadPostHtml(route.slug);
  if (meta && html !== undefined) props.post = { meta, html };
}

const app = (
  <StrictMode>
    <App {...props} />
  </StrictMode>
);

// Production HTML is prerendered at build time (scripts/prerender.mjs), so hydrate it.
// In dev the root is empty, so render from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
