/**
 * En artikel i vår JSON-struktur (och framtida databas).
 * Redigera src/data/articles.json enligt denna form.
 */
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  image: string;
  category: string;
  readTime: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at?: string | null;
  source: string | null;
  external_id: string | null;
}

/** Alias för komponenter som använder NewsArticle */
export type NewsArticle = Article;

export interface ArticleInsert {
  title: string;
  slug?: string;
  excerpt?: string | null;
  body: string;
  image?: string;
  category?: string;
  read_time?: string;
  status?: "draft" | "published";
  published_at?: string | null;
  source?: string | null;
  external_id?: string | null;
}

export interface ArticleListParams {
  page?: number;
  limit?: number;
}

export interface ArticleListResult {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}
