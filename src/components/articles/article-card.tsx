import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Article } from "@/lib/content-types";
import { DomainSymbol } from "@/components/domains/domain-symbol";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className={`article-card${featured ? " article-card--featured" : ""}`}>
      <Link className={`article-card__art tone-${article.domain.color}`} href={`/bibliotheque/${article.domain.slug}/${article.slug}`} aria-label={`Lire la fiche : ${article.title}`}>
        <span className="article-card__domain"><DomainSymbol name={article.domain.icon} size={15} /> {article.domain.title}</span>
        <span className={`article-art article-art--${article.slug}`} aria-hidden="true">
          <span className="article-art__orbit article-art__orbit--one" />
          <span className="article-art__orbit article-art__orbit--two" />
          <span className="article-art__core" />
          <span className="article-art__spark article-art__spark--one" />
          <span className="article-art__spark article-art__spark--two" />
        </span>
        <span className="article-card__open"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="article-card__content">
        <div className="article-card__meta"><span>{article.domain.title}</span><span className="meta-dot" /><span><Clock3 size={13} /> {article.readingMinutes} min</span></div>
        <h3><Link href={`/bibliotheque/${article.domain.slug}/${article.slug}`}>{article.title}</Link></h3>
        <p>{article.excerpt}</p>
        <Link className="text-link" href={`/bibliotheque/${article.domain.slug}/${article.slug}`}>Lire la fiche <ArrowUpRight size={15} /></Link>
      </div>
    </article>
  );
}
