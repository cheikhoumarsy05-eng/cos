import type { CollectionConfig } from "payload";
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from "@/hooks/revalidateHome";

/**
 * Programmes écrits soi-même : outils de calcul, scripts d'étude, applications.
 *
 * Section distincte des projets : un projet montre un ouvrage conçu, un
 * programme montre l'outil qui a servi à le calculer. Les mélanger noierait
 * les outils parmi les maisons, et obligerait la carte projet à porter des
 * champs (langage, fonctions) qui n'ont pas de sens pour une villa.
 */
export const Programs: CollectionConfig = {
  slug: "programs",
  labels: { singular: "Programme", plural: "Programmes" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "category", "stack"], group: "Contenu" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  fields: [
    { name: "order", type: "number", required: true, defaultValue: 0 },
    { name: "name", type: "text", required: true, label: "Nom" },
    { name: "category", type: "text", required: true, localized: true, label: "Domaine", admin: { description: "Ex. : Dynamique des ponts ferroviaires." } },
    { name: "stack", type: "text", required: true, label: "Langages et outils", admin: { description: "Ex. : MATLAB · Python." } },
    { name: "summary", type: "textarea", required: true, localized: true, label: "Description" },
    {
      name: "features",
      type: "array",
      label: "Ce que fait le programme",
      fields: [{ name: "value", type: "text", required: true, localized: true }],
    },
    {
      name: "note",
      type: "text",
      localized: true,
      label: "Note",
      admin: { description: "Facultative. Ex. : résultats publiés après la soutenance." },
    },
    {
      name: "images",
      type: "array",
      label: "Figures",
      fields: [
        { name: "upload", type: "upload", relationTo: "media", label: "Téléversement" },
        { name: "src", type: "text", label: "Ou chemin dans /public", admin: { description: "Utilisé si aucun fichier n'est téléversé." } },
        { name: "alt", type: "text", localized: true, label: "Texte alternatif" },
      ],
    },
    { name: "url", type: "text", label: "Lien", admin: { description: "Facultatif : dépôt de code ou démonstration publique." } },
  ],
};
