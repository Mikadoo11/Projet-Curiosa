import "server-only";
import { z } from "zod";

const optionalNonEmptyString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const environmentSchema = z.object({
  SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_SANITY_PROJECT_ID: optionalNonEmptyString,
  NEXT_PUBLIC_SANITY_DATASET: z.string().trim().min(1).default("production"),
  SANITY_API_READ_TOKEN: optionalNonEmptyString,
  SANITY_API_WRITE_TOKEN: optionalNonEmptyString,
  GEMINI_API_KEY: optionalNonEmptyString,
  GEMINI_PRIMARY_MODEL: z.string().trim().min(1).default("gemini-3.8-flash"),
  GEMINI_FALLBACK_MODEL: z.string().trim().min(1).default("gemini-3.5-flash-lite"),
  GENERATION_ENABLED: z.enum(["true", "false"]).default("false"),
  GENERATION_DAILY_TARGET: z.coerce.number().int().min(1).max(5).default(5),
  CRON_SECRET: optionalNonEmptyString,
});

const parsed = environmentSchema.safeParse(process.env);
if (!parsed.success) {
  const summary = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(`Configuration d'environnement invalide:\n${summary}`);
}

export const env = parsed.data;
export const hasSanityConfig = Boolean(env.NEXT_PUBLIC_SANITY_PROJECT_ID);
