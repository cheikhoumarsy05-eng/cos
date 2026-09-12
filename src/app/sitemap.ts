import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { getArticleSlugs } from "./(frontend)/lib/content";

/**
 * Next sert ce fichier à /sitemap.xml. Le portfolio tient en une seule page,
 * déclinée en deux langues, à laquelle s'ajoute une page par article. Chaque
 * entrée pointe vers son équivalent dans l'autre langue via `alternates`, pour
 * que les moteurs les traitent comme des traductions et non comme un doublon.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const accueil = { fr: SITE_URL, en: `${SITE_URL}/en` };

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1, alternates: { languages: accueil } },
    { url: `${SITE_URL}/en`, lastModified, changeFrequency: "monthly", priority: 0.8, alternates: { languages: accueil } },
  ];

  const slugs = await getArticleSlugs();
  for (const slug of slugs) {
    const languages = { fr: `${SITE_URL}/articles/${slug}`, en: `${SITE_URL}/en/articles/${slug}` };
    pages.push(
      { url: languages.fr, lastModified, changeFrequency: "yearly", priority: 0.7, alternates: { languages } },
      { url: languages.en, lastModified, changeFrequency: "yearly", priority: 0.6, alternates: { languages } },
    );
  }
  return pages;
}
