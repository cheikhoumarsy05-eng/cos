import type { GlobalConfig } from "payload";
import { revalidateHomeAfterGlobalChange } from "@/hooks/revalidateHome";

export const Contact: GlobalConfig = {
  slug: "contact",
  admin: { group: "Sections" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterGlobalChange] },
  fields: [
    { name: "title", type: "text", required: true, defaultValue: "Disponible pour un stage de 4 à 6 mois." },
    { name: "lead", type: "textarea", required: true },
    { name: "email", type: "text", required: true, defaultValue: "cheikhoumarsy05@gmail.com" },
    { name: "phone", type: "text", required: true, defaultValue: "+221 76 630 10 88" },
    { name: "phoneHref", type: "text", required: true, defaultValue: "+221766301088" },
    { name: "linkedin", type: "text", required: true, defaultValue: "https://www.linkedin.com/in/cheikh-oumar-sy-29912b23b" },
    { name: "github", type: "text", required: true, defaultValue: "https://github.com/cheikhoumarsy05-eng" },
    { name: "location", type: "text", required: true, defaultValue: "Dakar — Sénégal" },
  ],
};
