/** Must match `basePath` in next.config.ts (no trailing slash). Empty = root. */
const DEFAULT_BASE_PATH = "";

function normalizeBasePath(value?: string): string {
  if (value === undefined || value === "") return DEFAULT_BASE_PATH;
  if (value === "/") return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

/** Canonical public origin (no trailing slash). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rangetable.yutar0xff.com"
).replace(/\/$/, "");
