# sevara-badriddinova.vercel.app

My personal site and blog. React, TypeScript and Vite, prerendered to static HTML.

## Getting started

Requires Node 20.19+ or 22.12+.

```bash
npm ci
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Start the dev server                                   |
| `npm run build`   | Type-check, build, and prerender every page to `dist/` |
| `npm run preview` | Serve the production build locally                     |
| `npm run lint`    | Lint with oxlint                                       |

## Writing a post

Add `src/posts/<slug>.md`. It's published at `/writing/<slug>`.

```markdown
---
title: Will It Break in Prod?
description: Shown in the post list and in link previews.
date: 2026-11-10
tags: performance, testing, k6
cover: /images/writing/<slug>/cover.webp
coverAlt: What the cover shows.
---
```

Put the post's images in `public/images/writing/<slug>/`, with an `og.png` (1200×630) for link previews.

## Project structure

```
src/
├── data/content.ts    Site copy: experience, projects, about, contact
├── posts/             Blog posts in markdown
├── pages/             Home, writing index, post, 404
├── components/        Page sections
└── terminal/          The hero terminal and its commands
posts.plugin.ts        Compiles posts to HTML at build time
scripts/prerender.mjs  Writes one HTML file per page
```

## Deployment

Vercel deploys `main` to production and builds a preview for every pull request.
