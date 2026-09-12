import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Next sert ce fichier à /sitemap.xml. Le portfolio tient en une seule page,
 * déclinée en deux langues. Chaque entrée pointe vers l'autre via `alternates`,
 * pour que les moteurs les traitent comme deux traductions et non comme un
 * doublon.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = { fr: SITE_URL, en: `${SITE_URL}/en` };
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages },
    },
  ];
}
