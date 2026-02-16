import {
  DEFAULT_CATEGORY,
  DEFAULT_READ_TIME,
  excerptFromBody,
  firstImageFromBody,
  pickText,
  slugify,
} from "@/modules/admin/articles/utils/article-utils";

export interface ArticleInsertRow {
  title: string;
  body: string;
  slug: string;
  excerpt: string | null;
  image: string;
  category: string;
  read_time: string;
  published_at: string | null;
  source: string | null;
  external_id: string | null;
}

export interface CombinedPayload {
  title?: string;
  body?: string;
  excerpt?: string;
  category?: string;
  read_time?: string;
  source?: string;
  external_id?: string;
}

function normalizePayload(payload: Record<string, unknown>): Record<string, unknown> {
  const title = pickText(payload, ["title", "headline", "name", "subject", "label"]);
  const body = pickText(payload, ["body", "content", "description", "text", "html", "summary"]);
  const excerpt = pickText(payload, ["excerpt", "summary", "snippet", "description"]);
  const image = pickText(payload, ["image", "imageUrl", "thumbnail", "enclosure", "url"]);
  let category = pickText(payload, ["category", "section", "channel", "type"]);
  if (!category && Array.isArray(payload.categories) && payload.categories.length > 0) {
    const first = payload.categories[0];
    category = typeof first === "string" ? first.trim() : "";
  }
  if (!category) category = DEFAULT_CATEGORY;
  const source = pickText(payload, ["source", "url", "link", "canonical"]);
  const externalId = pickText(payload, ["external_id", "id", "guid", "uuid"]);

  return {
    ...payload,
    title: title || (payload.title as string),
    body: body || (payload.body as string),
    excerpt: excerpt || (payload.excerpt as string) || null,
    image: image || (payload.image as string) || "",
    category: category || (payload.category as string) || DEFAULT_CATEGORY,
    source: source || (payload.source as string) || null,
    external_id: externalId || (payload.external_id as string) || null,
  };
}

export function toArticleInsertRow(
  payload: Record<string, unknown>,
  idx: number
): ArticleInsertRow | null {
  const normalized = normalizePayload(payload);
  const title = typeof normalized.title === "string" ? normalized.title.trim() : "";
  const body = typeof normalized.body === "string" ? normalized.body.trim() : "";
  if (!title || !body) return null;

  const slug =
    typeof payload.slug === "string" && payload.slug.trim()
      ? payload.slug.trim()
      : slugify(title || `artikel-${Date.now()}-${idx}`);
  const excerptRaw = typeof normalized.excerpt === "string" ? normalized.excerpt.trim() : "";
  const imageRaw = typeof normalized.image === "string" ? normalized.image.trim() : "";

  return {
    title,
    body,
    slug,
    excerpt: excerptRaw || excerptFromBody(body),
    image: imageRaw || firstImageFromBody(body),
    category: typeof normalized.category === "string" ? normalized.category : DEFAULT_CATEGORY,
    read_time:
      typeof normalized.read_time === "string"
        ? normalized.read_time
        : typeof normalized.readTime === "string"
          ? normalized.readTime
          : DEFAULT_READ_TIME,
    published_at: typeof normalized.published_at === "string" ? normalized.published_at : null,
    source: typeof normalized.source === "string" ? normalized.source : null,
    external_id: typeof normalized.external_id === "string" ? normalized.external_id : null,
  };
}

export function toArticleInsertRowFromFields(input: {
  title: string;
  body: string;
  excerpt?: string;
  image?: string;
  category?: string;
  read_time?: string;
  source?: string;
  external_id?: string;
}): ArticleInsertRow {
  const title = input.title.trim();
  const body = input.body.trim();
  return {
    title,
    body,
    slug: slugify(title) || `artikel-${Date.now()}`,
    excerpt: (input.excerpt ?? "").trim() || excerptFromBody(body),
    image: (input.image ?? "").trim(),
    category: (input.category ?? "").trim() || DEFAULT_CATEGORY,
    read_time: (input.read_time ?? "").trim() || DEFAULT_READ_TIME,
    published_at: null,
    source: (input.source ?? "").trim() || null,
    external_id: (input.external_id ?? "").trim() || null,
  };
}
