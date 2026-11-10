# Sevara Badriddinova — Portfolio

A single-page React + TypeScript portfolio in a dark terminal style: hero with a `recent.log` of results, experience, projects with one-page diagrams, writing, about, and contact.

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

`npm run build` type-checks, builds the client bundle, then prerenders the page into `dist/index.html` (`src/entry-server.tsx` + `scripts/prerender.mjs`) so crawlers and link previews see real content. The browser hydrates that HTML on load. The production build is generated in `dist/` and is ignored by Git.

## Editing the portfolio

- `src/data/content.ts`: all copy — hero `recentLog`, experience, projects, writing posts, about, stack, and contact details.
  - Projects with `featured: true` get the large alternating rows; the rest go in the grid.
  - Posts without an `href` show as "soon". Remove every post to hide the Writing section and its nav link. Set `allPostsHref` once there is a page that lists them.
- `src/components/`: one component and stylesheet per section.
- `src/pages/Home.tsx`: section order.
- `src/index.css`: design tokens, shared pieces (buttons, prompt lines, panels), and font imports.
- `public/images/projects/`: project diagrams as 1400×788 WebP.
- `public/images/boston.webp`: about photo.
- `public/og.png`: 1200×630 social preview image.
- `public/Sevara_Badriddinova_Resume.pdf`: resume linked from the header, hero, and contact.

## Stack

React, TypeScript, Vite, and plain CSS. Fonts are Bricolage Grotesque, Plus Jakarta Sans, and JetBrains Mono (self-hosted, Latin subset). The only animation is the blinking cursor, which is turned off for reduced-motion preferences.
