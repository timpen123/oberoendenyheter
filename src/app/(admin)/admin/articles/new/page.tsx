"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, uploadAdminImage } from "@/components/admin/adminApi";
import { ARTICLE_CATEGORIES } from "@/lib/articleCategories";

export default function AdminArticlesNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<(typeof ARTICLE_CATEGORIES)[number]>("Övrigt");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const res = await adminFetch("/api/admin/articles", {
        method: "POST",
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
        throw new Error(payload.error || "Kunde inte skapa artikel");
      }
      router.push("/admin/articles");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte skapa artikel");
    } finally {
      setUploadingImage(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Ny artikel</h1>

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

        <label className="block space-y-1">
          <span className="text-sm font-medium">Bildfil</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full rounded border border-border bg-background px-3 py-2"
          />
          <p className="text-xs text-muted-foreground">
            Välj bild från datorn. URL laddas upp och sätts automatiskt.
          </p>
        </label>

        {image ? (
          <label className="block space-y-1">
            <span className="text-sm font-medium">Bild-URL (auto)</span>
            <input
              className="w-full rounded border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
              value={image}
              readOnly
            />
          </label>
        ) : null}

        <label className="hidden space-y-1">
          <span className="text-sm font-medium">Bild-URL</span>
          <input
            className="w-full rounded border border-border bg-background px-3 py-2"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
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
          {uploadingImage ? "Laddar upp bild..." : submitting ? "Sparar..." : "Skapa artikel"}
        </button>
      </form>
    </div>
  );
}
