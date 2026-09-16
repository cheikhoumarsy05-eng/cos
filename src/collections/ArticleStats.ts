import type { CollectionConfig } from "payload";

/**
 * Vues et « j'aime » d'un article.
 *
 * Collection séparée, et non deux champs ajoutés à l'article : chaque
 * enregistrement d'un article déclenche la régénération des pages qui le
 * montrent. Un compteur qui s'incrémente à chaque visite aurait donc fait
 * régénérer le site en boucle, pour un chiffre qui n'a aucune raison d'y
 * figurer.
 *
 * L'article est repéré par son identifiant d'URL plutôt que par une relation :
 * le compteur survit ainsi à un article dépublié puis republié, et la lecture
 * ne demande aucune jointure.
 *
 * Rien n'identifie les visiteurs. On ne conserve que deux totaux : savoir
 * qu'un article a été lu trois cents fois n'apprend rien sur personne.
 */
export const ArticleStats: CollectionConfig = {
  slug: "article-stats",
  labels: { singular: "Statistiques d'article", plural: "Statistiques d'articles" },
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "views", "likes"],
    group: "Statistiques",
    description: "Vues et « j'aime » comptés sur le site. Mis à jour automatiquement.",
  },
  access: {
    // Les totaux s'affichent sur le site : la lecture est publique.
    read: () => true,
    // L'écriture passe par les routes de comptage, qui utilisent l'API locale
    // de Payload et ne sont pas soumises à ce contrôle. Fermer ici empêche
    // qu'on gonfle les chiffres en appelant l'API REST directement.
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Identifiant de l'article",
      admin: { readOnly: true },
    },
    {
      name: "views",
      type: "number",
      required: true,
      defaultValue: 0,
      min: 0,
      label: "Vues",
      admin: { readOnly: true },
    },
    {
      name: "likes",
      type: "number",
      required: true,
      defaultValue: 0,
      min: 0,
      label: "J'aime",
      admin: { readOnly: true },
    },
  ],
};
