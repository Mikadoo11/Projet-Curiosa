import "server-only";
import type { ArticleDraft } from "@/lib/generation/article-draft";

/** Only allow educational, scientific, or established reference publishers. */
const TRUSTED_HOSTS = [
  "nasa.gov",
  "esa.int",
  "noaa.gov",
  "usgs.gov",
  "nist.gov",
  "nih.gov",
  "ncbi.nlm.nih.gov",
  "apa.org",
  "unesco.org",
  "britannica.com",
  "nationalgeographic.org",
  "nationalgeographic.com",
  "si.edu",
  "loc.gov",
  "bl.uk",
  "iucn.org",
  "oecd.org",
  "worldbank.org",
  "metmuseum.org",
  "history.state.gov",
  "ourworldindata.org",
  "ipcc.ch",
  "who.int",
];

function isTrustedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return TRUSTED_HOSTS.some((trusted) => host === trusted || host.endsWith(`.${trusted}`));
}

/**
 * Performs conservative structural checks, not a semantic fact-check.
 * URLs are restricted to HTTPS and known publishers; a HEAD request catches
 * links that definitively return 404/410. Some publishers block HEAD requests,
 * so 401/403/405 responses are treated as inconclusive rather than proof of a
 * broken page.
 */
export async function validateSourceLinks(draft: ArticleDraft): Promise<string[]> {
  const warnings: string[] = [];
  const normalizedUrls = new Set<string>();
  const parsedUrls: Array<{ sourceTitle: string; url: URL }> = [];

  for (const source of draft.sources) {
    let parsed: URL;
    try {
      parsed = new URL(source.url);
    } catch {
      throw new Error(`URL de source invalide : ${source.url}`);
    }

    if (parsed.protocol !== "https:") {
      throw new Error(`La source « ${source.title} » doit utiliser HTTPS.`);
    }
    if (!isTrustedHost(parsed.hostname)) {
      throw new Error(`Domaine de source non autorisé : ${parsed.hostname}`);
    }

    const normalized = `${parsed.origin}${parsed.pathname}`.replace(/\/$/, "");
    if (normalizedUrls.has(normalized)) {
      throw new Error("Les sources doivent être distinctes.");
    }
    normalizedUrls.add(normalized);
    parsedUrls.push({ sourceTitle: source.title, url: parsed });
  }

  const checked = await Promise.all(parsedUrls.map(async ({ sourceTitle, url }) => {
    try {
      const response = await fetch(url.toString(), {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(5_000),
        headers: { "user-agent": "CuriosaSourceLinkCheck/1.0" },
      });
      if (response.status === 404 || response.status === 410) {
        return { broken: `Lien de source introuvable (${response.status}) : ${url.toString()}` };
      }
      if (response.status === 401 || response.status === 403 || response.status === 405 || response.status >= 500) {
        return { warning: `Disponibilité non confirmée pour ${url.toString()} (HTTP ${response.status}).` };
      }
      return {};
    } catch {
      return { warning: `Vérification de disponibilité impossible pour ${url.toString()} (${sourceTitle}).` };
    }
  }));

  const brokenLink = checked.find((result) => result.broken)?.broken;
  if (brokenLink) throw new Error(brokenLink);
  warnings.push(...checked.flatMap((result) => result.warning ? [result.warning] : []));
  return warnings;
}
