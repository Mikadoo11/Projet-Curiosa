import { defineField, defineType } from "sanity";

export const domainSchema = defineType({
  name: "domain",
  title: "Domaine",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nom du domaine", type: "string", validation: (rule) => rule.required().min(2).max(60) }),
    defineField({ name: "slug", title: "URL", type: "slug", options: { source: "title", maxLength: 70 }, validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (rule) => rule.required().max(240) }),
    defineField({ name: "icon", title: "Icône", type: "string", options: { list: ["orbit", "leaf", "landmark", "atom", "brain", "globe"] }, initialValue: "orbit", validation: (rule) => rule.required() }),
    defineField({ name: "color", title: "Couleur", type: "string", options: { list: ["violet", "green", "amber", "blue", "rose", "teal"] }, initialValue: "violet", validation: (rule) => rule.required() }),
    defineField({ name: "order", title: "Ordre d'affichage", type: "number", initialValue: 100, validation: (rule) => rule.integer().min(0) }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
