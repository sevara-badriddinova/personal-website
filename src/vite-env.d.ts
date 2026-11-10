/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "1" for static preview builds that need relative links (see src/lib/url.ts). */
  readonly VITE_RELATIVE_LINKS?: string;
}
