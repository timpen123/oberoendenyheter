import { CombinedPayload } from "@/modules/admin/articles/services/article-normalizer.service";
import { looksLikeJsonObject } from "@/modules/admin/articles/utils/article-utils";

export function parseCombinedBodyField(input: string): CombinedPayload | null {
  const raw = input.trim();
  if (!raw) return null;

  if (looksLikeJsonObject(raw)) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>;
        return {
          title: typeof obj.title === "string" ? obj.title.trim() : undefined,
          body: typeof obj.body === "string" ? obj.body.trim() : undefined,
          excerpt: typeof obj.excerpt === "string" ? obj.excerpt.trim() : undefined,
          category: typeof obj.category === "string" ? obj.category.trim() : undefined,
          read_time: typeof obj.read_time === "string" ? obj.read_time.trim() : undefined,
          source: typeof obj.source === "string" ? obj.source.trim() : undefined,
          external_id: typeof obj.external_id === "string" ? obj.external_id.trim() : undefined,
          status: obj.status === "draft" || obj.status === "published" ? obj.status : undefined,
        };
      }
    } catch {
      return null;
    }
  }

  const lines = raw.split(/\r?\n/).map((line) => line.trim());
  const nonEmpty = lines.filter(Boolean);
  if (nonEmpty.length < 2) return null;
  return {
    title: nonEmpty[0],
    body: nonEmpty.slice(1).join("\n").trim(),
  };
}
