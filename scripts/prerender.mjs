// Injects the server-rendered page into dist/index.html so crawlers, link
// previews and no-JS visitors get real content instead of an empty <div id="root">.
import { readdir, readFile, rm, writeFile } from "node:fs/promises";

const ssrDir = new URL("../dist-ssr/", import.meta.url);
const indexFile = new URL("../dist/index.html", import.meta.url);
const marker = '<div id="root"></div>';

const { render } = await import(new URL("entry-server.js", ssrDir).href);
const template = await readFile(indexFile, "utf8");

if (!template.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`);
}

// The hero name is the largest thing on screen, so fetch its font (Bricolage 800)
// alongside the CSS instead of waiting for the CSS to ask for it.
const assets = await readdir(new URL("../dist/assets/", import.meta.url));
const heroFont = assets.find((f) => /^bricolage-grotesque-latin-800-normal-.*\.woff2$/.test(f));
const base = template.match(/href="([^"]*)assets\/index-[^"]+\.css"/)?.[1] ?? "/";
const preload = heroFont
  ? `<link rel="preload" href="${base}assets/${heroFont}" as="font" type="font/woff2" crossorigin>\n  `
  : "";

await writeFile(
  indexFile,
  template.replace("</head>", `${preload}</head>`).replace(marker, `<div id="root">${render()}</div>`),
);
await rm(ssrDir, { recursive: true, force: true });
console.log("prerender: wrote dist/index.html");
