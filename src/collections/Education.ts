import type { CollectionConfig } from "payload";
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from "@/hooks/revalidateHome";

export const Education: CollectionConfig = {
  slug: "education",
  admin: { useAsTitle: "title", defaultColumns: ["title", "org", "when"], group: "Contenu" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  fields: [
    { name: "order", type: "number", required: true, defaultValue: 0 },
    { name: "when", type: "text", required: true, label: "Période" },
    { name: "title", type: "text", required: true, label: "Diplôme" },
    { name: "org", type: "text", required: true, label: "Établissement" },
  ],
};
