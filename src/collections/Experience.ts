import type { CollectionConfig } from "payload";
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from "@/hooks/revalidateHome";

export const Experience: CollectionConfig = {
  slug: "experience",
  admin: { useAsTitle: "role", defaultColumns: ["role", "org", "when"], group: "Contenu" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  fields: [
    { name: "order", type: "number", required: true, defaultValue: 0 },
    { name: "when", type: "text", required: true, label: "Période" },
    { name: "role", type: "text", required: true, label: "Poste" },
    { name: "org", type: "text", required: true, label: "Organisation" },
    { name: "city", type: "text", label: "Ville", admin: { description: "Affichée après l'organisation. Laisser vide pour ne rien afficher." } },
    { name: "summary", type: "textarea", label: "Description courte", admin: { description: "2 à 3 lignes, affichées avant les missions. Optionnel." } },
    {
      name: "points",
      type: "array",
      label: "Missions",
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "keyPoints",
      type: "array",
      label: "Points clés",
      admin: { description: "Référentiels, outils et compétences mobilisés. Affichés sur une ligne, séparés par des points médians." },
      fields: [
        { name: "value", type: "text", required: true, label: "Élément" },
        { name: "strong", type: "checkbox", defaultValue: false, label: "Mettre en évidence", admin: { description: "Pour les référentiels et normes, qui priment sur les logiciels." } },
      ],
    },
  ],
};
