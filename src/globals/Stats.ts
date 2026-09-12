import type { GlobalConfig } from "payload";

export const Stats: GlobalConfig = {
  slug: "stats",
  admin: { group: "Sections" },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true, label: "Titre de section", defaultValue: "En chiffres" },
    { name: "lead", type: "text", label: "Accroche (optionnelle)" },
    {
      name: "items",
      type: "array",
      label: "Chiffres",
      minRows: 1,
      admin: { description: "Chaque chiffre : une valeur mise en avant (ex. « 20+ ») et un libellé." },
      fields: [
        { name: "value", type: "text", required: true, label: "Valeur", admin: { description: "ex. 20+" } },
        { name: "label", type: "text", required: true, label: "Libellé" },
      ],
      defaultValue: [
        { value: "20+", label: "projets de conception archi et béton armé" },
        { value: "20+", label: "examens de plans" },
        { value: "20+", label: "étudiants et professionnels formés en calcul de structures" },
      ],
    },
  ],
};
