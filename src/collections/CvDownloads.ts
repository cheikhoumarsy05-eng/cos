import type { CollectionConfig } from "payload";

/**
 * Un enregistrement par ouverture du CV, écrit par la route `/cv`.
 *
 * Le PDF est un fichier statique : servi tel quel, il ne passe par aucune
 * ligne de code et reste donc incomptable. La route `/cv` s'intercale, note
 * le passage, puis renvoie vers le fichier — c'est elle qui alimente cette
 * collection.
 *
 * Rien qui identifie la personne n'est conservé : ni adresse IP, ni
 * empreinte de navigateur. La provenance dit d'où vient le clic (LinkedIn,
 * une recherche, un lien direct), le pays vient de l'en-tête que Vercel
 * ajoute en périphérie. C'est assez pour lire une tendance, et trop peu
 * pour reconnaître quelqu'un.
 *
 * `create` est fermé : la route écrit par l'API locale de Payload, qui ne
 * passe pas par ce contrôle. Personne ne peut donc gonfler le compteur en
 * appelant l'API REST.
 */
export const CvDownloads: CollectionConfig = {
  slug: "cv-downloads",
  labels: { singular: "Téléchargement du CV", plural: "Téléchargements du CV" },
  admin: {
    useAsTitle: "referer",
    defaultColumns: ["createdAt", "referer", "country"],
    group: "Statistiques",
    description: "Un enregistrement par ouverture du CV. Le total est le nombre d'entrées.",
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "referer",
      type: "text",
      label: "Provenance",
      admin: { readOnly: true, description: "Page d'où vient le clic. Vide si le lien a été ouvert directement." },
    },
    {
      name: "country",
      type: "text",
      label: "Pays",
      admin: { readOnly: true, description: "Déduit par Vercel du réseau d'arrivée. Vide en local." },
    },
  ],
};
