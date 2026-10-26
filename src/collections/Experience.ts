import type { CollectionConfig } from "payload";
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from "@/hooks/revalidateHome";

export const Experience: CollectionConfig = {
  slug: "experience",
  admin: { useAsTitle: "role", defaultColumns: ["role", "org", "when"], group: "Contenu" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  fields: [
    { name: "order", type: "number", required: true, defaultValue: 0 },
    { name: "when", type: "text", required: true, localized: true, label: "Période" },
    { name: "role", type: "text", required: true, localized: true, label: "Poste" },
    { name: "org", type: "text", required: true, label: "Organisation" },
    { name: "city", type: "text", localized: true, label: "Ville", admin: { description: "Affichée après l'organisation. Laisser vide pour ne rien afficher." } },
    { name: "summary", type: "textarea", localized: true, label: "Description courte", admin: { description: "2 à 3 lignes, affichées avant les missions. Optionnel." } },
    /* Chiffre fort de la carte, dans la frise de la section Expérience :
       « 222 » + « villas suivies ». Laisser vide pour une carte sans chiffre. */
    { name: "figure", type: "text", label: "Chiffre fort", admin: { description: "Ex. : 222, 15+, R+7. Laisser vide pour ne rien afficher." } },
    { name: "figureLabel", type: "text", localized: true, label: "Légende du chiffre", admin: { description: "Ex. : villas suivies." } },
    {
      name: "points",
      type: "array",
      label: "Missions",
      fields: [{ name: "value", type: "text", required: true, localized: true }],
    },
    {
      name: "keyPoints",
      type: "array",
      label: "Points clés",
      admin: { description: "Référentiels, outils et compétences mobilisés. Affichés sur une ligne, séparés par des points médians." },
      fields: [
        { name: "value", type: "text", required: true, localized: true, label: "Élément" },
        { name: "strong", type: "checkbox", defaultValue: false, label: "Mettre en évidence", admin: { description: "Pour les référentiels et normes, qui priment sur les logiciels." } },
      ],
    },
  ],
};
