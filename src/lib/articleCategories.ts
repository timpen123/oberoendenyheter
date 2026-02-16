export const ARTICLE_CATEGORIES = [
  "Nyheter",
  "Sport",
  "Ekonomi",
  "Vetenskap",
  "Nöje",
  "Kultur",
  "Övrigt",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];
