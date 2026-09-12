import type { GlobalConfig } from "payload";
import { revalidateHomeAfterGlobalChange } from "@/hooks/revalidateHome";

export const Expertise: GlobalConfig = {
  slug: "expertise",
  admin: { group: "Sections" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterGlobalChange] },
  fields: [
    { name: "title", type: "text", localized: true, label: "Titre de section", defaultValue: "Expertise" },
    {
      name: "items",
      type: "array",
      label: "Domaines d'expertise",
      admin: { description: "Chaque domaine : un intitulé, ce qu'il recouvre, et les logiciels ou normes associés." },
      fields: [
        { name: "title", type: "text", required: true, localized: true, label: "Domaine" },
        { name: "description", type: "textarea", required: true, localized: true, label: "Description" },
        {
          name: "tools",
          type: "text",
          localized: true,
          label: "Logiciels / normes",
          admin: { description: "Ex. « Eurocodes · BAEL ». Laisser vide si rien de pertinent." },
        },
      ],
    },
  ],
};
