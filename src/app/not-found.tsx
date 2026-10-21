import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return <section className="page-shell not-found"><span className="not-found__number">404</span><p className="eyebrow">CHEMIN INEXPLORÉ</p><h1>Cette fiche reste à découvrir.</h1><p>La page n'existe pas ou n'est plus disponible. Retournons à la bibliothèque pour trouver un autre sujet.</p><div className="hero__actions"><Link className="button button--primary" href="/bibliotheque"><ArrowLeft size={17}/> Retour à la bibliothèque</Link><Link className="button button--quiet" href="/recherche"><Search size={17}/> Rechercher</Link></div></section>;
}
