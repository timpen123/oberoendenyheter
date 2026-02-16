"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";
import { adminFetch } from "@/components/admin/adminApi";
import { ARTICLE_CATEGORIES } from "@/lib/articleCategories";
import { Check, X } from "lucide-react";

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | (typeof ARTICLE_CATEGORIES)[number]>("all");
  const [imageFilter, setImageFilter] = useState<"all" | "with" | "without">("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/articles?page=1&limit=100");
      if (!res.ok) throw new Error("Kunde inte hämta artiklar");
      const data = (await res.json()) as { articles: Article[] };
      setArticles(data.articles ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte hämta artiklar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onDelete = async (id: string) => {
    const confirmed = window.confirm("Radera artikeln permanent?");
    if (!confirmed) return;
    const res = await adminFetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Kunde inte radera artikel");
      return;
    }
    await load();
  };

  const filteredArticles = articles.filter((article) => {
    if (statusFilter !== "all" && article.status !== statusFilter) return false;
    if (categoryFilter !== "all" && article.category !== categoryFilter) return false;
    if (imageFilter === "with" && !article.image) return false;
    if (imageFilter === "without" && article.image) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      article.title.toLowerCase().includes(q) ||
      article.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Artiklar</h1>
        <Link
          href="/admin/articles/new"
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Ny artikel
        </Link>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök titel eller slug..."
          className="rounded border border-border bg-background px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "draft" | "published")}
          className="rounded border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Alla statusar</option>
          <option value="published">Publicerad</option>
          <option value="draft">Utkast</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as "all" | (typeof ARTICLE_CATEGORIES)[number])
          }
          className="rounded border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Alla kategorier</option>
          {ARTICLE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={imageFilter}
          onChange={(e) => setImageFilter(e.target.value as "all" | "with" | "without")}
          className="rounded border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Alla bilder</option>
          <option value="with">Har bild</option>
          <option value="without">Saknar bild</option>
        </select>
      </div>

      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Laddar artiklar...</p> : null}

      {!loading && filteredArticles.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">Inga artiklar hittades.</p>
      ) : null}

      {!loading && filteredArticles.length > 0 ? (
        <div className="overflow-hidden rounded border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Titel</th>
                <th className="px-3 py-2 font-medium">Kategori</th>
                <th className="px-3 py-2 font-medium">Bild</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Skapad</th>
                <th className="px-3 py-2 font-medium">Uppdaterad</th>
                <th className="px-3 py-2 font-medium">Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id} className="border-t border-border">
                  <td className="px-3 py-2">{article.title}</td>
                  <td className="px-3 py-2">{article.category}</td>
                  <td className="px-3 py-2">
                    {article.image ? (
                      <span className="inline-flex items-center rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-800">
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Bild
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded bg-red-100 px-2 py-1 text-xs text-red-800">
                        <X className="mr-1 h-3.5 w-3.5" />
                        Saknas
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        article.status === "published"
                          ? "rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-800"
                          : "rounded bg-amber-100 px-2 py-1 text-xs text-amber-800"
                      }
                    >
                      {article.status === "published" ? "Publicerad" : "Utkast"}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatDateTime(article.created_at)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {formatDateTime(article.updated_at ?? article.created_at)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-primary underline underline-offset-2"
                      >
                        Redigera
                      </Link>
                      <button
                        type="button"
                        onClick={() => void onDelete(article.id)}
                        className="text-destructive underline underline-offset-2"
                      >
                        Radera
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
