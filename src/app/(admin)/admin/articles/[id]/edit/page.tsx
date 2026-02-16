"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch, uploadAdminImage } from "@/components/admin/adminApi";
import type { Article } from "@/lib/types";
import { ARTICLE_CATEGORIES } from "@/lib/articleCategories";

export default function AdminArticlesEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<(typeof ARTICLE_CATEGORIES)[number]>("Övrigt");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminFetch(`/api/admin/articles/${id}`);
        if (!res.ok) throw new Error("Kunde inte hämta artikel");
        const article = (await res.json()) as Article;
        setTitle(article.title);
        setBody(article.body);
        setExcerpt(article.excerpt ?? "");
        if (ARTICLE_CATEGORIES.includes(article.category as (typeof ARTICLE_CATEGORIES)[number])) {
          setCategory(article.category as (typeof ARTICLE_CATEGORIES)[number]);
        } else {
          setCategory("Övrigt");
        }
        setImage(article.image ?? "");
        setStatus(article.status);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Kunde inte hämta artikel");
      } finally {
        setLoading(false);
      }
    };
    if (id) void load();
  }, [id]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let imageUrl = image;
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadAdminImage(imageFile);
        setImage(imageUrl);
        setUploadingImage(false);
      }

      const res = await adminFetch(`/api/admin/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          excerpt: excerpt || null,
          category,
          image: imageUrl,
          status,
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || "Kunde inte spara artikel");
      }
      router.push("/admin/articles");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte spara artikel");
    } finally {
      setUploadingImage(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Laddar artikel...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Redigera artikel</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded border border-border bg-card p-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Titel</span>
          <input
            className="w-full rounded border border-border bg-background px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Kategori</span>
          <select
            className="w-full rounded border border-border bg-background px-3 py-2"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as (typeof ARTICLE_CATEGORIES)[number])
            }
          >
            {ARTICLE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium">Bild</span>
          <div>
            <label
              htmlFor="replace-image"
              className="inline-flex cursor-pointer items-center rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Byt nuvarande bild
            </label>
            <input
              id="replace-image"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {imageFile
              ? `Vald fil: ${imageFile.name}`
              : "Ingen ny fil vald. Nuvarande bild används tills du väljer en ny."}
          </p>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Nuvarande bild-URL</span>
          <input
            className="w-full rounded border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
            value={image}
            readOnly
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Ingress</span>
          <textarea
            className="min-h-20 w-full rounded border border-border bg-background px-3 py-2"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Brödtext</span>
          <textarea
            className="min-h-56 w-full rounded border border-border bg-background px-3 py-2"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="w-full rounded border border-border bg-background px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting || uploadingImage}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {uploadingImage ? "Laddar upp bild..." : submitting ? "Sparar..." : "Spara ändringar"}
        </button>
      </form>
    </div>
  );
}
