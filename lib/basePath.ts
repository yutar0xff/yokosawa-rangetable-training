/** Must match `basePath` in next.config.ts (no trailing slash). */
const DEFAULT_BASE_PATH = "/apps/yokosawa-rangetable-training";

function normalizeBasePath(value?: string): string {
  if (!value) return DEFAULT_BASE_PATH;
  if (value === "/") return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
