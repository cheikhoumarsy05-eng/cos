/**
 * URL publique du site, source unique pour les métadonnées, le sitemap, le
 * robots.txt et les données structurées.
 *
 * Elle passe par une variable d'environnement pour que le remplacement du
 * sous-domaine Vercel par un nom de domaine ne demande qu'un réglage dans le
 * projet Vercel (Settings → Environment Variables), sans toucher au code.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosinus28.vercel.app";

export const SITE_TITLE = "Cheikh Oumar Sy · Ingénieur Génie Civil — Structures";

export const SITE_DESCRIPTION =
  "Ingénieur junior en génie civil, spécialisé en structures : béton armé, charpente métallique, dynamique des structures. Disponible pour un poste en bureau d'études ou en contrôle technique.";

export const SITE_TITLE_EN = "Cheikh Oumar Sy · Civil Engineer — Structures";

export const SITE_DESCRIPTION_EN =
  "Junior civil engineer specialising in structures: reinforced concrete, steel framing, structural dynamics. Available for a position in a design office or technical inspection office.";

/** Mots-clés de référencement, par langue. */
export const SITE_KEYWORDS = {
  fr: [
    "ingénieur génie civil",
    "calcul des structures",
    "béton armé",
    "charpente métallique",
    "Eurocodes",
    "BAEL",
    "dynamique des structures",
    "bureau de contrôle technique",
    "Dakar",
    "Sénégal",
    "ingénieur structures junior",
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
    "junior structural engineer",
  ],
} as const;
