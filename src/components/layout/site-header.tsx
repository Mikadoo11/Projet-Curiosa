import Link from "next/link";
import { BookOpen, Compass, House, Search, Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner page-shell">
          <Link className="brand" href="/" aria-label="Curiosa, accueil">
            <span className="brand__mark"><Sparkles size={20} strokeWidth={2.1} /></span>
            <span>curiosa<span className="brand__dot">.</span></span>
          </Link>
          <nav className="desktop-nav" aria-label="Navigation principale">
            <Link className="nav-link" href="/">Accueil</Link>
            <Link className="nav-link" href="/bibliotheque">Bibliothèque</Link>
            <Link className="nav-link" href="/recherche">Recherche</Link>
          </nav>
          <Link className="header-search" href="/recherche" aria-label="Rechercher un sujet"><Search size={19} /></Link>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Navigation mobile">
        <Link href="/"><House size={19} /><span>Accueil</span></Link>
        <Link href="/bibliotheque"><BookOpen size={19} /><span>Bibliothèque</span></Link>
        <Link href="/recherche"><Compass size={19} /><span>Explorer</span></Link>
      </nav>
    </>
  );
}
