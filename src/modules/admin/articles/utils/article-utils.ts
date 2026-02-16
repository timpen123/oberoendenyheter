export const DEFAULT_CATEGORY = "Övrigt";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export function withSlugSuffix(baseSlug: string, attempt: number): string {
  const safeBase = baseSlug || `artikel-${Date.now()}`;
  return `${safeBase}-${Date.now()}-${attempt}`;
}

export function excerptFromBody(body: string, maxLen = 200): string {
  const plain = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLen) return plain;
  const cut = plain.slice(0, maxLen).trim();
  const last = cut.lastIndexOf(" ");
  return last > maxLen * 0.6 ? `${cut.slice(0, last)}…` : `${cut}…`;
}

export function firstImageFromBody(body: string): string {
  const match = body.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
  return match?.[1]?.trim() ?? "";
}

export function pickText(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function looksLikeJsonObject(input: string): boolean {
  const s = input.trim();
  return s.startsWith("{") && s.endsWith("}");
}
