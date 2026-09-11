# Sevara Badriddinova — Portfolio

A single-page React + TypeScript portfolio with a scrapbook design, project previews, experience, education, and contact links.

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

The production build is generated in `dist/` and is ignored by Git.

## Editing the portfolio

- `src/data/content.ts`: projects, experience, education, skill groups, and contact details.
- `src/components/`: the visible page sections and their styles.
- `src/pages/Home.tsx`: section order.
- `src/index.css`: global styles, design tokens, and local font imports.
- `public/images/`: portrait, campus photo, and project previews.
- `public/Sevara_Badriddinova_Resume.pdf`: resume linked from the navigation and footer.

Project buttons link directly to GitHub. Navigation uses section anchors.
The hero photo is stored at `public/images/sevara-hero.jpg`.

## Stack

React, TypeScript, Vite, plain CSS, and GSAP. Fonts are Bricolage Grotesque, DotGothic16, Plus Jakarta Sans, and JetBrains Mono. Animations respect reduced-motion preferences.
