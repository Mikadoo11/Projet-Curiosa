import { defineArrayMember, defineField, defineType } from "sanity";

export const articleSchema = defineType({
  name: "article",
  title: "Fiche",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (rule) => rule.required().min(5).max(100) }),
    defineField({ name: "slug", title: "URL", type: "slug", options: { source: "title", maxLength: 90 }, validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Résumé", type: "text", rows: 3, validation: (rule) => rule.required().min(40).max(420) }),
    defineField({ name: "domain", title: "Domaine", type: "reference", to: [{ type: "domain" }], validation: (rule) => rule.required() }),
    defineField({ name: "readingMinutes", title: "Temps de lecture (minutes)", type: "number", initialValue: 5, validation: (rule) => rule.required().integer().min(1).max(45) }),
    defineField({ name: "status", title: "Statut", type: "string", options: { list: [{ title: "Brouillon", value: "draft" }, { title: "Publié", value: "published" }, { title: "Bloqué", value: "blocked" }] }, initialValue: "draft", validation: (rule) => rule.required() }),
    defineField({ name: "publishedAt", title: "Date de publication", type: "datetime" }),
    defineField({ name: "updatedAt", title: "Dernière révision", type: "datetime" }),
    defineField({ name: "tags", title: "Mots-clés", type: "array", of: [defineArrayMember({ type: "string" })], validation: (rule) => rule.max(12) }),
    defineField({ name: "sections", title: "Sections explicatives", type: "array", of: [defineArrayMember({ type: "object", name: "articleSection", title: "Section", fields: [defineField({ name: "heading", title: "Titre de section", type: "string", validation: (rule) => rule.required().max(120) }), defineField({ name: "body", title: "Texte", type: "text", rows: 6, validation: (rule) => rule.required().min(80).max(6000) })], preview: { select: { title: "heading", subtitle: "body" } } })], validation: (rule) => rule.required().min(2).max(15) }),
    defineField({ name: "keyTakeaways", title: "Idées à retenir", type: "array", of: [defineArrayMember({ type: "string" })], validation: (rule) => rule.required().min(2).max(7) }),
    defineField({ name: "funFact", title: "Le savais-tu ?", type: "text", rows: 3, validation: (rule) => rule.max(700) }),
    defineField({ name: "sources", title: "Sources et références", type: "array", of: [defineArrayMember({ type: "object", name: "articleSource", title: "Source", fields: [defineField({ name: "title", title: "Titre de la source", type: "string", validation: (rule) => rule.required().max(180) }), defineField({ name: "url", title: "URL", type: "url", validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }) }), defineField({ name: "publisher", title: "Organisme / éditeur", type: "string", validation: (rule) => rule.max(120) })], preview: { select: { title: "title", subtitle: "publisher" } } })], validation: (rule) => rule.required().min(1).max(15) }),
    defineField({ name: "generationId", title: "Identifiant de génération", type: "string", readOnly: true, hidden: true }),
    defineField({ name: "generatedAt", title: "Généré le", type: "datetime", readOnly: true }),
    defineField({ name: "qualityScore", title: "Score qualité interne", type: "number", readOnly: true, hidden: true, validation: (rule) => rule.min(0).max(100) }),
    defineField({ name: "verificationSummary", title: "Résumé des contrôles IA", type: "text", rows: 3, readOnly: true, hidden: true }),
  ],
  preview: { select: { title: "title", subtitle: "status", media: "domain" } },
});
