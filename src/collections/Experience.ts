import type { CollectionConfig } from "payload";
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from "@/hooks/revalidateHome";

export const Experience: CollectionConfig = {
  slug: "experience",
  admin: { useAsTitle: "role", defaultColumns: ["role", "org", "when"], group: "Contenu" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  fields: [
    { name: "order", type: "number", required: true, defaultValue: 0 },
    { name: "when", type: "text", required: true, label: "Période" },
    { name: "role", type: "text", required: true, label: "Poste" },
    { name: "org", type: "text", required: true, label: "Organisation" },
    {
      name: "points",
      type: "array",
      label: "Points",
      fields: [{ name: "value", type: "text", required: true }],
    },
  ],
};
