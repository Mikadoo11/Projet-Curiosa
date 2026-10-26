import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, ExternalLink, Lightbulb } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { DomainSymbol } from "@/components/domains/domain-symbol";
import { getArticleBySlug, getArticlesByDomain, getPublishedArticles } from "@/lib/content";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({ domainSlug: article.domain.slug, articleSlug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ domainSlug: string; articleSlug: string }> }): Promise<Metadata> {
  const { domainSlug, articleSlug } = await params;
  const article = await getArticleBySlug(domainSlug, articleSlug);
  return article ? { title: article.title, description: article.excerpt, keywords: article.tags } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ domainSlug: string; articleSlug: string }> }) {
  const { domainSlug, articleSlug } = await params;
  const article = await getArticleBySlug(domainSlug, articleSlug);
  if (!article) notFound();
  const related = (await getArticlesByDomain(domainSlug)).filter((item) => item._id !== article._id).slice(0, 2);

  return <article className="page-shell reading-page">
    <div className="reading-breadcrumb"><Link href="/bibliotheque"><ArrowLeft size={15} /> Bibliothèque</Link><span>/</span><Link href={`/bibliotheque/${article.domain.slug}`}>{article.domain.title}</Link></div>
    <header className="reading-header"><div className={`reading-symbol tone-${article.domain.color}`}><DomainSymbol name={article.domain.icon} size={29} /></div><p className="eyebrow">FICHE DE CULTURE GÉNÉRALE</p><h1>{article.title}</h1><p className="reading-header__excerpt">{article.excerpt}</p><div className="reading-meta"><Link className="reading-meta__domain" href={`/bibliotheque/${article.domain.slug}`}>{article.domain.title}</Link><span className="meta-dot"/><span><Clock3 size={15}/> {article.readingMinutes} min de lecture</span><span className="meta-dot"/><span><BookOpen size={15}/> À retenir inclus</span></div></header>
    <div className="reading-layout"><div className="reading-main">
      <div className="takeaway-box"><div className="takeaway-box__title"><Lightbulb size={18}/><strong>L&apos;essentiel</strong></div><p>{article.excerpt}</p></div>
      <div className="article-prose">{article.sections.map((section, index) => <section key={`${section.heading}-${index}`}><h2>{section.heading}</h2>{section.body.split("\n\n").map((paragraph, paragraphIndex) => <p key={`${index}-${paragraphIndex}`}>{paragraph}</p>)}</section>)}</div>
      {article.funFact ? <aside className="fun-fact"><span className="fun-fact__icon"><SparkleFallback /></span><div><p className="eyebrow">LE PETIT PLUS</p><h2>Le savais-tu ?</h2><p>{article.funFact}</p></div></aside> : null}
      {article.sources.length ? <section className="sources-block"><p className="eyebrow">POUR ALLER PLUS LOIN</p><h2>Sources et références.</h2><p className="sources-block__intro">Quelques ressources pour approfondir le sujet et vérifier les informations.</p><ul>{article.sources.map((source) => <li key={source.url}><div><strong>{source.title}</strong>{source.publisher ? <span>{source.publisher}</span> : null}</div><a href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`Ouvrir la source ${source.title}`}><ExternalLink size={16}/></a></li>)}</ul></section> : null}
    </div><aside className="reading-aside"><div className="key-points"><p className="eyebrow">À RETENIR</p><h2>Les idées clés.</h2><ol>{article.keyTakeaways.map((takeaway, index) => <li key={takeaway}><span>{String(index + 1).padStart(2, "0")}</span><p>{takeaway}</p></li>)}</ol></div><div className="aside-cta"><BookOpen size={21}/><h3>La curiosité continue.</h3><p>Explore d&apos;autres fiches dans le domaine {article.domain.title.toLowerCase()}.</p><Link href={`/bibliotheque/${article.domain.slug}`}>Voir le domaine <ArrowRight size={15}/></Link></div></aside></div>
    {related.length ? <section className="related-section"><div className="section-heading section-heading--compact"><div><p className="eyebrow">POURSUIVRE L&apos;EXPLORATION</p><h2>À lire ensuite.</h2></div><Link className="text-link" href={`/bibliotheque/${article.domain.slug}`}>Toutes les fiches <ArrowRight size={16}/></Link></div><div className="article-grid">{related.map((item) => <ArticleCard key={item._id} article={item}/>)}</div></section> : null}
  </article>;
}

function SparkleFallback() {
  return <span aria-hidden="true">✦</span>;
}
