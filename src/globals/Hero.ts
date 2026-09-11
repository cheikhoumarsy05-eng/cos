import type { GlobalConfig } from "payload";
import { revalidateHomeAfterGlobalChange } from "@/hooks/revalidateHome";

export const Hero: GlobalConfig = {
  slug: "hero",
  admin: { group: "Sections" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomeAfterGlobalChange] },
  fields: [
    { name: "folioLabel", type: "text", required: true, defaultValue: "Portfolio · Ingénieur Structures" },
    { name: "nameLine1", type: "text", required: true, defaultValue: "Cheikh" },
    { name: "nameLine2", type: "text", required: true, defaultValue: "Oumar" },
    { name: "nameAccent", type: "text", required: true, defaultValue: "Sy", label: "Nom (accent)" },
    { name: "sub", type: "textarea", required: true, label: "Sous-titre" },
    { name: "image", type: "upload", relationTo: "media", label: "Rendu (téléversé)", admin: { description: "Recommandé. Sinon, renseignez le chemin ci-dessous." } },
    { name: "imageSrc", type: "text", label: "Rendu (chemin /public)", defaultValue: "/projects/nafi-1.webp" },
    { name: "imageFallback", type: "text", label: "Rendu (JPEG repli)", defaultValue: "/projects/nafi-1.jpg" },
    { name: "imageAlt", type: "text", required: true },
    { name: "imageCaption", type: "text", required: true },
    { name: "imageYear", type: "text", required: true, defaultValue: "2024" },
    { name: "availability", type: "text", required: true, label: "Statut de disponibilité", defaultValue: "Disponible — stage 4 à 6 mois" },
    { name: "location", type: "text", required: true, defaultValue: "Dakar, Sénégal" },
    { name: "domain", type: "text", required: true, defaultValue: "Béton armé · Charpente métallique · Dynamique" },
  ],
};
