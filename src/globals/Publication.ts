import type { GlobalConfig } from "payload";
import { revalidateHomeAfterGlobalChange } from "@/hooks/revalidateHome";

export const Publication: GlobalConfig = {
  slug: "publication",
  admin: { group: "Sections" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterGlobalChange] },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Articles / Publications",
      minRows: 1,
      admin: { description: "Ajoutez plusieurs publications : la section devient un carrousel qui glisse entre elles." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "sub", type: "text", required: true, label: "Sous-titre" },
        { name: "points", type: "array", label: "Points", fields: [{ name: "value", type: "textarea", required: true }] },
        {
          name: "metrics",
          type: "array",
          label: "Chiffres clés",
          admin: { description: "Affichés en grand : une valeur (ex. « 220 km/h ») et son libellé (ex. « Vitesse de service »)." },
          fields: [
            { name: "value", type: "text", required: true, label: "Valeur" },
            { name: "label", type: "text", required: true, label: "Libellé" },
          ],
        },
        { name: "keyResult", type: "textarea", label: "Résultat clé", admin: { description: "Mis en évidence sous les points. Laisser vide pour ne rien afficher." } },
        { name: "doi", type: "text", required: true, label: "DOI (texte)" },
        { name: "doiUrl", type: "text", required: true, label: "Lien DOI" },
        {
          name: "sideFacts",
          type: "array",
          label: "Encart (rail)",
          fields: [
            { name: "k", type: "text", required: true },
            { name: "v", type: "text", required: true },
            { name: "accent", type: "checkbox", defaultValue: false },
          ],
        },
      ],
    },
  ],
};
