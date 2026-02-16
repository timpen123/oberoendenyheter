import type { Article, ArticleListParams, ArticleListResult } from "./types";

import articlesJson from "@/data/articles.json";

const articles = articlesJson as Article[];

function isPublicArticle(article: Article): boolean {
  return article.status !== "draft";
}

function sortByDate(a: Article, b: Article): number {
  const dateA = a.published_at ?? a.created_at;
  const dateB = b.published_at ?? b.created_at;
  return new Date(dateB).getTime() - new Date(dateA).getTime();
}

export function getArticlesList(params: ArticleListParams = {}): ArticleListResult {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const sorted = [...articles].filter(isPublicArticle).sort(sortByDate);
  const total = sorted.length;
  const start = (page - 1) * limit;
  const articlesPage = sorted.slice(start, start + limit);
  return { articles: articlesPage, total, page, limit };
}

export function getArticleById(id: string): Article | null {
  return articles.find((a) => a.id === id) ?? null;
}

export function getArticleBySlug(slug: string): Article | null {
  return articles.find((a) => a.slug === slug && isPublicArticle(a)) ?? null;
}

export function getArticlesByCategory(category: string, excludeId?: string, limit = 5): Article[] {
  return articles
    .filter((a) => a.category === category && a.id !== excludeId && isPublicArticle(a))
    .slice(0, limit);
}
