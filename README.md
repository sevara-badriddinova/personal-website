# Sevara Badriddinova — Portfolio

A React + TypeScript portfolio in a dark terminal style: a home page (hero with a `recent.log` of results, experience, projects with one-page diagrams, writing, about, contact) plus a blog at `/writing`.

## Development

```bash
npm ci
npm run dev
```

## Checks and production build

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` type-checks, builds the client bundle, then prerenders every page (`src/entry-server.tsx` + `scripts/prerender.mjs`) into `dist/index.html`, `dist/writing/index.html`, `dist/writing/<slug>/index.html` and `dist/404.html`, each with its own title and link-preview tags, plus `dist/sitemap.xml`. The browser hydrates that HTML on load. The production build is generated in `dist/` and is ignored by Git.

## Editing the portfolio

- `src/data/content.ts`: site copy — hero `recentLog`, experience, projects, about, stack, and contact details.
  - Projects with `featured: true` get the large alternating rows; the rest go in the grid.
- `src/components/`: one component and stylesheet per section.
- `src/terminal/`: the hero terminal. `commands.ts` holds every command (help, ls, cd, open, cat, whoami, mail, clear); `TerminalShell.tsx` is the UI. Tab completes, ↑ recalls, and `/` or ⌘K focuses it.
- `src/pages/`: `Home.tsx` (section order), `WritingIndex.tsx` (/writing), `PostPage.tsx` (one post), `NotFound.tsx`.
- `src/index.css`: design tokens, shared pieces (buttons, prompt lines, panels), and font imports.
- `public/images/projects/`: project diagrams as 1400×788 WebP.
- `public/images/writing/<slug>/`: a post's pictures, plus `og.png` (1200×630) for its link preview.
- `public/images/boston.webp`: about photo.
- `public/og.png`: 1200×630 social preview image.
- `public/Sevara_Badriddinova_Resume.pdf`: resume linked from the header, hero, and contact.

## Writing a post

Add a markdown file to `src/posts/`. The file name is the URL: `src/posts/my-post.md` becomes `/writing/my-post`.

```markdown
---
title: My Post
description: One or two sentences for the post list and link previews.
date: 2026-11-10
tags: performance, testing
cover: /images/writing/my-post/cover.webp
coverAlt: What the cover picture shows.
---

**Opening line.**

![Alt text](/images/writing/my-post/cover.webp)

### A section
```

- `### headings` get link anchors. `![alt](src "caption")` makes a figure with a caption; the first image is the cover and loads first; the rest load lazily and open full size on tap.
- Code blocks are highlighted at build time (`js`, `ts`, `bash`, `java`, `json`, `yaml`, `sql`, `go`) and get a copy button.
- A blockquote starting with `**Draft note:**` shows as a yellow reminder box. Remove it before publishing.
- Put an `og.png` (1200×630) next to the cover for the link preview.

The home page shows the 3 newest posts; `/writing` lists all of them. `posts.plugin.ts` compiles the markdown, so the browser never downloads a markdown parser.

## Stack

React, TypeScript, Vite, and plain CSS. Posts use marked and Shiki at build time only. Fonts are Bricolage Grotesque, Plus Jakarta Sans, and JetBrains Mono (self-hosted, Latin subset). The only animation is the blinking cursor, which is turned off for reduced-motion preferences.
