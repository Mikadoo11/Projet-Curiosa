import { env } from "@/lib/env";
import { runDailyGeneration } from "@/lib/generation/run-daily-generation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  const expectedSecret = env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!expectedSecret || authorization !== `Bearer ${expectedSecret}`) {
    return Response.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }

  if (env.GENERATION_ENABLED !== "true") {
    return Response.json({ ok: false, error: "La génération automatique est désactivée." }, { status: 409 });
  }

  if (!env.GEMINI_API_KEY || !env.NEXT_PUBLIC_SANITY_PROJECT_ID || !env.SANITY_API_WRITE_TOKEN) {
    return Response.json({ ok: false, error: "Configuration Gemini/Sanity incomplète." }, { status: 503 });
  }

  // Normal Vercel cron calls use the configured target (5 max). An explicit
  // count is allowed only after the CRON_SECRET check, for initial stock fill.
  const countParam = new URL(request.url).searchParams.get("count");
  let targetOverride: number | undefined;
  if (countParam !== null) {
    const parsedCount = Number(countParam);
    if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 10) {
      return Response.json({ ok: false, error: "count doit être un entier compris entre 1 et 10." }, { status: 400 });
    }
    targetOverride = parsedCount;
  }

  try {
    const summary = await runDailyGeneration(targetOverride);
    return Response.json({ ok: true, summary }, { status: 200 });
  } catch (error) {
    console.error("[Curiosa daily generation] Échec", error);
    return Response.json(
      { ok: false, error: "La génération a échoué. Consulte les journaux du déploiement pour le détail." },
      { status: 500 },
    );
  }
}
