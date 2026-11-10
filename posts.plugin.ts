// Turns src/posts/*.md into JS modules at build time. Each post is imported two ways:
//   post.md?meta  ->  export default { slug, title, description, date, tags, readMinutes, ... }
//   post.md?html  ->  export default "<p>...</p>"
// Two separate modules, so pages that only list posts never download a post's HTML.
// Markdown parsing and code highlighting happen here, so none of it ships to the browser.
import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { imageSize } from "image-size";
import { Marked, Renderer, type Tokens } from "marked";
import { createHighlighter, type Highlighter } from "shiki";
import type { Plugin } from "vite";

const LANG_LABEL: Record<string, string> = {
  js: "JavaScript",
  ts: "TypeScript",
  bash: "Terminal",
  sh: "Terminal",
  java: "Java",
  json: "JSON",
  yaml: "YAML",
  sql: "SQL",
  go: "Go",
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

function frontmatter(src: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(src);
  if (!match) return { data: {}, body: src };
  const data: Record<string, string> = {};
  for (const row of match[1].split(/\r?\n/)) {
    const i = row.indexOf(":");
    if (i > 0) data[row.slice(0, i).trim()] = row.slice(i + 1).trim();
  }
  return { data, body: src.slice(match[0].length) };
}

export default function posts(): Plugin {
  let publicDir = "public";
  let highlighter: Highlighter | undefined;

  /** Width and height of a file in public/, so images reserve their space before loading. */
  const sizeOf = (src: string) => {
    const { width, height } = imageSize(readFileSync(join(publicDir, src)));
    return { width, height };
  };

  function compile(source: string, id: string) {
    const { data, body } = frontmatter(source);
    const slug = basename(id, ".md");
    for (const key of ["title", "description", "date"]) {
      if (!data[key]) throw new Error(`${slug}.md: frontmatter needs "${key}"`);
    }

    const base = new Renderer();
    let imagesSeen = 0;
    const renderer = {
      heading(this: Renderer, { tokens, depth }: Tokens.Heading) {
        const text = this.parser.parseInline(tokens);
        const anchor = slugify(text);
        return `<h${depth} id="${anchor}">${text}<a class="post-anchor" href="#${anchor}" aria-label="Link to this section">#</a></h${depth}>\n`;
      },
      image({ href, title, text }: Tokens.Image) {
        const { width, height } = sizeOf(href);
        // The first image is the cover, near the top of the page: load it right away.
        const loading = imagesSeen++ === 0 ? 'fetchpriority="high"' : 'loading="lazy"';
        const cover = imagesSeen === 1;
        let img = `<img src="${esc(href)}" alt="${esc(text)}" width="${width}" height="${height}" ${loading} decoding="async">`;
        // A phone-sized version next to the image (diagram.mobile.webp) is used on small screens,
        // where the wide version's text would be too small to read.
        const mobile = href.replace(/(\.[a-z]+)$/, ".mobile$1");
        if (existsSync(join(publicDir, mobile))) {
          const m = sizeOf(mobile);
          img = `<picture><source media="(max-width: 560px)" srcset="${esc(mobile)}" width="${m.width}" height="${m.height}">${img}</picture>`;
        }
        // Tapping a diagram opens it full size.
        if (!cover) img = `<a class="post-figure__zoom" href="${esc(href)}" target="_blank" rel="noopener">${img}<span class="sr-only"> (opens full size)</span></a>`;
        return `<figure class="post-figure${cover ? " post-figure--cover" : ""}">${img}${title ? `<figcaption>${esc(title)}</figcaption>` : ""}</figure>`;
      },
      paragraph(this: Renderer, token: Tokens.Paragraph) {
        // A paragraph that is just an image becomes a bare figure, not <p><figure>.
        if (token.tokens.length === 1 && token.tokens[0].type === "image") return this.parser.parseInline(token.tokens) + "\n";
        return base.paragraph.call(this, token);
      },
      code({ text, lang = "" }: Tokens.Code) {
        const language = lang.trim() || "text";
        const highlighted = highlighter!.codeToHtml(text, {
          lang: language,
          themes: { light: "github-light", dark: "vitesse-dark" },
          defaultColor: false,
        });
        const label = LANG_LABEL[language] ?? language;
        return `<div class="post-code"><div class="post-code__bar"><span>${esc(label)}</span><button type="button" class="post-code__copy">copy</button></div>${highlighted}</div>\n`;
      },
      link(this: Renderer, { href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ""}${attrs}>${text}</a>`;
      },
      table(this: Renderer, token: Tokens.Table) {
        // Each cell carries its column name (data-label), so on phones a row can stack into
        // a small card with labels. Explicit roles keep it a table for screen readers even
        // when CSS changes its display.
        const labels = token.header.map((cell) => esc(cell.text.replace(/[`*_]/g, "")));
        const head = token.header
          .map((cell) => `<th role="columnheader" scope="col">${this.parser.parseInline(cell.tokens)}</th>`)
          .join("");
        const rows = token.rows
          .map(
            (row) =>
              `<tr role="row">${row
                .map((cell, i) => `<td role="cell" data-label="${labels[i]}">${this.parser.parseInline(cell.tokens)}</td>`)
                .join("")}</tr>`
          )
          .join("\n");
        return `<div class="post-table"><table role="table"><thead role="rowgroup"><tr role="row">${head}</tr></thead><tbody role="rowgroup">\n${rows}\n</tbody></table></div>\n`;
      },
      blockquote(this: Renderer, { tokens, text }: Tokens.Blockquote) {
        const draft = text.trim().startsWith("**Draft note:**");
        return `<blockquote${draft ? ' class="post-draft"' : ""}>\n${this.parser.parse(tokens)}</blockquote>\n`;
      },
    };

    const marked = new Marked({ gfm: true, renderer });
    const html = marked.parse(body, { async: false });
    const words = body.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
    const code = (body.match(/```[\s\S]*?```/g) ?? []).join("\n").split(/\s+/).length;

    const meta = {
      slug,
      href: `/writing/${slug}`,
      title: data.title,
      description: data.description,
      date: data.date,
      tags: (data.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      // ~230 words a minute for prose, code is read slower: count it at a third of the pace.
      readMinutes: Math.max(1, Math.round(words / 230 + code / 230 / 3)),
      cover: data.cover,
      coverAlt: data.coverAlt,
      ...(data.cover ? { coverSize: sizeOf(data.cover) } : {}),
    };
    return { meta, html };
  }

  return {
    name: "posts",
    configResolved(config) {
      publicDir = config.publicDir;
    },
    async transform(source, id) {
      const [path, query = ""] = id.split("?");
      if (!path.endsWith(".md")) return null;
      const part = new URLSearchParams(query).has("html") ? "html" : "meta";
      highlighter ??= await createHighlighter({
        themes: ["github-light", "vitesse-dark"],
        langs: ["js", "ts", "bash", "java", "json", "yaml", "sql", "go"],
      });
      const compiled = compile(source, path);
      return { code: `export default ${JSON.stringify(compiled[part])};\n`, map: null };
    },
  };
}
