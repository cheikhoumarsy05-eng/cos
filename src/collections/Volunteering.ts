import type { CollectionConfig } from "payload";
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from "@/hooks/revalidateHome";

/* Engagement associatif, rendu en dernier dans la section Expérience, comme la
   rubrique « Associatif » du CV. Mêmes champs d'affichage que l'Expérience. */
export const Volunteering: CollectionConfig = {
  slug: "volunteering",
  labels: { singular: "Engagement associatif", plural: "Engagements associatifs" },
  admin: { useAsTitle: "role", defaultColumns: ["role", "org", "when"], group: "Contenu" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  fields: [
    { name: "order", type: "number", required: true, defaultValue: 0 },
    { name: "when", type: "text", required: true, localized: true, label: "Période" },
    { name: "role", type: "text", required: true, localized: true, label: "Rôle" },
    { name: "org", type: "text", required: true, label: "Association" },
    { name: "city", type: "text", localized: true, label: "Ville", admin: { description: "Affichée après l'association. Laisser vide pour ne rien afficher." } },
    { name: "summary", type: "textarea", localized: true, label: "Description courte", admin: { description: "Une ligne, affichée avant les actions. Optionnel." } },
    /* Chiffre fort de la carte, dans la frise de la section Expérience :
       « 222 » + « villas suivies ». Laisser vide pour une carte sans chiffre. */
    { name: "figure", type: "text", label: "Chiffre fort", admin: { description: "Ex. : 222, 15+, R+7. Laisser vide pour ne rien afficher." } },
    { name: "figureLabel", type: "text", localized: true, label: "Légende du chiffre", admin: { description: "Ex. : villas suivies." } },
    {
      name: "points",
      type: "array",
      label: "Actions",
      fields: [{ name: "value", type: "text", required: true, localized: true }],
    },
  ],
};
