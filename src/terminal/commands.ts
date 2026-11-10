// The command engine every terminal version shares. Pure functions: parse a line,
// return what to print and (optionally) where to go. Side effects live in perform().
import { about, contact, experience, projectAnchor, projects, recentLog, site } from "../data/content";
import { posts } from "../data/posts";
import { file, page } from "../lib/url";

export type Tone = "muted" | "accent" | "error" | "strong";
/** One run of text. `href` renders a link; `run` renders a button that runs that command. */
export type Seg = { text: string; tone?: Tone; href?: string; run?: string };
/** A printed line. `cols` lays the segments out as aligned columns. */
export type Line = { segs: Seg[]; cols?: 2 | 3 };
export type Effect = { type: "scroll"; id: string } | { type: "open"; href: string } | { type: "clear" };
export type Result = { lines: Line[]; effect?: Effect };

type Command = {
  name: string;
  example: string;
  summary: string;
  args?: () => string[];
  run: (args: string[]) => Result;
};

const t = (text: string, tone?: Tone): Seg => ({ text, tone });
const link = (text: string, href: string): Seg => ({ text, href });
/** A clickable command. cd/open commands also carry their real href, so Cmd-click and middle-click work. */
const cmd = (command: string, text = command): Seg => ({ text, run: command, href: hrefFor(command) });
const line = (...segs: Seg[]): Line => ({ segs });
const gap = t("  ");

export const SECTIONS = ["experience", "projects", ...(posts.length > 0 ? ["writing"] : []), "about", "contact"];
const SLUGS = projects.map((p) => p.slug);
const POST_SLUGS = posts.map((p) => p.slug);
const FILES = ["recent.log", "about.md", "contact.txt", "resume.pdf"];

const OPENABLE: Record<string, { label: string; href: string }> = {
  resume: {
    label: "resume.pdf",
    get href() {
      return file(site.resume);
    },
  },
  github: { label: "github.com/sevara-badriddinova", href: contact.github },
  linkedin: { label: "linkedin.com/in/sevarabadriddinova", href: contact.linkedin },
  email: { label: contact.email, href: `mailto:${contact.email}` },
};
const OPEN_ALIASES: Record<string, string> = { "resume.pdf": "resume", cv: "resume", mail: "email" };

const clean = (arg = "") =>
  arg
    .trim()
    .toLowerCase()
    .replace(/^\.\//, "")
    .replace(/^~\//, "")
    .replace(/\/+$/, "");

export const recentLogLines = (): Line[] =>
  recentLog.map((e) => ({ cols: 3, segs: [t(`[${e.scope}]`, "accent"), t(e.label, "muted"), t(e.value, "strong")] }));

const go = (id: string, label: string): Result => ({
  lines: [line(t("→ ", "accent"), t(label))],
  effect: { type: "scroll", id },
});

const error = (message: string, hint: Seg[] = [t("Type ", "muted"), cmd("help"), t(" to see what you can run.", "muted")]): Result => ({
  lines: [line(t(message, "error")), line(...hint)],
});

function projectFrom(arg: string) {
  const slug = arg.startsWith("projects/") ? arg.slice("projects/".length) : arg;
  return projects.find((p) => p.slug === slug || p.name.toLowerCase() === slug);
}

/** Element id a `cd` argument jumps to, or undefined if there is none. */
function cdTarget(raw = ""): string | undefined {
  const arg = clean(raw);
  if (!arg || arg === "~" || arg === "/" || arg === "..") return "top";
  if (SECTIONS.includes(arg)) return arg;
  const project = projectFrom(arg);
  return project ? projectAnchor(project.slug) : undefined;
}

/** URL an `open` argument opens, or undefined if there is none. */
function openHref(raw = ""): string | undefined {
  const arg = clean(raw);
  const project = projectFrom(arg);
  if (project) return project.links[0].href;
  const post = posts.find((p) => p.slug === arg.replace(/^writing\//, "").replace(/\.md$/, ""));
  if (post) return page(post.href);
  return OPENABLE[OPEN_ALIASES[arg] ?? arg]?.href;
}

function hrefFor(command: string): string | undefined {
  const [name, ...rest] = command.trim().split(/\s+/);
  const arg = rest.join(" ");
  if (name === "cd") {
    const id = cdTarget(arg);
    return id ? `#${id}` : undefined;
  }
  if (name === "open") return openHref(arg);
  return undefined;
}

function openTarget(raw: string): Result {
  const arg = clean(raw);
  if (!arg) {
    return error("open: say what to open.", [
      t("Try ", "muted"),
      ...SLUGS.slice(0, 3).flatMap((s) => [cmd(`open ${s}`), gap]),
      cmd("open resume"),
    ]);
  }
  const href = openHref(arg);
  if (href) {
    const item = Object.values(OPENABLE).find((o) => o.href === href);
    const post = posts.find((p) => page(p.href) === href);
    const label = item?.label ?? (post ? `writing/${post.slug}` : href.replace(/^https?:\/\//, ""));
    return {
      lines: [line(t("opening ", "muted"), link(label, href))],
      effect: { type: "open", href },
    };
  }
  return error(`open: nothing called "${raw}".`, [t("Try ", "muted"), cmd("ls projects"), t(" for names.", "muted")]);
}

const COMMANDS: Command[] = [
  {
    name: "help",
    example: "help",
    summary: "list commands",
    run: () => ({
      lines: [
        line(t("Click a command or type it. Tab completes, ↑ recalls.", "muted")),
        ...COMMANDS.map((c): Line => ({ cols: 2, segs: [cmd(c.example), t(c.summary, "muted")] })),
      ],
    }),
  },
  {
    name: "ls",
    example: "ls projects",
    summary: "list sections, projects or experience",
    args: () => ["projects", "experience", ...(posts.length > 0 ? ["writing"] : [])],
    run: ([raw]) => {
      const arg = clean(raw);
      if (!arg || arg === "~" || arg === ".") {
        return {
          lines: [
            line(
              ...SECTIONS.flatMap((s) => [cmd(`cd ${s}`, `${s}/`), gap]),
              cmd("cat recent.log", "recent.log"),
              gap,
              cmd("open resume", "resume.pdf"),
            ),
          ],
        };
      }
      if (arg === "projects") {
        return {
          lines: [
            line(...SLUGS.flatMap((s) => [cmd(`cd projects/${s}`, s), gap])),
            line(t("Click one to jump to it, or ", "muted"), cmd("open jobradar"), t(" for the code.", "muted")),
          ],
        };
      }
      if (arg === "experience") {
        return {
          lines: experience.map((e): Line => ({ cols: 3, segs: [t(e.dates, "muted"), cmd("cd experience", e.handle), t(e.role)] })),
        };
      }
      if (arg === "writing" && posts.length > 0) {
        return {
          lines: [
            ...posts.map((p): Line => ({ cols: 2, segs: [t(p.date, "muted"), cmd(`open ${p.slug}`, p.title)] })),
            line(t("Click one to read it.", "muted")),
          ],
        };
      }
      return error(`ls: ${raw}: no such directory`, [t("Try ", "muted"), cmd("ls")]);
    },
  },
  {
    name: "cd",
    example: "cd projects",
    summary: "jump to a section",
    args: () => [...SECTIONS, ...SLUGS.map((s) => `projects/${s}`)],
    run: ([raw]) => {
      const id = cdTarget(raw);
      if (!id) return error(`cd: no such directory: ${raw}`, [t("Try ", "muted"), cmd("ls"), t(" to see where you can go.", "muted")]);
      const project = projectFrom(clean(raw));
      return go(id, id === "top" ? "~" : project ? `projects/${project.slug}` : id);
    },
  },
  {
    name: "open",
    example: "open jobradar",
    summary: "open a project, post, resume, github or linkedin",
    args: () => [...SLUGS, ...POST_SLUGS, "resume", "github", "linkedin"],
    run: ([raw = ""]) => openTarget(raw),
  },
  {
    name: "cat",
    example: "cat recent.log",
    summary: "print a file",
    args: () => FILES,
    run: ([raw]) => {
      const arg = clean(raw);
      if (arg === "recent.log") return { lines: recentLogLines() };
      if (arg === "about.md") {
        return {
          lines: [line(t(about.title, "strong")), line(t(about.lead, "muted")), line(t("More in ", "muted"), cmd("cd about"))],
        };
      }
      if (arg === "contact.txt") {
        return {
          lines: [
            { cols: 2, segs: [t("email", "accent"), link(contact.email, `mailto:${contact.email}`)] },
            { cols: 2, segs: [t("github", "accent"), link(OPENABLE.github.label, contact.github)] },
            { cols: 2, segs: [t("linkedin", "accent"), link(OPENABLE.linkedin.label, contact.linkedin)] },
          ],
        };
      }
      if (arg === "resume.pdf") return openTarget("resume");
      return error(`cat: ${raw ?? ""}: no such file`, [t("Files: ", "muted"), ...FILES.flatMap((f) => [cmd(`cat ${f}`, f), gap])]);
    },
  },
  {
    name: "whoami",
    example: "whoami",
    summary: "about me",
    run: () => ({
      lines: [line(t(site.name, "strong")), line(t(site.role, "muted"))],
      effect: { type: "scroll", id: "about" },
    }),
  },
  {
    name: "mail",
    example: "mail",
    summary: "email me",
    run: () => openTarget("email"),
  },
  { name: "resume", example: "resume", summary: "open my resume", run: () => openTarget("resume") },
  { name: "github", example: "github", summary: "open my GitHub", run: () => openTarget("github") },
  { name: "linkedin", example: "linkedin", summary: "open my LinkedIn", run: () => openTarget("linkedin") },
  { name: "clear", example: "clear", summary: "clear the screen", run: () => ({ lines: [], effect: { type: "clear" } }) },
];

const ALIASES: Record<string, string> = { "?": "help", man: "help", ll: "ls", dir: "ls", cv: "resume", email: "mail" };
const byName = (name: string) => COMMANDS.find((c) => c.name === (ALIASES[name] ?? name));

export function execute(raw: string): Result {
  const input = raw.trim();
  if (!input) return { lines: [] };
  const [first, ...rest] = input.split(/\s+/);
  const name = first.toLowerCase();
  const command = byName(name);
  if (command) return command.run(rest.length ? [rest.join(" ")] : []);

  // Forgiving shortcuts: a bare section or project name jumps there.
  const bare = clean(input);
  if (SECTIONS.includes(bare) || projectFrom(bare)) return byName("cd")!.run([bare]);

  return error(`command not found: ${first}`);
}

function commonPrefix(values: string[]) {
  return values.reduce((prefix, v) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === v[i]) i++;
    return prefix.slice(0, i);
  });
}

/** Tab completion. `options` lists candidates when there is more than one. */
export function complete(input: string): { value: string; options: string[] } {
  const leading = input.replace(/^\s+/, "");
  const space = leading.indexOf(" ");
  if (space === -1) {
    const partial = leading.toLowerCase();
    const options = COMMANDS.map((c) => c.name).filter((n) => n.startsWith(partial));
    if (options.length === 1) return { value: `${options[0]} `, options: [] };
    if (options.length > 1) return { value: commonPrefix(options), options };
    return { value: input, options: [] };
  }
  const name = leading.slice(0, space);
  const partial = leading.slice(space + 1).trimStart().toLowerCase();
  const args = byName(name.toLowerCase())?.args?.() ?? [];
  const options = args.filter((a) => a.startsWith(partial));
  if (options.length === 1) return { value: `${name} ${options[0]}`, options: [] };
  if (options.length > 1) return { value: `${name} ${commonPrefix(options)}`, options };
  return { value: input, options: [] };
}

/** Lines that list completion candidates, each clickable. */
export const optionLines = (prefix: string, options: string[]): Line[] => [
  line(...options.flatMap((o) => [cmd(prefix ? `${prefix} ${o}` : o, o), gap])),
];
