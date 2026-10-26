import "server-only";
import { demoArticles, demoDomains } from "@/lib/demo-content";
import { env } from "@/lib/env";
import { generateDraftWithModel, buildArticlePrompt, GeminiQuotaExceededError } from "@/lib/generation/gemini";
import type { ArticleDraft } from "@/lib/generation/article-draft";
import { validateSourceLinks } from "@/lib/generation/sources";
import { normalizeSlug } from "@/lib/validation/slug";
import { getSanityWriteClient } from "@/lib/sanity/write-client";

type SanityDomain = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
};

type ExistingArticle = { title: string; slug: string; domainSlug: string };

const SEED_ARTICLES = true;

async function ensureDomains(client: ReturnType<typeof getSanityWriteClient>): Promise<SanityDomain[]> {
  const existing = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "domain"]{_id, "slug": slug.current}`,
  );
  const existingSlugs = new Set(existing.map((domain) => domain.slug));

  for (const [index, domain] of demoDomains.entries()) {
    if (existingSlugs.has(domain.slug)) continue;
    await client.createIfNotExists({
      _id: `domain-${domain.slug}`,
      _type: "domain",
      title: domain.title,
      slug: { _type: "slug", current: domain.slug },
      description: domain.description,
      icon: domain.icon,
      color: domain.color,
      order: index + 1,
    });
  }

  return client.fetch<SanityDomain[]>(`*[_type == "domain"] | order(title asc) {
    _id, title, "slug": slug.current, description, icon, color,
    "articleCount": count(*[_type == "article" && status == "published" && references(^._id)])
  }`);
}

async function seedDemoArticles(
  client: ReturnType<typeof getSanityWriteClient>,
  domains: SanityDomain[],
): Promise<number> {
  if (!SEED_ARTICLES) return 0;
  let seeded = 0;
  const domainBySlug = new Map(domains.map((domain) => [domain.slug, domain]));

  for (const article of demoArticles) {
    const domain = domainBySlug.get(article.domain.slug);
    if (!domain) continue;
    const exists = await client.fetch<{ _id: string } | null>(
      `*[_type == "article" && domain->slug.current == $domainSlug && slug.current == $slug][0]{_id}`,
      { domainSlug: article.domain.slug, slug: article.slug },
    );
    if (exists) continue;

    const document = {
      _id: article._id,
      _type: "article",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      excerpt: article.excerpt,
      domain: { _type: "reference", _ref: domain._id },
      readingMinutes: article.readingMinutes,
      status: "published",
      publishedAt: article.publishedAt || new Date().toISOString(),
      updatedAt: article.updatedAt,
      tags: article.tags ?? [],
      sections: article.sections,
      keyTakeaways: article.keyTakeaways,
      funFact: article.funFact,
      sources: article.sources,
    };

    await client.createIfNotExists(document);
    seeded += 1;
  }
  return seeded;
}

function createArticleDocument(args: {
  draft: ArticleDraft;
  domain: SanityDomain;
  model: string;
  sourceWarnings: string[];
  now: string;
}) {
  const { draft, domain, model, sourceWarnings, now } = args;
  const slug = normalizeSlug(draft.title).slice(0, 90).replace(/-+$/, "");
  const verificationSummary = [
    `Contrôles automatiques réussis : schéma, titre/slug non dupliqués, liens HTTPS et domaines sources autorisés. Modèle : ${model}.`,
    "Limite : ces contrôles ne vérifient pas indépendamment chaque affirmation factuelle.",
    ...sourceWarnings.slice(0, 3),
  ].join(" ");

  return {
    _id: `article-${domain.slug}-${slug}`,
    _type: "article",
    title: draft.title,
    slug: { _type: "slug", current: slug },
    excerpt: draft.excerpt,
    domain: { _type: "reference", _ref: domain._id },
    readingMinutes: draft.readingMinutes,
    status: "published",
    publishedAt: now,
    updatedAt: now,
    tags: draft.tags,
    sections: draft.sections,
    keyTakeaways: draft.keyTakeaways,
    funFact: draft.funFact ?? undefined,
    sources: draft.sources,
    generationId: `${domain.slug}-${slug}-${now.slice(0, 10)}`,
    generatedAt: now,
    qualityScore: sourceWarnings.length === 0 ? 80 : 70,
    verificationSummary,
  };
}

export type DailyGenerationSummary = {
  status: "completed" | "partial" | "quota-paused";
  attempted: number;
  published: number;
  skipped: number;
  demoSeeded: number;
  primaryModel: string;
  fallbackModel: string;
  modelUsed: string[];
  messages: string[];
};

export async function runDailyGeneration(targetOverride?: number): Promise<DailyGenerationSummary> {
  if (!env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY n'est pas configurée.");
  const client = getSanityWriteClient();
  const messages: string[] = [];
  const modelUsed: string[] = [];
  let attempted = 0;
  let published = 0;
  let skipped = 0;
  let primaryAvailable = true;
  let quotaPaused = false;

  let domains = await ensureDomains(client);
  const demoSeeded = await seedDemoArticles(client, domains);
  if (demoSeeded > 0) messages.push(`${demoSeeded} fiches de démonstration transférées dans la bibliothèque permanente.`);
  domains = await ensureDomains(client);

  const existingArticles = await client.fetch<ExistingArticle[]>(`*[_type == "article" && status == "published"] | order(publishedAt desc)[0...250] {
    title, "slug": slug.current, "domainSlug": domain->slug.current
  }`);
  const knownTitles = new Set(existingArticles.map((article) => article.title.toLocaleLowerCase("fr-FR")));
  const knownSlugs = new Set(existingArticles.map((article) => `${article.domainSlug}/${article.slug}`));
  const localCounts = new Map(domains.map((domain) => [domain.slug, domain.articleCount]));
  const target = targetOverride ?? env.GENERATION_DAILY_TARGET;
  const maxAttempts = target;

  for (let index = 0; index < maxAttempts; index += 1) {
    const domain = [...domains].sort((a, b) =>
      (localCounts.get(a.slug) ?? 0) - (localCounts.get(b.slug) ?? 0) || a.title.localeCompare(b.title, "fr"),
    )[0];
    if (!domain) break;

    const recentTitles = [...knownTitles].slice(-120);
    const prompt = buildArticlePrompt({
      domainTitle: domain.title,
      domainSlug: domain.slug,
      domainDescription: domain.description,
      existingTitles: recentTitles,
      articleIndex: index + 1,
    });
    attempted += 1;

    let draft: ArticleDraft;
    let model: string;
    try {
      if (primaryAvailable) {
        try {
          const generated = await generateDraftWithModel(prompt, env.GEMINI_PRIMARY_MODEL);
          draft = generated.draft;
          model = generated.model;
        } catch (error) {
          if (!(error instanceof GeminiQuotaExceededError)) throw error;
          primaryAvailable = false;
          messages.push(`Quota ${env.GEMINI_PRIMARY_MODEL} atteint ; bascule vers ${env.GEMINI_FALLBACK_MODEL}.`);
          const generated = await generateDraftWithModel(prompt, env.GEMINI_FALLBACK_MODEL);
          draft = generated.draft;
          model = generated.model;
        }
      } else {
        const generated = await generateDraftWithModel(prompt, env.GEMINI_FALLBACK_MODEL);
        draft = generated.draft;
        model = generated.model;
      }
    } catch (error) {
      if (error instanceof GeminiQuotaExceededError) {
        quotaPaused = true;
        messages.push(`${error.message} La génération s'arrête sans appeler de modèle payant.`);
        break;
      }
      messages.push(`Génération interrompue à la fiche ${index + 1} : ${error instanceof Error ? error.message : "erreur inconnue"}.`);
      break;
    }

    modelUsed.push(model);
    const slug = normalizeSlug(draft.title).slice(0, 90).replace(/-+$/, "");
    const titleKey = draft.title.toLocaleLowerCase("fr-FR");
    if (!slug || knownTitles.has(titleKey) || knownSlugs.has(`${domain.slug}/${slug}`)) {
      skipped += 1;
      messages.push(`Doublon ignoré dans le domaine ${domain.title} : ${draft.title}.`);
      continue;
    }

    let sourceWarnings: string[];
    try {
      sourceWarnings = await validateSourceLinks(draft);
    } catch (error) {
      skipped += 1;
      messages.push(`Fiche non publiée (${draft.title}) : ${error instanceof Error ? error.message : "source invalide"}.`);
      continue;
    }

    const now = new Date().toISOString();
    const document = createArticleDocument({ draft, domain, model, sourceWarnings, now });
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "article" && status == "published" && domain->slug.current == $domainSlug && (slug.current == $slug || title == $title)][0]{_id}`,
      { domainSlug: domain.slug, slug, title: draft.title },
    );
    if (existing) {
      skipped += 1;
      knownTitles.add(titleKey);
      knownSlugs.add(`${domain.slug}/${slug}`);
      messages.push(`Fiche déjà présente, non dupliquée : ${draft.title}.`);
      continue;
    }

    await client.createIfNotExists(document);
    published += 1;
    knownTitles.add(titleKey);
    knownSlugs.add(`${domain.slug}/${slug}`);
    localCounts.set(domain.slug, (localCounts.get(domain.slug) ?? 0) + 1);
  }

  const status: DailyGenerationSummary["status"] = quotaPaused
    ? "quota-paused"
    : published === target && skipped === 0
      ? "completed"
      : "partial";

  const summary: DailyGenerationSummary = {
    status,
    attempted,
    published,
    skipped,
    demoSeeded,
    primaryModel: env.GEMINI_PRIMARY_MODEL,
    fallbackModel: env.GEMINI_FALLBACK_MODEL,
    modelUsed: [...new Set(modelUsed)],
    messages,
  };
  console.info("[Curiosa daily generation]", JSON.stringify(summary));
  return summary;
}
