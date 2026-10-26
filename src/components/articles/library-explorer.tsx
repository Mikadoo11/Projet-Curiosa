"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, Search, SlidersHorizontal } from "lucide-react";
import type { Article, Domain } from "@/lib/content-types";
import { DomainSymbol } from "@/components/domains/domain-symbol";

export function LibraryExplorer({ articles, domains, initialQuery = "" }: { articles: Article[]; domains: Domain[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [activeDomain, setActiveDomain] = useState("tous");
  const [sort, setSort] = useState("recent");

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("fr");
    const items = articles.filter((article) => {
      const matchesDomain = activeDomain === "tous" || article.domain.slug === activeDomain;
      const searchable = [article.title, article.excerpt, article.domain.title, ...article.tags, ...article.keyTakeaways].join(" ").toLocaleLowerCase("fr");
      return matchesDomain && (!needle || searchable.includes(needle));
    });
    return items.sort((a, b) => sort === "alpha" ? a.title.localeCompare(b.title, "fr") : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [articles, activeDomain, query, sort]);

  return (
    <div className="library-explorer">
      <div className="library-tools">
        <label className="search-field">
          <Search size={19} aria-hidden="true" />
          <span className="sr-only">Rechercher dans la bibliothèque</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Un sujet, une idée, un mot-clé…" />
          {query ? <button type="button" className="search-clear" onClick={() => setQuery("")}>Effacer</button> : null}
        </label>
        <label className="sort-select"><SlidersHorizontal size={17} aria-hidden="true" /><span className="sr-only">Trier les fiches</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recent">Plus récentes</option><option value="alpha">Ordre alphabétique</option></select></label>
      </div>
      <div className="filter-row" aria-label="Filtrer par domaine">
        <button className={`filter-chip${activeDomain === "tous" ? " is-active" : ""}`} type="button" onClick={() => setActiveDomain("tous")}>Tous les domaines <span>{articles.length}</span></button>
        {domains.map((domain) => <button key={domain.slug} className={`filter-chip${activeDomain === domain.slug ? " is-active" : ""}`} type="button" onClick={() => setActiveDomain(domain.slug)}><DomainSymbol name={domain.icon} size={15} />{domain.title}</button>)}
      </div>
      <div className="results-line"><span><strong>{filtered.length}</strong> {filtered.length > 1 ? "fiches à explorer" : "fiche à explorer"}</span><span className="results-line__hint">Une bibliothèque qui s&apos;enrichit au fil du temps</span></div>
      {filtered.length ? <div className="article-grid">{filtered.map((article) => <LibraryRowCard key={article._id} article={article} />)}</div> : <div className="empty-state"><span className="empty-state__icon"><Search size={24} /></span><h2>Aucune fiche trouvée</h2><p>Essaie un autre terme ou sélectionne un autre domaine.</p><button type="button" className="button button--secondary" onClick={() => { setQuery(""); setActiveDomain("tous"); }}>Réinitialiser les filtres</button></div>}
    </div>
  );
}

function LibraryRowCard({ article }: { article: Article }) {
  return <article className="library-card"><Link className={`library-card__symbol tone-${article.domain.color}`} href={`/bibliotheque/${article.domain.slug}/${article.slug}`}><DomainSymbol name={article.domain.icon} size={26} /><span className="library-card__symbol-orbit" /></Link><div className="library-card__body"><div className="article-card__meta"><span>{article.domain.title}</span><span className="meta-dot" /><span><Clock3 size={13} /> {article.readingMinutes} min</span></div><h2><Link href={`/bibliotheque/${article.domain.slug}/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><div className="tag-row">{article.tags.slice(0, 3).map((tag) => <span key={tag} className="tag">{tag}</span>)}</div></div><Link className="library-card__link" href={`/bibliotheque/${article.domain.slug}/${article.slug}`} aria-label={`Lire ${article.title}`}><ArrowUpRight size={19} /></Link></article>;
}
