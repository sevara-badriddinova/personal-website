// The site's pages. Each one is prerendered to its own HTML file at build time.
export type Route = { kind: "home" } | { kind: "writing" } | { kind: "post"; slug: string } | { kind: "notfound" };

/** Short string form, written on #root as data-route so the browser knows which page it hydrates. */
export function routeKey(route: Route): string {
  return route.kind === "post" ? `post:${route.slug}` : route.kind;
}

export function parseRouteKey(key: string): Route {
  if (key.startsWith("post:")) return { kind: "post", slug: key.slice(5) };
  if (key === "writing" || key === "notfound") return { kind: key };
  return { kind: "home" };
}

/** Used in dev, where pages aren't prerendered and #root has no data-route. */
export function routeFromPath(pathname: string): Route {
  const path = pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
  if (path === "/") return { kind: "home" };
  if (path === "/writing") return { kind: "writing" };
  const post = /^\/writing\/([a-z0-9-]+)$/.exec(path);
  return post ? { kind: "post", slug: post[1] } : { kind: "notfound" };
}

/** How many folders deep the page's HTML file sits (dist/writing/x/index.html is 2). */
export function depthOf(route: Route): number {
  if (route.kind === "writing") return 1;
  if (route.kind === "post") return 2;
  return 0;
}
