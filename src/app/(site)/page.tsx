import { DomainCard } from "@/components/domains/domain-card";
import { getDomains } from "@/lib/content";

export default async function HomePage() {
  const domains = await getDomains();

  return (
    <section className="section-block page-shell" aria-label="Choisir un domaine">
      <div className="domain-grid">
        {domains.map((domain) => (
          <DomainCard key={domain._id} domain={domain} />
        ))}
      </div>
    </section>
  );
}
