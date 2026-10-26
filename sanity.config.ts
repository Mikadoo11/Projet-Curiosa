'use client';

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { articleSchema } from "./sanity/schemas/article";
import { domainSchema } from "./sanity/schemas/domain";

export default defineConfig({
  name: "curiosa",
  title: "Curiosa",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "abcdefgh",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: [domainSchema, articleSchema] },
});
