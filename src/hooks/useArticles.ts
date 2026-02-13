"use client";

import { useState, useEffect, useCallback } from "react";
import { getArticles } from "@/lib/api/site";
import type { ArticlesListParams, ArticlesResponse } from "@/lib/api/types";

export interface UseArticlesResult {
  data: ArticlesResponse | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook för att hämta artikelista från site-API.
 * Använd i klientkomponenter som ska visa nyhetslistan.
 */
export function useArticles(params: ArticlesListParams = {}): UseArticlesResult {
  const [data, setData] = useState<ArticlesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getArticles(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte hämta nyheter");
    } finally {
      setIsLoading(false);
    }
  }, [params.page, params.limit]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { data, error, isLoading, refetch: fetchArticles };
}
