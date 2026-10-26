import type { Metadata } from "next";
import ProgramsPage from "../../../(frontend)/components/ProgramsPage";
import { SITE_URL } from "@/lib/site";

// Même régime que l'accueil : pré-rendu, invalidé à chaque enregistrement dans
// l'admin (src/hooks/revalidateHome.ts) ; `revalidate` n'est qu'un filet.
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Programs · Cheikh Oumar Sy",
  description: "Calculation programs written in Python: bridge dynamics, frame oscillation, the Kàttan app.",
  alternates: { canonical: "/en/programmes", languages: { fr: "/programmes", en: "/en/programmes", "x-default": "/programmes" } },
  openGraph: { url: "/en/programmes", title: "Programs", description: "Calculation programs written in Python: bridge dynamics, frame oscillation, the Kàttan app.", locale: "en_US" },
};

export default function Page() {
  return <ProgramsPage locale="en" />;
}
