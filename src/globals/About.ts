import type { GlobalConfig } from "payload";
import { revalidateHomeAfterGlobalChange } from "@/hooks/revalidateHome";

export const About: GlobalConfig = {
  slug: "about",
  admin: { group: "Sections" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterGlobalChange] },
  fields: [
    { name: "lead", type: "textarea", required: true, label: "Accroche" },
    { name: "body", type: "array", label: "Paragraphes", fields: [{ name: "value", type: "textarea", required: true }] },
    { name: "statYears", type: "text", required: true, defaultValue: "3+ ans" },
    { name: "statYearsText", type: "text", required: true, label: "Texte après « années »", defaultValue: "terrain & bureau d'études." },
    { name: "statProjects", type: "text", required: true, defaultValue: "5 projets" },
    { name: "statProjectsText", type: "text", required: true, label: "Texte après « projets »", defaultValue: "de conception, contrôle & recherche." },
    { name: "statPublication", type: "text", required: true, defaultValue: "1 publication" },
    { name: "statPublicationText", type: "text", required: true, label: "Texte après « publication »", defaultValue: "scientifique" },
    { name: "statNote", type: "text", required: true, defaultValue: "Zenodo, 2026" },
    { name: "portrait", type: "upload", relationTo: "media", label: "Portrait (téléversé)", admin: { description: "Recommandé. Sinon, renseignez le chemin ci-dessous." } },
    { name: "portraitSrc", type: "text", label: "Portrait (chemin /public)", defaultValue: "/img/portrait.webp" },
    { name: "portraitFallback", type: "text", defaultValue: "/img/portrait.jpg" },
    { name: "portraitAlt", type: "text", required: true, defaultValue: "Cheikh Oumar Sy, ingénieur en génie civil" },
    { name: "facts", type: "array", label: "Faits", fields: [
      { name: "k", type: "text", required: true },
      { name: "v", type: "text", required: true },
    ] },
  ],
};
