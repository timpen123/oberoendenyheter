import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

const staticRoutes = [
  "",
  "/nyheter",
  "/sport",
  "/ekonomi",
  "/kontakt",
  "/om-oss",
  "/integritetspolicy",
  "/cookiepolicy",
  "/cookie-installningar",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
  }));
}
