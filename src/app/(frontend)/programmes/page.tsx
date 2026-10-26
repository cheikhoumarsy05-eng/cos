import type { Metadata } from "next";
import ProgramsPage from "../components/ProgramsPage";
import { SITE_URL } from "@/lib/site";

// Même régime que l'accueil : pré-rendu, invalidé à chaque enregistrement dans
// l'admin (src/hooks/revalidateHome.ts) ; `revalidate` n'est qu'un filet.
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Programmes · Cheikh Oumar Sy",
  description: "Programmes de calcul écrits en Python : dynamique des ponts, oscillation des portiques, application Kàttan.",
  alternates: { canonical: "/programmes", languages: { fr: "/programmes", en: "/en/programmes", "x-default": "/programmes" } },
  openGraph: { url: "/programmes", title: "Programmes", description: "Programmes de calcul écrits en Python : dynamique des ponts, oscillation des portiques, application Kàttan.", locale: "fr_FR" },
};

export default function Page() {
  return <ProgramsPage locale="fr" />;
}
