import Link from "next/link";
import { Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__inner">
        <Link className="brand brand--footer" href="/"><span className="brand__mark"><Sparkles size={18} /></span><span>curiosa<span className="brand__dot">.</span></span></Link>
        <p>Un peu plus de compréhension, chaque jour.</p>
        <span className="site-footer__caption">Le savoir se partage.</span>
      </div>
    </footer>
  );
}
