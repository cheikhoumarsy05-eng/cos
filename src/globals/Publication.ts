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
