import type { GlobalConfig } from "payload";
import { revalidateHomeAfterGlobalChange } from "@/hooks/revalidateHome";

export const Skills: GlobalConfig = {
  slug: "skills",
  admin: { group: "Sections" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterGlobalChange] },
  fields: [
    { name: "technicalLabel", type: "text", required: true, label: "Titre — Techniques", defaultValue: "Techniques" },
    { name: "toolsLabel", type: "text", required: true, label: "Titre — Outils & logiciels", defaultValue: "Outils & logiciels" },
    { name: "toolsNote", type: "text", required: true, label: "Note sous les outils", defaultValue: "En gras : maîtrise quotidienne" },
    { name: "personalLabel", type: "text", required: true, label: "Titre — Personnelles", defaultValue: "Personnelles" },
    {
      name: "technical",
      type: "array",
      label: "Compétences techniques",
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "tools",
      type: "array",
      label: "Outils & logiciels",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "key", type: "checkbox", label: "Maîtrise quotidienne (mise en avant)", defaultValue: false },
      ],
    },
    {
      name: "personal",
      type: "array",
      label: "Compétences personnelles",
      fields: [{ name: "value", type: "text", required: true }],
    },
  ],
};
