import type { CollectionConfig } from "payload";
import { revalidateArticleAfterChange, revalidateArticleAfterDelete } from "@/hooks/revalidateHome";

/**
 * Articles & réflexions.
 *
 * Collection plutôt que fichier de données : le site est déjà entièrement piloté
 * par le CMS et bilingue, et cette collection en hérite sans rien réinventer —
 * traduction champ par champ, stockage des couvertures dans Media, édition dans
 * l'admin. Ajouter un article ne touche aucun fichier du dépôt.
 *
 * Le `slug` n'est volontairement PAS traduit : une même adresse sert les deux
 * langues (/articles/x et /en/articles/x), ce qui garde les liens partagés
 * valables quelle que soit la langue de lecture.
 */
export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "date"],
    group: "Contenu",
    description: "Analyses et réflexions. Le plus récent s'affiche en premier.",
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateArticleAfterChange], afterDelete: [revalidateArticleAfterDelete] },
  defaultSort: "-date",
  fields: [
    { name: "title", type: "text", required: true, localized: true, label: "Titre" },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Identifiant d'URL",
      admin: {
        position: "sidebar",
        description: "En minuscules, sans accent ni espace. Ex. « surelever-un-batiment ». Évitez de le changer une fois l'article partagé.",
      },
    },
    {
      name: "date",
      type: "date",
      required: true,
      label: "Date de publication",
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly", displayFormat: "d MMMM yyyy" } },
    },
    {
      name: "author",
      type: "text",
      required: true,
      defaultValue: "Cheikh Oumar Sy",
      label: "Auteur",
      admin: { position: "sidebar" },
    },
    { name: "category", type: "text", required: true, localized: true, label: "Catégorie", admin: { description: "Ex. « Structures », « Réglementation », « Terrain »." } },
    { name: "excerpt", type: "textarea", required: true, localized: true, label: "Accroche", admin: { description: "Deux à trois lignes, affichées sur la carte." } },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Image de couverture (téléversée)",
      admin: { description: "Recommandé. Sinon, renseignez le chemin ci-dessous." },
    },
    { name: "coverSrc", type: "text", label: "Couverture (chemin /public)", admin: { description: "Alternative au téléversement, ex. /articles/surelevation.webp" } },
    { name: "coverAlt", type: "text", localized: true, label: "Texte alternatif de la couverture" },
    {
      name: "content",
      type: "richText",
      required: true,
      localized: true,
      label: "Contenu",
      admin: { description: "Titres, listes, citations, liens, gras et images sont pris en charge." },
    },
    {
      name: "linkedinUrl",
      type: "text",
      label: "Lien LinkedIn (optionnel)",
      admin: { description: "Si l'article a d'abord paru ailleurs, le lien apparaît en fin de page. Laisser vide sinon." },
    },
  ],
};
