import type { Metadata } from "next";
import ProjectsPage from "../components/ProjectsPage";
import { SITE_URL } from "@/lib/site";

// Même régime que l'accueil : pré-rendu, invalidé à chaque enregistrement dans
// l'admin (src/hooks/revalidateHome.ts) ; `revalidate` n'est qu'un filet.
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Projets · Cheikh Oumar Sy",
  description: "Études de structure, plans de coffrage et de ferraillage, et projets de conception architecturale.",
  alternates: { canonical: "/projets", languages: { fr: "/projets", en: "/en/projets", "x-default": "/projets" } },
  openGraph: { url: "/projets", title: "Projets", description: "Études de structure, plans de coffrage et de ferraillage, et projets de conception architecturale.", locale: "fr_FR" },
};

export default function Page() {
  return <ProjectsPage locale="fr" />;
}
