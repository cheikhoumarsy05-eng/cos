import type { GlobalConfig } from "payload";
import { revalidateHomeAfterGlobalChange } from "@/hooks/revalidateHome";

export const Site: GlobalConfig = {
  slug: "site",
  admin: { group: "Sections" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterGlobalChange] },
  fields: [
    { name: "brand", type: "text", required: true, defaultValue: "Cheikh Oumar Sy" },
    { name: "cvUrl", type: "text", required: true, defaultValue: "/cv-cheikh-oumar-sy.pdf" },
    { name: "footerNote", type: "text", required: true, defaultValue: "Conçu à Dakar." },
    {
      name: "sectionTitles",
      type: "group",
      label: "Titres de sections",
      fields: [
        { name: "home", type: "text", defaultValue: "Accueil", label: "Accueil — libellé de navigation" },
        { name: "about", type: "text", defaultValue: "À propos" },
        { name: "aboutNav", type: "text", defaultValue: "À propos", label: "À propos — libellé court (navigation)" },
        { name: "expertise", type: "text", defaultValue: "Expertise" },
        { name: "experience", type: "text", defaultValue: "Expérience" },
        { name: "experienceLead", type: "text", defaultValue: "Bureau de contrôle, conduite de travaux, chantier." },
        { name: "research", type: "text", defaultValue: "Recherche appliquée" },
        { name: "projects", type: "text", defaultValue: "Projets" },
        { name: "projectsLead", type: "text", defaultValue: "Conception, modélisation et calcul de bâtiments résidentiels — du volume à l'élément." },
        { name: "projectsNav", type: "text", defaultValue: "Projets", label: "Projets — libellé court (navigation)" },
        { name: "contactNav", type: "text", defaultValue: "Contact", label: "Contact — libellé court (navigation)" },
        { name: "freelance", type: "text", defaultValue: "Freelance" },
        { name: "skills", type: "text", defaultValue: "Compétences" },
        { name: "education", type: "text", defaultValue: "Formation" },
        { name: "contact", type: "text", defaultValue: "Contact" },
      ],
    },
  ],
};
