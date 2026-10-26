import type { Metadata } from "next";
import ProjectsPage from "../../../(frontend)/components/ProjectsPage";
import { SITE_URL } from "@/lib/site";

// Même régime que l'accueil : pré-rendu, invalidé à chaque enregistrement dans
// l'admin (src/hooks/revalidateHome.ts) ; `revalidate` n'est qu'un filet.
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Projects · Cheikh Oumar Sy",
  description: "Structural studies, formwork and reinforcement drawings, and architectural design projects.",
  alternates: { canonical: "/en/projets", languages: { fr: "/projets", en: "/en/projets", "x-default": "/projets" } },
  openGraph: { url: "/en/projets", title: "Projects", description: "Structural studies, formwork and reinforcement drawings, and architectural design projects.", locale: "en_US" },
};

export default function Page() {
  return <ProjectsPage locale="en" />;
}
