"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Erreur d'affichage de page", error); }, [error]);
  return <section className="page-shell not-found"><span className="error-icon"><AlertCircle size={28}/></span><p className="eyebrow">UN PETIT CONTRETEMPS</p><h1>Cette page n&apos;a pas pu se charger.</h1><p>Réessaie dans un instant. Si le problème persiste, reviens à la bibliothèque.</p><div className="hero__actions"><button className="button button--primary" onClick={() => reset()}><RefreshCw size={17}/> Réessayer</button><Link className="button button--quiet" href="/bibliotheque">Ouvrir la bibliothèque</Link></div></section>;
}
