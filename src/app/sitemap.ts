import type { MetadataRoute } from "next";
import { FIELD_NOTES, SITE } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/studios`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/portraits`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/field-notes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = FIELD_NOTES.map((post) => ({
    url: `${base}/field-notes/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  return [...staticRoutes, ...articleRoutes];
}
