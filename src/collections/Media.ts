import type { CollectionConfig } from "payload";
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from "@/hooks/revalidateHome";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Contenu" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterChange], afterDelete: [revalidateHomeAfterDelete] },
  upload: {
    staticDir: path.resolve(dirname, "../../public/uploads"),
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumb", width: 400, height: 300, position: "centre" },
      { name: "wide", width: 1600, height: undefined },
    ],
    formatOptions: { format: "webp", options: { quality: 82 } },
  },
  fields: [
    { name: "alt", type: "text", required: true, label: "Texte alternatif" },
  ],
};
