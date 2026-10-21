import "server-only";
import { demoArticles, demoDomains } from "@/lib/demo-content";
import type { Article, Domain } from "@/lib/content-types";
import { sanityClient } from "@/lib/sanity/client";
import { ARTICLE_BY_SLUG_QUERY, DOMAINS_QUERY, PUBLISHED_ARTICLES_QUERY } from "@/lib/sanity/queries";

export async function getDomains(): Promise<Domain[]> {
  if (!sanityClient) return demoDomains;
  return (await sanityClient.fetch<Domain[]>(DOMAINS_QUERY)) ?? [];
}

export async function getPublishedArticles(): Promise<Article[]> {
  if (!sanityClient) return demoArticles;
  return (await sanityClient.fetch<Article[]>(PUBLISHED_ARTICLES_QUERY)) ?? [];
}

export async function getArticlesByDomain(domainSlug: string): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.domain.slug === domainSlug);
}

export async function getArticleBySlug(domainSlug: string, articleSlug: string): Promise<Article | undefined> {
  if (!sanityClient) {
    return demoArticles.find((article) => article.domain.slug === domainSlug && article.slug === articleSlug);
  }
  const article = await sanityClient.fetch<Article | null>(ARTICLE_BY_SLUG_QUERY, { domainSlug, articleSlug });
  return article ?? undefined;
}

export async function getDomainBySlug(domainSlug: string): Promise<Domain | undefined> {
  const domains = await getDomains();
  return domains.find((domain) => domain.slug === domainSlug);
}
