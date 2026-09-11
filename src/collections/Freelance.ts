import type { CollectionConfig } from "payload";
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from "@/hooks/revalidateHome";

export const Freelance: CollectionConfig = {
  slug: "freelance",
  admin: { useAsTitle: "title", defaultColumns: ["title", "when"], group: "Contenu" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  fields: [
    { name: "order", type: "number", required: true, defaultValue: 0 },
    { name: "when", type: "text", required: true, label: "Période" },
    { name: "title", type: "text", required: true, label: "Titre" },
    { name: "body", type: "textarea", required: true, label: "Description" },
  ],
};
