import type { Metadata } from "next";
import { LibraryExplorer } from "@/components/articles/library-explorer";
import { PageHeading } from "@/components/layout/page-heading";
import { getDomains, getPublishedArticles } from "@/lib/content";

export const metadata: Metadata = { title: "Recherche", description: "Retrouve une fiche de culture générale dans la bibliothèque Curiosa." };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [domains, articles] = await Promise.all([getDomains(), getPublishedArticles()]);
  return <section className="page-shell content-page"><PageHeading eyebrow="UNE IDÉE EN TÊTE ?" title="Trouver une réponse." description="Recherche un sujet, un concept ou quelques mots-clés dans la bibliothèque." /><LibraryExplorer articles={articles} domains={domains} initialQuery={q} /></section>;
}
