import type { Metadata } from "next";
import RootShell from "../_shared/RootShell";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Portfolio — Cheikh Oumar Sy",
  authors: [{ name: "Cheikh Oumar Sy", url: SITE_URL }],
  creator: "Cheikh Oumar Sy",
  keywords: [...SITE_KEYWORDS.fr],
  // hreflang : indique aux moteurs que « / » et « /en » sont deux versions
  // linguistiques d'une même page, et non du contenu dupliqué.
  alternates: {
    canonical: "/",
    languages: { fr: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "profile",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "Cheikh Oumar Sy — Ingénieur Génie Civil",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="fr">{children}</RootShell>;
}
