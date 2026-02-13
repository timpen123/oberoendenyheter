import type { Article } from "./types";

/** Plockar första img src från HTML (full URL). Returnerar "" om ingen hittas. */
function firstImageUrlFromHtml(html: string): string {
  const match = html.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
  return match?.[1]?.trim() ?? "";
}

/**
 * Bild-URL att visa för en artikel.
 * Använder article.image om satt, annars första <img src="..."> i body.
 */
export function getArticleDisplayImage(article: Article): string {
  if (article.image?.trim()) return article.image.trim();
  return firstImageUrlFromHtml(article.body ?? "");
}
