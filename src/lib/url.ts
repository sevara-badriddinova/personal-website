// Every internal link and file path goes through these two helpers.
//
// On the real site (base "/") they return the path unchanged. A build with a relative
// base (vite build --base ./, used for static previews) has no server to resolve
// "/writing" or "/images/x.webp", so the helpers turn them into paths relative to the
// current page's folder, pointing at the actual index.html files.
const RELATIVE = import.meta.env.BASE_URL !== "/";

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
