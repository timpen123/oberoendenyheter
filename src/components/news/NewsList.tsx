"use client";

import { NewsCard } from "./NewsCard";
import { AdBanner } from "@/components/ads/AdBanner";
import { useArticles } from "@/hooks/useArticles";

const DEFAULT_LIMIT = 50;

export function NewsList() {
  const { data, error, isLoading } = useArticles({ limit: DEFAULT_LIMIT });

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Laddar nyheter…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        {error}
      </div>
    );
  }

  if (!data || data.articles.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Inga nyheter än. Kom tillbaka senare.
      </div>
    );
  }

  const items: React.ReactNode[] = [];
  data.articles.forEach((article, i) => {
    const variant = i % 5 === 0 ? "featured" : "medium";
    items.push(
      <NewsCard key={article.id} article={article} variant={variant} />
    );
    if ((i + 1) % 5 === 0 && i < data.articles.length - 1) {
      items.push(<AdBanner key={`ad-${i}`} variant="horizontal" />);
    }
  });

  return <div className="flex flex-col gap-4">{items}</div>;
}
