import type { CollectionConfig } from "payload";
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from "@/hooks/revalidateHome";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["index", "title", "type"],
    group: "Contenu",
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  fields: [
    { name: "index", type: "text", required: true, admin: { description: "Numéro d'index, ex. 01" } },
    { name: "order", type: "number", required: true, defaultValue: 0, admin: { description: "Ordre d'affichage (croissant)" } },
    { name: "type", type: "text", required: true, label: "Type / eyebrow" },
    { name: "title", type: "text", required: true, label: "Titre" },
    { name: "fieldLabel", type: "text", required: true, label: "Légende du visuel" },
    { name: "desc", type: "textarea", required: true, label: "Description" },
    {
      name: "specs",
      type: "array",
      label: "Spécifications",
      fields: [
        { name: "k", type: "text", required: true, label: "Clé" },
        { name: "v", type: "text", required: true, label: "Valeur" },
      ],
    },
    {
      name: "tags",
      type: "array",
      label: "Tags",
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "images",
      type: "array",
      label: "Rendus (images web)",
      admin: { description: "Laisser vide pour afficher le plan schématique (blueprint). Téléversez une image OU indiquez un chemin /public." },
      fields: [
        { name: "upload", type: "upload", relationTo: "media", label: "Image téléversée", admin: { description: "Recommandé : téléversez le rendu ici." } },
        { name: "src", type: "text", admin: { description: "Alternative : chemin WebP dans /public, ex. /projects/nafi-1.webp" } },
        { name: "fallback", type: "text", admin: { description: "JPEG de repli optionnel (chemin /public)" } },
        { name: "alt", type: "text", label: "Texte alternatif (si non téléversé)" },
      ],
    },
  ],
};
