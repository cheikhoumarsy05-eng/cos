import type { CollectionConfig } from "payload";
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from "@/hooks/revalidateHome";

export const Freelance: CollectionConfig = {
  slug: "freelance",
  admin: { useAsTitle: "title", defaultColumns: ["title", "when"], group: "Contenu" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  fields: [
    { name: "order", type: "number", required: true, defaultValue: 0 },
    { name: "when", type: "text", required: true, localized: true, label: "Période" },
    { name: "title", type: "text", required: true, localized: true, label: "Titre" },
    { name: "body", type: "textarea", required: true, localized: true, label: "Description" },
    /* Chiffre fort de la carte, dans la frise de la section Expérience :
       « 222 » + « villas suivies ». Laisser vide pour une carte sans chiffre. */
    { name: "figure", type: "text", label: "Chiffre fort", admin: { description: "Ex. : 222, 15+, R+7. Laisser vide pour ne rien afficher." } },
    { name: "figureLabel", type: "text", localized: true, label: "Légende du chiffre", admin: { description: "Ex. : villas suivies." } },
    /* Mêmes champs que la collection Expérience : les deux listes sont rendues
       dans une même section, une entrée indépendante doit pouvoir être aussi
       documentée qu'un stage. */
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
      admin: { description: "Référentiels, outils et compétences mobilisés." },
      fields: [
        { name: "value", type: "text", required: true, localized: true, label: "Élément" },
        { name: "strong", type: "checkbox", defaultValue: false, label: "Mettre en évidence" },
      ],
    },
  ],
};
