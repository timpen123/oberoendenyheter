import type { Article, ArticleInsert, ArticleListParams, ArticleListResult } from "./types";
import { getSupabaseAdmin, getArticlesTableName } from "./supabase";

function mapRow(row: Record<string, unknown>): Article {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: row.excerpt != null ? String(row.excerpt) : null,
    body: String(row.body),
    image: row.image != null ? String(row.image) : "",
    category: row.category != null ? String(row.category) : "Övrigt",
    readTime: row.read_time != null ? String(row.read_time) : "1 min",
    published_at: row.published_at != null ? String(row.published_at) : null,
    created_at: String(row.created_at),
    source: row.source != null ? String(row.source) : null,
    external_id: row.external_id != null ? String(row.external_id) : null,
  };
}

export async function getArticlesListFromSupabase(
  params: ArticleListParams = {}
): Promise<ArticleListResult> {
  const supabase = getSupabaseAdmin();
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const table = getArticlesTableName();
  const { data: articles, error, count } = await supabase
    .from(table)
    .select("id,title,slug,excerpt,body,image,category,read_time,published_at,created_at,source,external_id", { count: "exact" })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const list = (articles ?? []).map((row) => mapRow(row as Record<string, unknown>));
  return {
    articles: list,
    total: count ?? list.length,
    page,
    limit,
  };
}

export async function getArticleByIdFromSupabase(id: string): Promise<Article | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from(getArticlesTableName()).select("*").eq("id", id).single();
  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function getArticleBySlugFromSupabase(slug: string): Promise<Article | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from(getArticlesTableName()).select("*").eq("slug", slug).single();
  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function insertArticleToSupabase(input: ArticleInsert): Promise<Article> {
  const supabase = getSupabaseAdmin();
  const slug = input.slug ?? input.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const { data, error } = await supabase
    .from(getArticlesTableName())
    .insert({
      title: input.title,
      slug,
      excerpt: input.excerpt ?? null,
      body: input.body,
      image: input.image ?? "",
      category: input.category ?? "Övrigt",
      read_time: input.read_time ?? "1 min",
      published_at: input.published_at ?? null,
      source: input.source ?? null,
      external_id: input.external_id ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRow(data as Record<string, unknown>);
}

export async function updateArticleInSupabase(id: string, input: Partial<ArticleInsert>): Promise<Article | null> {
  const supabase = getSupabaseAdmin();
  const payload: Record<string, unknown> = {};
  if (input.title != null) payload.title = input.title;
  if (input.slug != null) payload.slug = input.slug;
  if (input.excerpt !== undefined) payload.excerpt = input.excerpt;
  if (input.body != null) payload.body = input.body;
  if (input.image !== undefined) payload.image = input.image;
  if (input.category !== undefined) payload.category = input.category;
  if (input.read_time !== undefined) payload.read_time = input.read_time;
  if (input.published_at !== undefined) payload.published_at = input.published_at;
  if (input.source !== undefined) payload.source = input.source;
  if (input.external_id !== undefined) payload.external_id = input.external_id;

  const { data, error } = await supabase.from(getArticlesTableName()).update(payload).eq("id", id).select().single();
  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function deleteArticleFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(getArticlesTableName()).delete().eq("id", id);
  return !error;
}
