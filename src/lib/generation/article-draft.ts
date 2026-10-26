import { z } from "zod";

/** Shape returned by Gemini before an article is saved in Sanity. */
export const articleDraftSchema = z.object({
  title: z.string().trim().min(8).max(100),
  excerpt: z.string().trim().min(40).max(420),
  readingMinutes: z.number().int().min(2).max(15),
  tags: z.array(z.string().trim().min(1).max(35)).min(2).max(12),
  sections: z.array(z.object({
    heading: z.string().trim().min(3).max(120),
    body: z.string().trim().min(80).max(6000),
  })).min(3).max(8),
  keyTakeaways: z.array(z.string().trim().min(15).max(260)).min(3).max(5),
  funFact: z.string().trim().max(700).nullable().optional(),
  sources: z.array(z.object({
    title: z.string().trim().min(5).max(180),
    url: z.url(),
    publisher: z.string().trim().min(2).max(120),
  })).min(2).max(4),
}).strict();

export type ArticleDraft = z.infer<typeof articleDraftSchema>;
