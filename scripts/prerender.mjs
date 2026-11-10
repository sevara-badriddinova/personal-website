// Writes one HTML file per page from the server render, so crawlers, link previews and
// no-JS visitors get real content instead of an empty <div id="root">:
//   dist/index.html, dist/writing/index.html, dist/writing/<slug>/index.html, dist/404.html
// It also writes dist/sitemap.xml.
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";

const ssrDir = new URL("../dist-ssr/", import.meta.url);
const distDir = new URL("../dist/", import.meta.url);
const marker = '<div id="root"></div>';
const headBlock = /<!-- page-head:start[\s\S]*?<!-- page-head:end -->/;

const { render, routes, routeKey, depthOf, sitemapPaths } = await import(new URL("entry-server.js", ssrDir).href);
const template = await readFile(new URL("index.html", distDir), "utf8");
const SITE = "https://sevara-badriddinova.vercel.app";

if (!template.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`);
if (!headBlock.test(template)) throw new Error("prerender: page-head markers not found in dist/index.html");

// A build with --base ./ (static previews) uses paths relative to the page's folder.
const relative = /(?:src|href)="\.\/assets\//.test(template);
const base = relative ? "./" : "/";

const attr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function headTags(head) {
  const url = SITE + (head.path === "/" ? "/" : head.path);
  const image = SITE + head.image;
  const tags = [
    `<title>${attr(head.title)}</title>`,
    `<meta name="description" content="${attr(head.description)}" />`,
    `<link rel="canonical" href="${attr(url)}" />`,
    `<meta property="og:type" content="${head.type}" />`,
    `<meta property="og:url" content="${attr(url)}" />`,
    `<meta property="og:title" content="${attr(head.title)}" />`,
    `<meta property="og:description" content="${attr(head.description)}" />`,
    `<meta property="og:image" content="${attr(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${attr(head.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (head.type === "article") {
    tags.push(`<meta property="article:published_time" content="${head.published}" />`);
    for (const tag of head.tags ?? []) tags.push(`<meta property="article:tag" content="${attr(tag)}" />`);
    const ld = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: head.title.replace(/ — .*$/, ""),
      description: head.description,
      datePublished: head.published,
      url,
      image,
      author: { "@type": "Person", name: "Sevara Badriddinova", url: `${SITE}/` },
    };
    tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`);
  }
  return tags.join("\n    ");
}

// The hero name and post titles are the biggest text on screen, so fetch their font
// (Bricolage 800) alongside the CSS instead of waiting for the CSS to ask for it.
const assets = await readdir(new URL("assets/", distDir));
const titleFont = assets.find((f) => /^bricolage-grotesque-latin-800-normal-.*\.woff2$/.test(f));
const preload = titleFont
  ? `<link rel="preload" href="${base}assets/${titleFont}" as="font" type="font/woff2" crossorigin>\n  `
  : "";

for (const route of routes) {
  const { html, head } = await render(route);
  const depth = depthOf(route);
  // A post's HTML is its own chunk, loaded before hydration: fetch it with the main script.
  const postChunks =
    route.kind === "post"
      ? assets
          .filter((f) => f.startsWith(`${route.slug}-`) && f.endsWith(".js"))
          .map((f) => `<link rel="modulepreload" crossorigin href="${base}assets/${f}">\n  `)
          .join("")
      : "";
  let page = template
    .replace(headBlock, headTags(head))
    .replace("</head>", `${preload}${postChunks}</head>`)
    .replace(marker, `<div id="root" data-route="${routeKey(route)}">${html}</div>`);
  // Relative builds: the page's own asset links must climb out of its folder.
  if (relative && depth > 0) page = page.replace(/((?:src|href)=")\.\//g, `$1${"../".repeat(depth)}`);

  const out =
    route.kind === "home" ? "index.html"
    : route.kind === "notfound" ? "404.html"
    : route.kind === "writing" ? "writing/index.html"
    : `writing/${route.slug}/index.html`;
  const target = new URL(out, distDir);
  await mkdir(new URL(".", target), { recursive: true });
  await writeFile(target, page);
  console.log(`prerender: wrote dist/${out}`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(new URL("sitemap.xml", distDir), sitemap);
await rm(ssrDir, { recursive: true, force: true });
