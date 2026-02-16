import { getAdminSupabaseDataSource, getArticlesTableName, getSupabaseAdminForAdmin } from "@/lib/supabase";
import {
  type ArticleInsertRow,
} from "@/modules/admin/articles/services/article-normalizer.service";
import { withSlugSuffix } from "@/modules/admin/articles/utils/article-utils";

export const ARTICLE_IMAGE_BUCKET = "article-images";
export const MAX_IMAGE_SIZE_MB = 4;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export function getAdminContext() {
  return {
    supabase: getSupabaseAdminForAdmin(),
    dataSource: getAdminSupabaseDataSource(),
    table: getArticlesTableName(),
  };
}

export async function insertArticleWithRetry(row: ArticleInsertRow, maxAttempts = 3) {
  const { supabase, dataSource, table } = getAdminContext();
  let payload: ArticleInsertRow = { ...row };
  let lastError: string | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select("id,title,slug,image,created_at")
      .single();

    if (!error) return { data, error: null, dataSource, table };

    const isDuplicateSlug =
      error.code === "23505" && String(error.message).includes(`${table}_slug_key`);
    if (isDuplicateSlug) {
      payload = {
        ...payload,
        slug: withSlugSuffix(payload.slug, attempt),
      };
      continue;
    }

    lastError = error.message || "Unknown insert error";
    break;
  }

  return { data: null, error: lastError ?? "Kunde inte spara efter retries", dataSource, table };
}

export async function uploadImageToBucket(file: File) {
  const { supabase, dataSource } = getAdminContext();
  const ext = (file.name || "").split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpeg", "jpg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;

  const { data, error } = await supabase.storage
    .from(ARTICLE_IMAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) return { publicUrl: null, path: null, error: error.message, dataSource };
  const { data: urlData } = supabase.storage.from(ARTICLE_IMAGE_BUCKET).getPublicUrl(data.path);
  return { publicUrl: urlData.publicUrl, path: data.path, error: null, dataSource };
}
