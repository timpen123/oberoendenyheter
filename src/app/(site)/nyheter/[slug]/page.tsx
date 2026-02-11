import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/data";
import { ArticleDetailContent } from "@/components/news/ArticleDetailContent";

export default async function NyheterSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getArticlesByCategory(article.category, article.id, 4);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Tillbaka till nyheter
        </Link>
        <ArticleDetailContent
          article={article}
          relatedArticles={relatedArticles}
          baseUrl={baseUrl}
        />
      </div>
    </div>
  );
}
