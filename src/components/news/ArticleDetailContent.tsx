import Link from "next/link";
import { Clock } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { NewsCard } from "./NewsCard";
import { ArticleShare } from "./ArticleShare";
import type { Article } from "@/lib/types";
import { getArticleDisplayImage } from "@/lib/articleUtils";
import { formatArticleDate } from "@/lib/formatDate";

interface ArticleDetailContentProps {
  article: Article;
  relatedArticles: Article[];
  baseUrl?: string;
}

export function ArticleDetailContent({ article, relatedArticles, baseUrl }: ArticleDetailContentProps) {
  const date = formatArticleDate(article.published_at ?? article.created_at);
  const articleUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/nyheter/${article.slug}` : undefined;
  const imageUrl = getArticleDisplayImage(article);

  return (
    <article className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-card shadow-2xl">
      <div className="relative aspect-video w-full">
        <ImageWithFallback
          src={imageUrl}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      <div className="px-6 pb-6 pt-8 sm:px-10">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          {article.category}
        </span>
        <h1 className="mt-4 mb-4 text-3xl leading-tight sm:text-4xl">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
          <span>Av Redaktionen</span>
          <span>•</span>
          <span>Publicerad: {date}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {article.readTime}
          </span>
        </div>
      </div>

      <div className="px-6 sm:px-10 pb-8">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl rounded-lg bg-muted p-8">
            <p className="mb-3 text-center text-xs text-muted-foreground">ANNONS</p>
            <div className="flex h-64 w-full items-center justify-center rounded border-2 border-dashed border-border">
              <span className="text-sm text-muted-foreground">Annonsyta 468x280</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-10 pb-10">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {article.excerpt && (
            <p className="mb-6 text-lg leading-relaxed text-foreground">
              {article.excerpt}
            </p>
          )}
          {article.body && (
            <div
              className="text-muted-foreground [&_p]:mb-5 [&_p]:leading-relaxed [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          )}
        </div>

        <ArticleShare url={articleUrl} title={article.title} />
      </div>

      {relatedArticles.length > 0 && (
        <div className="border-t border-border bg-muted/50 px-6 py-10 sm:px-10">
          <h2 className="mb-6 text-2xl">Relaterade nyheter</h2>
          <div className="space-y-4">
            {relatedArticles.slice(0, 4).map((related) => (
              <NewsCard key={related.id} article={related} variant="medium" />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
