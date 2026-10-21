import type { Metadata } from "next";
import { LibraryExplorer } from "@/components/articles/library-explorer";
import { PageHeading } from "@/components/layout/page-heading";
import { getDomains, getPublishedArticles } from "@/lib/content";

export const metadata: Metadata = { title: "La bibliothèque", description: "Toutes les fiches de culture générale, classées par domaine et faciles à retrouver." };

export default async function LibraryPage() {
  const [domains, articles] = await Promise.all([getDomains(), getPublishedArticles()]);
  return <section className="page-shell content-page"><PageHeading eyebrow="TA BIBLIOTHÈQUE DE CONNAISSANCES" title="Explorer la bibliothèque." description="Toutes les fiches au même endroit. Choisis un domaine, cherche une idée ou laisse-toi guider par ta curiosité." /><LibraryExplorer articles={articles} domains={domains} /></section>;
}
