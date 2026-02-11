"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { Article } from "@/lib/types";
import { formatArticleDate } from "@/lib/formatDate";

interface NewsCardProps {
  article: Article;
  variant?: "hero" | "large" | "medium" | "small" | "featured";
}

export function NewsCard({ article, variant = "medium" }: NewsCardProps) {
  const date = formatArticleDate(article.published_at ?? article.created_at);

  if (variant === "featured") {
    return (
      <article className="group cursor-pointer overflow-hidden rounded-lg bg-card transition-shadow hover:shadow-xl">
        <Link href={`/nyheter/${article.slug}`} className="block">
          <div className="relative aspect-[21/9] overflow-hidden">
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute left-4 top-4">
              <span className="rounded bg-primary px-3 py-1.5 text-xs uppercase tracking-wide text-primary-foreground">
                {article.category}
              </span>
            </div>
          </div>
          <div className="p-6">
            <h2 className="mb-3 line-clamp-2 text-2xl transition-colors group-hover:text-primary">
              {article.title}
            </h2>
            <p className="mb-4 line-clamp-2 text-muted-foreground">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{date}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group cursor-pointer rounded-lg bg-card p-4 transition-shadow hover:shadow-lg">
      <Link href={`/nyheter/${article.slug}`} className="flex gap-4">
        <div className="min-w-0 flex-1">
          <span className="mb-2 block text-xs uppercase tracking-wide text-primary">
            {article.category}
          </span>
          <h3 className="mb-2 line-clamp-2 text-base transition-colors group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
            {article.excerpt}
          </p>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded">
          <ImageWithFallback
            src={article.image}
            alt={article.title}
            fill
            sizes="128px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
    </article>
  );
}
