"use client";

import { useEffect, useState } from "react";
import { NewsCard } from "./NewsCard";
import { AdBanner } from "@/components/ads/AdBanner";
import type { Article } from "@/lib/types";

interface NewsListResult {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

export function NewsList() {
  const [data, setData] = useState<NewsListResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site/articles?limit=50")
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta nyheter");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
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
    const position = i % 7;
    const variant = position === 0 ? "featured" : "medium";
    items.push(
      <NewsCard key={article.id} article={article} variant={variant} />
    );
    if ((i + 1) % 5 === 0 && i < data.articles.length - 1) {
      items.push(<AdBanner key={`ad-${i}`} variant="horizontal" />);
    }
  });

  return <div className="flex flex-col gap-4">{items}</div>;
}
