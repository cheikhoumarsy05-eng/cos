/**
 * URL publique du site, source unique pour les métadonnées, le sitemap, le
 * robots.txt et les données structurées.
 *
 * Elle passe par une variable d'environnement pour que le remplacement du
 * sous-domaine Vercel par un nom de domaine ne demande qu'un réglage dans le
 * projet Vercel (Settings → Environment Variables), sans toucher au code.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cos-6kaz.vercel.app";

export const SITE_TITLE = "Cheikh Oumar Sy · Ingénieur Génie Civil — Structures";

export const SITE_DESCRIPTION =
  "Ingénieur en Génie Civil — spécialisation structures : béton armé, charpente métallique, dynamique des structures. En recherche d'un stage Ingénieur Structures (4–6 mois).";

export const SITE_TITLE_EN = "Cheikh Oumar Sy · Civil Engineer — Structures";

export const SITE_DESCRIPTION_EN =
  "Civil engineer specialising in structures: reinforced concrete, steel framing, structural dynamics. Looking for a 4–6 month structural engineering internship.";

/** Mots-clés de référencement, par langue. */
export const SITE_KEYWORDS = {
  fr: [
    "ingénieur génie civil",
    "calcul de structures",
    "béton armé",
    "charpente métallique",
    "Eurocodes",
    "BAEL",
    "dynamique des structures",
    "bureau de contrôle technique",
    "Dakar",
    "Sénégal",
    "stage ingénieur structures",
  ],
  en: [
    "civil engineer",
    "structural analysis",
    "reinforced concrete",
    "steel framing",
    "Eurocodes",
    "BAEL",
    "structural dynamics",
    "technical inspection office",
    "Dakar",
    "Senegal",
    "structural engineering internship",
  ],
} as const;
