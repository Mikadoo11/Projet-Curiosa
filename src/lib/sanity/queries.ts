import { defineQuery } from "next-sanity";

export const DOMAINS_QUERY = defineQuery(`*[_type == "domain"] | order(title asc) {
  _id, title, "slug": slug.current, description, icon, color,
  "articleCount": count(*[_type == "article" && status == "published" && references(^._id)])
}`);

export const PUBLISHED_ARTICLES_QUERY = defineQuery(`*[_type == "article" && status == "published"] | order(publishedAt desc) {
  _id, title, "slug": slug.current, excerpt, readingMinutes, publishedAt, updatedAt, tags,
  "domain": domain->{ title, "slug": slug.current, icon, color },
  sections[]{ heading, body }, keyTakeaways, funFact,
  sources[]{ title, url, publisher }
}`);

export const ARTICLE_BY_SLUG_QUERY = defineQuery(`*[_type == "article" && status == "published" && slug.current == $articleSlug && domain->slug.current == $domainSlug][0] {
  _id, title, "slug": slug.current, excerpt, readingMinutes, publishedAt, updatedAt, tags,
  "domain": domain->{ title, "slug": slug.current, icon, color },
  sections[]{ heading, body }, keyTakeaways, funFact,
  sources[]{ title, url, publisher }
}`);
