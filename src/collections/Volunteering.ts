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
    {
      name: "points",
      type: "array",
      label: "Actions",
      fields: [{ name: "value", type: "text", required: true, localized: true }],
    },
  ],
};
