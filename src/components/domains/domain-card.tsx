import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Domain } from "@/lib/content-types";
import { DomainSymbol } from "@/components/domains/domain-symbol";

export function DomainCard({ domain }: { domain: Domain }) {
  return (
    <Link className={`domain-card tone-${domain.color}`} href={`/bibliotheque/${domain.slug}`}>
      <span className="domain-card__icon"><DomainSymbol name={domain.icon} size={25} /></span>
      <span className="domain-card__body">
        <strong>{domain.title}</strong>
        <span>{domain.description}</span>
        <small>{domain.articleCount} fiches</small>
      </span>
      <ArrowUpRight className="domain-card__arrow" aria-hidden="true" size={19} />
    </Link>
  );
}
