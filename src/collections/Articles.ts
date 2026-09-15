import type { CollectionConfig } from "payload";
import { revalidateArticleAfterChange, revalidateArticleAfterDelete } from "@/hooks/revalidateHome";
import { SITE_URL } from "@/lib/site";

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
 *
 * Organisation de l'écran d'édition : le texte passe en premier, seul dans son
 * onglet. Il était auparavant le dernier champ, après les trois réglages de
 * couverture — on ouvrait un article sans trouver où écrire.
 */

/** Réduit un titre à un identifiant d'URL : minuscules, sans accent ni signe. */
function enIdentifiant(valeur: string): string {
  return valeur
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "date", "_status"],
    group: "Contenu",
    description: "Analyses et réflexions. Le plus récent s'affiche en premier.",
    // Bouton « Aperçu » de l'admin : ouvre l'article tel qu'il sera lu.
    preview: (doc, { locale }) => {
      if (!doc?.slug) return null;
      const prefixe = locale === "en" ? "/en" : "";
      return `${SITE_URL}${prefixe}/articles/${doc.slug}`;
    },
  },
  access: { read: () => true },
  /**
   * Brouillons : un article s'écrit en plusieurs fois et ne paraît qu'au clic
   * sur « Publier ». Sans cela, tout enregistrement partait aussitôt en base —
   * celle-là même que lit le site public.
   */
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 20,
  },
  hooks: {
    /**
     * L'identifiant d'URL se déduit du titre quand il est laissé vide, pour
     * éviter d'avoir à le composer à la main. Une fois posé, il ne bouge plus
     * tout seul : un article partagé garde son adresse.
     */
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && typeof data.title === "string" && data.title.trim()) {
          data.slug = enIdentifiant(data.title);
        }
        return data;
      },
    ],
    afterChange: [revalidateArticleAfterChange],
    afterDelete: [revalidateArticleAfterDelete],
  },
  defaultSort: "-date",
  fields: [
    // ── Colonne de droite : les réglages qu'on fixe une fois ────────────────
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Identifiant d'URL",
      admin: {
        position: "sidebar",
        description: "Rempli depuis le titre si on le laisse vide. Évitez de le changer une fois l'article partagé.",
      },
    },
    {
      name: "date",
      type: "date",
      required: true,
      label: "Date de publication",
      defaultValue: () => new Date().toISOString(),
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

    // ── Corps de l'écran : trois onglets, du plus écrit au plus réglage ─────
    {
      type: "tabs",
      tabs: [
        {
          label: "Texte",
          description: "Le titre, l'accroche et le corps de l'article.",
          fields: [
            { name: "title", type: "text", required: true, localized: true, label: "Titre" },
            {
              name: "excerpt",
              type: "textarea",
              required: true,
              localized: true,
              label: "Accroche",
              admin: { description: "Deux à trois lignes, affichées sur la carte." },
            },
            {
              name: "content",
              type: "richText",
              required: true,
              localized: true,
              label: "Contenu",
              admin: {
                description: "Tapez « / » dans le texte pour un titre, une liste, une citation ou une formule.",
              },
            },
          ],
        },
        {
          label: "Image",
          description: "La couverture affichée sur la carte et en tête d'article.",
          fields: [
            {
              name: "cover",
              type: "upload",
              relationTo: "media",
              label: "Image de couverture (téléversée)",
              admin: { description: "Recommandé. Sinon, renseignez le chemin ci-dessous." },
            },
            {
              name: "coverSrc",
              type: "text",
              label: "Couverture (chemin /public)",
              admin: { description: "Alternative au téléversement, ex. /articles/surelevation.webp" },
            },
            { name: "coverAlt", type: "text", localized: true, label: "Texte alternatif de la couverture" },
          ],
        },
        {
          label: "Classement",
          fields: [
            {
              name: "category",
              type: "text",
              required: true,
              localized: true,
              label: "Catégorie",
              admin: { description: "Ex. « Structures », « Réglementation », « Terrain »." },
            },
            {
              name: "linkedinUrl",
              type: "text",
              label: "Lien LinkedIn (optionnel)",
              admin: { description: "Si l'article a d'abord paru ailleurs, le lien apparaît en fin de page. Laisser vide sinon." },
            },
          ],
        },
      ],
    },
  ],
};
