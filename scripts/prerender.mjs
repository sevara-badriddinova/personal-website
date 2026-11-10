// Injects the server-rendered page into dist/index.html so crawlers, link
// previews and no-JS visitors get real content instead of an empty <div id="root">.
import { readFile, rm, writeFile } from "node:fs/promises";

const ssrDir = new URL("../dist-ssr/", import.meta.url);
const indexFile = new URL("../dist/index.html", import.meta.url);
const marker = '<div id="root"></div>';

const { render } = await import(new URL("entry-server.js", ssrDir).href);
const template = await readFile(indexFile, "utf8");

if (!template.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`);
}

await writeFile(indexFile, template.replace(marker, `<div id="root">${render()}</div>`));
await rm(ssrDir, { recursive: true, force: true });
console.log("prerender: wrote dist/index.html");
