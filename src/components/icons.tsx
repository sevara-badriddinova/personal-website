/**
 * Minimal, consistent-stroke line icons used as small editorial motifs
 * (database, server, network, terminal, globe, node/graph). Kept simple
 * and geometric on purpose — no cartoon illustrations.
 */
import type { SVGProps } from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconDatabase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
      <path d="M4.5 5.5v13c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-13" />
      <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" />
    </svg>
  );
}

export function IconServer(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="17" height="7" rx="1.2" />
      <circle cx="7" cy="7" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="7" cy="17" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11 7h6M11 17h6" />
    </svg>
  );
}

export function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <ellipse cx="12" cy="12" rx="3.6" ry="8.5" />
      <path d="M3.7 9h16.6M3.7 15h16.6" />
    </svg>
  );
}

export function IconTerminalGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M7 9.5 10.5 12 7 14.5M13 14.5h4" />
    </svg>
  );
}

export function IconNode(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <circle cx="12" cy="4.5" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M12 6.5 6.2 16.2M12 6.5l5.8 9.7M7 18h10" />
    </svg>
  );
}

export function IconBrackets(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M9 4 5 12l4 8M15 4l4 8-4 8" />
    </svg>
  );
}

export function IconArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
      <path d="M6 18 18 6M8 6h10v10" />
    </svg>
  );
}
