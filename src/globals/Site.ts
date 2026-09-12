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
    { name: "footerNote", type: "text", required: true, localized: true, defaultValue: "Conçu à Dakar." },
    {
      name: "sectionTitles",
      type: "group",
      label: "Titres de sections",
      fields: [
        { name: "home", type: "text", localized: true, defaultValue: "Accueil", label: "Accueil — libellé de navigation" },
        { name: "about", type: "text", localized: true, defaultValue: "À propos" },
        { name: "aboutNav", type: "text", localized: true, defaultValue: "À propos", label: "À propos — libellé court (navigation)" },
        { name: "expertise", type: "text", localized: true, defaultValue: "Expertise" },
        { name: "experience", type: "text", localized: true, defaultValue: "Expérience" },
        { name: "experienceLead", type: "text", localized: true, defaultValue: "Bureau de contrôle, conduite de travaux, chantier." },
        { name: "research", type: "text", localized: true, defaultValue: "Recherche appliquée" },
        { name: "articles", type: "text", localized: true, defaultValue: "Articles & Réflexions" },
        { name: "articlesLead", type: "text", localized: true, defaultValue: "Analyses, retours d'expérience et réflexions autour de l'ingénierie civile, des structures et du secteur de la construction." },
        { name: "projects", type: "text", localized: true, defaultValue: "Projets" },
        { name: "projectsLead", type: "text", localized: true, defaultValue: "Conception, modélisation et calcul de bâtiments résidentiels — du volume à l'élément." },
        { name: "projectsNav", type: "text", localized: true, defaultValue: "Projets", label: "Projets — libellé court (navigation)" },
        { name: "contactNav", type: "text", localized: true, defaultValue: "Contact", label: "Contact — libellé court (navigation)" },
        { name: "freelance", type: "text", localized: true, defaultValue: "Freelance" },
        { name: "skills", type: "text", localized: true, defaultValue: "Compétences" },
        { name: "education", type: "text", localized: true, defaultValue: "Formation" },
        { name: "contact", type: "text", localized: true, defaultValue: "Contact" },
      ],
    },
  ],
};
