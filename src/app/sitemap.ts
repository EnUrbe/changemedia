import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();
  const routes = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/why`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
  ];
  return routes;
}
