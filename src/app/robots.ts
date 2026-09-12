import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Next sert ce fichier à /robots.txt.
 * L'interface d'administration et l'API Payload n'ont rien à faire dans un
 * index de moteur de recherche.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
