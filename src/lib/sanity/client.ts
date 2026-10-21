import "server-only";
import { createClient } from "next-sanity";
import { env, hasSanityConfig } from "@/lib/env";

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: "2026-10-14",
      useCdn: true,
      ...(env.SANITY_API_READ_TOKEN ? { token: env.SANITY_API_READ_TOKEN } : {}),
    })
  : null;
