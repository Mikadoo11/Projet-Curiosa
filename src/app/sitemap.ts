import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getDomains, getPublishedArticles } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.SITE_URL.replace(/\/$/, "");
  const [domains, articles] = await Promise.all([getDomains(), getPublishedArticles()]);
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/bibliotheque`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/recherche`, changeFrequency: "weekly", priority: 0.5 },
    ...domains.map((domain) => ({ url: `${base}/bibliotheque/${domain.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...articles.map((article) => ({ url: `${base}/bibliotheque/${article.domain.slug}/${article.slug}`, lastModified: article.updatedAt ?? article.publishedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
