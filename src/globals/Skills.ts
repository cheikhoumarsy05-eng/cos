import type { GlobalConfig } from "payload";
import { revalidateHomeAfterGlobalChange } from "@/hooks/revalidateHome";

export const Skills: GlobalConfig = {
  slug: "skills",
  admin: { group: "Sections" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterGlobalChange] },
  fields: [
    { name: "technicalLabel", type: "text", required: true, localized: true, label: "Titre — Techniques", defaultValue: "Techniques" },
    { name: "toolsLabel", type: "text", required: true, localized: true, label: "Titre — Outils & logiciels", defaultValue: "Outils & logiciels" },
    { name: "toolsNote", type: "text", required: true, localized: true, label: "Note sous les outils", defaultValue: "En gras : maîtrise quotidienne" },
    { name: "personalLabel", type: "text", required: true, localized: true, label: "Titre — Personnelles", defaultValue: "Personnelles" },
    {
      name: "domains",
      type: "array",
      label: "Domaines de compétences",
      admin: { description: "Affichés en tableau : un domaine par ligne, ses compétences et référentiels en regard." },
      fields: [
        { name: "title", type: "text", required: true, localized: true, label: "Domaine" },
        { name: "items", type: "textarea", required: true, localized: true, label: "Compétences / référentiels", admin: { description: "Séparez les éléments par « · »." } },
      ],
    },
    {
      name: "technical",
      type: "array",
      label: "Compétences techniques (ancienne liste)",
      admin: { description: "Remplacée à l'affichage par le tableau des domaines. Conservée ici, plus affichée sur la page." },
      fields: [{ name: "value", type: "text", required: true, localized: true }],
    },
    {
      name: "tools",
      type: "array",
      label: "Outils & logiciels",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "key", type: "checkbox", label: "Maîtrise quotidienne (mise en avant)", defaultValue: false },
      ],
    },
    {
      name: "personal",
      type: "array",
      label: "Compétences personnelles",
      fields: [{ name: "value", type: "text", required: true, localized: true }],
    },
  ],
};
