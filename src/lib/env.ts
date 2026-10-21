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
  OPENAI_API_KEY: optionalNonEmptyString,
  OPENAI_MODEL: z.string().trim().min(1).default("gpt-5-mini"),
  TRIGGER_SECRET_KEY: optionalNonEmptyString,
  CRON_SECRET: optionalNonEmptyString,
});

const parsed = environmentSchema.safeParse(process.env);
if (!parsed.success) {
  const summary = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(`Configuration d'environnement invalide:\n${summary}`);
}

export const env = parsed.data;
export const hasSanityConfig = Boolean(env.NEXT_PUBLIC_SANITY_PROJECT_ID);
