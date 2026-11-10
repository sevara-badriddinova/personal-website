// Every internal link and file path goes through these two helpers.
//
// On the real site they return the path unchanged. A static preview build
// (VITE_RELATIVE_LINKS=1 vite build --base ./) has no server to resolve "/writing" or
// "/images/x.webp", so the helpers turn them into paths relative to the current page's
// folder, pointing at the actual index.html files. It's an env flag rather than
// BASE_URL because the SSR build must make the same choice as the browser build.
const RELATIVE = import.meta.env.VITE_RELATIVE_LINKS === "1";

let depth = 0;

/** Set once per page, before rendering: how many folders deep the page's HTML file is. */
export function setDepth(value: number) {
  depth = value;
}

const up = () => "../".repeat(depth);

/** A page or a section of a page on this site: "/", "/writing", "/writing/x", "/#projects". */
export function page(path: string): string {
  if (!RELATIVE) return path;
  const [route, hash] = path.split("#");
  const folder = route.replace(/^\/+|\/+$/g, "");
  return `${up()}${folder ? `${folder}/` : ""}index.html${hash !== undefined ? `#${hash}` : ""}`;
}

/** A file from public/: "/images/boston.webp", "/Sevara_Badriddinova_Resume.pdf". */
export function file(path: string): string {
  return RELATIVE ? up() + path.replace(/^\/+/, "") : path;
}
