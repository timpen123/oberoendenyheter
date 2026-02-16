import {
  CombinedPayload,
  toArticleInsertRowFromFields,
  type ArticleInsertRow,
} from "@/modules/admin/articles/services/article-normalizer.service";
import {
  excerptFromBody,
  looksLikeJsonObject,
} from "@/modules/admin/articles/utils/article-utils";
import { parseCombinedBodyField } from "@/modules/admin/articles/services/make-body-parser.service";

export function getFormString(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function getFirstFormFile(form: FormData): File | null {
  for (const [, value] of form.entries()) {
    if (value instanceof File) return value;
  }
  return null;
}

export function parseArticleFromMultipart(formData: FormData): {
  row: ArticleInsertRow | null;
  error?: string;
  parsedCombined?: CombinedPayload | null;
} {
  let title = getFormString(formData, "title");
  let body = getFormString(formData, "body");

  let parsedCombined: CombinedPayload | null = null;
  if (body && looksLikeJsonObject(body)) {
    parsedCombined = parseCombinedBodyField(body);
    if (!title) title = parsedCombined?.title ?? "";
    if (parsedCombined?.body) body = parsedCombined.body;
  } else if (!title || !body) {
    parsedCombined = parseCombinedBodyField(body);
    if (!title) title = parsedCombined?.title ?? "";
    if (parsedCombined?.body) body = parsedCombined.body;
  }

  if (!title || !body) {
    return {
      row: null,
      error:
        "title och body krävs från Make. Skicka separata fält, eller key=body med JSON ({title,body,...}) alternativt första raden=titel och resten=body.",
    };
  }

  let excerptInput = getFormString(formData, "excerpt");
  if (excerptInput && looksLikeJsonObject(excerptInput)) {
    const parsedExcerpt = parseCombinedBodyField(excerptInput);
    if (parsedExcerpt?.excerpt) excerptInput = parsedExcerpt.excerpt;
    else if (parsedExcerpt?.body) excerptInput = excerptFromBody(parsedExcerpt.body);
  }

  const row = toArticleInsertRowFromFields({
    title,
    body,
    excerpt: excerptInput || parsedCombined?.excerpt,
    image: "",
    category: getFormString(formData, "category") || parsedCombined?.category,
    read_time: getFormString(formData, "read_time") || parsedCombined?.read_time,
    source: getFormString(formData, "source") || parsedCombined?.source,
    external_id: getFormString(formData, "external_id") || parsedCombined?.external_id,
    status:
      getFormString(formData, "status") === "draft" || getFormString(formData, "status") === "published"
        ? (getFormString(formData, "status") as "draft" | "published")
        : parsedCombined?.status,
  });

  return { row, parsedCombined };
}
