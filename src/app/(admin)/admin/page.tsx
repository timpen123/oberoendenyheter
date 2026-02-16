"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";
import { adminFetch } from "@/components/admin/adminApi";

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminFetch("/api/admin/articles?page=1&limit=100");
        if (!res.ok) {
          const payload = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error || "Kunde inte läsa admin-data");
        }
        const data = (await res.json()) as { articles: Article[] };
        setArticles(data.articles ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Kunde inte läsa admin-data");
      }
    };
    void load();
  }, []);

  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Admin – översikt</h1>

      {error ? <p className="mb-6 text-sm text-destructive">{error}</p> : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Totalt artiklar</p>
          <p className="text-2xl font-semibold">{articles.length}</p>
        </div>
        <div className="rounded border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Publicerade</p>
          <p className="text-2xl font-semibold">{publishedCount}</p>
        </div>
        <div className="rounded border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Utkast</p>
          <p className="text-2xl font-semibold">{draftCount}</p>
        </div>
      </div>

      <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
        <li>
          <Link href="/admin/articles" className="underline hover:text-zinc-900 dark:hover:text-zinc-50">
            Hantera artiklar
          </Link>
        </li>
        <li>
          <Link href="/admin/articles/new" className="underline hover:text-zinc-900 dark:hover:text-zinc-50">
            Skapa ny artikel
          </Link>
        </li>
      </ul>
    </div>
  );
}
