import "server-only";
import { env } from "@/lib/env";
import { articleDraftSchema, type ArticleDraft } from "@/lib/generation/article-draft";

export class GeminiQuotaExceededError extends Error {
  constructor(model: string) {
    super(`Le quota du modèle ${model} est atteint.`);
    this.name = "GeminiQuotaExceededError";
  }
}

export class GeminiRequestError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "GeminiRequestError";
  }
}

export type GeminiGeneration = { draft: ArticleDraft; model: string };

type GeminiApiError = {
  error?: { message?: string; status?: string; code?: number };
};

type GeminiApiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
  promptFeedback?: { blockReason?: string };
};

const SYSTEM_INSTRUCTIONS = `Tu es une rédactrice ou un rédacteur pédagogique pour une plateforme française de culture générale.
Écris des fiches accessibles, nuancées, précises et originales. Ne fabrique jamais de citation, de statistique précise ni de référence. Si une information est incertaine ou débattue, explique les limites au lieu de l'affirmer comme un fait établi.
Réponds exclusivement avec un objet JSON conforme à la structure demandée, sans Markdown ni texte autour.
N'utilise pas de conseils médicaux, juridiques ou financiers personnalisés. Évite les sujets très récents qui nécessiteraient une actualisation quotidienne.
Les sources doivent être des pages HTTPS de domaines reconnus (NASA, ESA, NOAA, USGS, NIST, NIH/NCBI, APA, UNESCO, Britannica, National Geographic, Smithsonian, Library of Congress, British Library, IUCN, OECD, World Bank, Met Museum, WHO, Our World in Data ou IPCC). Choisis des pages pertinentes au sujet et n'invente pas de chemin d'URL si tu n'en es pas sûr ; utilise alors une page institutionnelle stable et décris précisément son éditeur.
Les contrôles automatiques vérifieront la forme des fiches et les domaines des sources, mais ne peuvent pas confirmer automatiquement toutes les affirmations du texte. La rédaction doit donc rester prudente et signaler les nuances importantes.`;

function isQuotaFailure(status: number, payload: GeminiApiError): boolean {
  const apiStatus = payload.error?.status?.toUpperCase() ?? "";
  const message = payload.error?.message?.toLowerCase() ?? "";
  return status === 429 || apiStatus === "RESOURCE_EXHAUSTED" || message.includes("quota") || message.includes("rate limit");
}

export async function generateDraftWithModel(prompt: string, model: string): Promise<GeminiGeneration> {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY n'est pas configurée.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
        maxOutputTokens: 6_000,
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as GeminiApiResponse & GeminiApiError;
  if (!response.ok) {
    if (isQuotaFailure(response.status, payload)) throw new GeminiQuotaExceededError(model);
    throw new GeminiRequestError(`Échec de Gemini (${response.status}) : ${payload.error?.message ?? "réponse inconnue"}`, response.status);
  }

  if (payload.promptFeedback?.blockReason) {
    throw new GeminiRequestError(`La demande a été bloquée par le modèle (${payload.promptFeedback.blockReason}).`);
  }

  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) throw new GeminiRequestError("Gemini n'a renvoyé aucun contenu exploitable.");

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch {
    throw new GeminiRequestError("Gemini a renvoyé un résultat qui n'est pas un JSON valide.");
  }

  const result = articleDraftSchema.safeParse(parsedJson);
  if (!result.success) {
    const details = result.error.issues.slice(0, 4).map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new GeminiRequestError(`La fiche générée ne respecte pas le format attendu : ${details}`);
  }

  return { draft: result.data, model };
}

export function buildArticlePrompt(args: {
  domainTitle: string;
  domainSlug: string;
  domainDescription: string;
  existingTitles: string[];
  articleIndex: number;
}): string {
  const previousTitles = args.existingTitles.length > 0
    ? args.existingTitles.map((title) => `- ${title}`).join("\n")
    : "Aucun titre publié à ce stade.";

  return `Crée une nouvelle fiche en français pour le domaine « ${args.domainTitle} » (slug ${args.domainSlug}).
Description du domaine : ${args.domainDescription}
Numéro de génération dans cette exécution : ${args.articleIndex}.

Évite absolument ces titres et les sujets qui leur sont trop proches :
${previousTitles}

Critères de rédaction :
- Le public est composé de particuliers curieux, sans prérequis spécialisé.
- Titre clair, spécifique et non sensationnaliste (8 à 100 caractères).
- Résumé de 40 à 420 caractères, expliquant ce que le lecteur va apprendre.
- 3 à 6 sections avec un titre et un développement utile (au moins 80 caractères par section).
- 3 à 5 idées à retenir, formulées en phrases compréhensibles.
- 2 à 4 sources distinctes de domaines institutionnels ou de référence figurant dans les consignes système ; les sources doivent être pertinentes au sujet.
- Pas de fausse citation, de fausse date, de fausse URL, ni de promesse de certitude sur un sujet débattu.
- Réponds avec ces clés JSON exactes : title, excerpt, readingMinutes, tags, sections (array d'objets heading/body), keyTakeaways, funFact (texte ou null), sources (array d'objets title/url/publisher).
Ne renvoie pas de slug : il sera calculé par le serveur. N'ajoute aucun autre champ.`;
}
