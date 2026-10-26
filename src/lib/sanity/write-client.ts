import "server-only";
import { createClient } from "next-sanity";
import { env, hasSanityConfig } from "@/lib/env";

/** A write-capable Sanity client. Keep its token server-side only. */
export function getSanityWriteClient() {
  if (!hasSanityConfig || !env.SANITY_API_WRITE_TOKEN) {
    throw new Error("Sanity n'est pas configuré pour l'écriture. Vérifie le Project ID et SANITY_API_WRITE_TOKEN.");
  }

  return createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2026-10-14",
    useCdn: false,
    token: env.SANITY_API_WRITE_TOKEN,
  });
}
