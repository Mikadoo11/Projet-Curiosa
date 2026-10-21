import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { DomainSymbol } from "@/components/domains/domain-symbol";
import { getArticlesByDomain, getDomainBySlug, getDomains } from "@/lib/content";

export async function generateStaticParams() {
  const domains = await getDomains();
  return domains.map((domain) => ({ domainSlug: domain.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ domainSlug: string }> }): Promise<Metadata> {
  const { domainSlug } = await params;
  const domain = await getDomainBySlug(domainSlug);
  return domain ? { title: domain.title, description: domain.description } : {};
}

export default async function DomainPage({ params }: { params: Promise<{ domainSlug: string }> }) {
  const { domainSlug } = await params;
  const [domain, articles] = await Promise.all([getDomainBySlug(domainSlug), getArticlesByDomain(domainSlug)]);
  if (!domain) notFound();
  return <section className="page-shell content-page">
    <Link className="back-link" href="/bibliotheque"><ArrowLeft size={16} /> Retour à la bibliothèque</Link>
    <div className={`domain-hero tone-${domain.color}`}><span className="domain-hero__icon"><DomainSymbol name={domain.icon} size={31} /></span><p className="eyebrow">UN DOMAINE À EXPLORER</p><h1>{domain.title}</h1><p>{domain.description}</p><span className="domain-hero__count">{articles.length} fiches disponibles</span></div>
    <div className="section-heading section-heading--compact"><div><p className="eyebrow">À TON RYTHME</p><h2>Les fiches du domaine.</h2></div><Link className="text-link" href="/bibliotheque">Tous les domaines <ArrowRight size={16} /></Link></div>
    {articles.length ? <div className="article-grid">{articles.map((article) => <ArticleCard key={article._id} article={article} />)}</div> : <div className="empty-state"><h2>Les prochaines découvertes arrivent ici.</h2><p>Ce domaine ne contient pas encore de fiche publiée.</p></div>}
  </section>;
}
