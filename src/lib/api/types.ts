import type { Article } from "@/lib/types";

/** Parametrar för att lista artiklar (paginering). */
export interface ArticlesListParams {
  page?: number;
  limit?: number;
}

/** Svar från GET /api/site/articles. */
export interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  _meta?: {
    dataSource?: "stage" | "main";
    total?: number;
  };
}

/** Fel-svar från API (t.ex. 4xx/5xx med { error: string }). */
export interface ApiErrorResponse {
  error: string;
}
