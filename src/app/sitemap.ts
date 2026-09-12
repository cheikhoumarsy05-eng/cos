import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/** Next sert ce fichier à /sitemap.xml. Le portfolio tient en une seule page. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
