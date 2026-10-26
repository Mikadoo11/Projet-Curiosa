import "server-only";
import { demoArticles, demoDomains } from "@/lib/demo-content";
import type { Article, Domain } from "@/lib/content-types";
import { sanityClient } from "@/lib/sanity/client";
import {
  ARTICLE_BY_SLUG_QUERY,
  DOMAINS_QUERY,
  PUBLISHED_ARTICLES_QUERY,
} from "@/lib/sanity/queries";

/**
 * During initial setup, Sanity may be configured but still contain no documents.
 * In that case, keep the public site usable with bundled demo content.
 * Once Sanity contains published documents, its content takes precedence.
 */
export async function getDomains(): Promise<Domain[]> {
  if (!sanityClient) return demoDomains;

  try {
    const domains = await sanityClient.fetch<Domain[]>(DOMAINS_QUERY);
    return Array.isArray(domains) && domains.length > 0 ? domains : demoDomains;
  } catch (error) {
    console.error("[Curiosa] Impossible de charger les domaines Sanity; utilisation du contenu de démonstration.", error);
    return demoDomains;
  }
}

export async function getPublishedArticles(): Promise<Article[]> {
  if (!sanityClient) return demoArticles;

  try {
    const articles = await sanityClient.fetch<Article[]>(PUBLISHED_ARTICLES_QUERY);
    return Array.isArray(articles) && articles.length > 0 ? articles : demoArticles;
  } catch (error) {
    console.error("[Curiosa] Impossible de charger les fiches Sanity; utilisation du contenu de démonstration.", error);
    return demoArticles;
  }
}

export async function getArticlesByDomain(domainSlug: string): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.domain.slug === domainSlug);
}

export async function getArticleBySlug(
  domainSlug: string,
  articleSlug: string,
): Promise<Article | undefined> {
  const demoArticle = demoArticles.find(
    (article) => article.domain.slug === domainSlug && article.slug === articleSlug,
  );

  if (!sanityClient) return demoArticle;

  try {
    const article = await sanityClient.fetch<Article | null>(ARTICLE_BY_SLUG_QUERY, {
      domainSlug,
      articleSlug,
    });
    return article ?? demoArticle;
  } catch (error) {
    console.error("[Curiosa] Impossible de charger la fiche Sanity; utilisation du contenu de démonstration.", error);
    return demoArticle;
  }
}

export async function getDomainBySlug(domainSlug: string): Promise<Domain | undefined> {
  const domains = await getDomains();
  return domains.find((domain) => domain.slug === domainSlug);
}
