/**
 * Site-API (publik läsning): artiklar, kontakt etc.
 * Används av frontend för att hämta data.
 */

import type { ArticlesListParams, ArticlesResponse } from "./types";
import { get } from "./client";

const BASE = "/api/site";

/**
 * Hämtar lista med artiklar (paginering).
 * GET /api/site/articles
 */
export async function getArticles(
  params: ArticlesListParams = {}
): Promise<ArticlesResponse> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  return get<ArticlesResponse>(`${BASE}/articles`, {
    params: { page: String(page), limit: String(limit) },
  });
}
