import type { Metadata } from "next";
import RootShell from "../_shared/RootShell";
import { SITE_URL, SITE_TITLE_EN, SITE_DESCRIPTION_EN, SITE_KEYWORDS } from "@/lib/site";

/**
 * Mise en page racine de la version anglaise.
 *
 * Elle existe séparément de celle du français pour une seule raison : `<html lang>`
 * ne se pose que dans une mise en page racine. Tout le reste est mutualisé dans
 * RootShell. Le français garde « / » — pas de redirection vers « /fr » — pour
 * que les URL déjà partagées et indexées continuent de fonctionner.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE_EN,
  description: SITE_DESCRIPTION_EN,
  applicationName: "Portfolio — Cheikh Oumar Sy",
  authors: [{ name: "Cheikh Oumar Sy", url: SITE_URL }],
  creator: "Cheikh Oumar Sy",
  keywords: [...SITE_KEYWORDS.en],
  alternates: {
    canonical: "/en",
    languages: { fr: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    url: "/en",
    siteName: "Cheikh Oumar Sy — Civil Engineer",
    title: SITE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE_EN, description: SITE_DESCRIPTION_EN },
  robots: { index: true, follow: true },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
