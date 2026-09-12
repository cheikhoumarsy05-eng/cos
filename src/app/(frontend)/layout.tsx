import type { Metadata } from "next";
import { Archivo, Spectral, Geist } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";

const display = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Arial", "sans-serif"],
});
const serif = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});
const body = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

const TITLE = SITE_TITLE;
const DESCRIPTION = SITE_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Portfolio — Cheikh Oumar Sy",
  authors: [{ name: "Cheikh Oumar Sy", url: SITE_URL }],
  creator: "Cheikh Oumar Sy",
  keywords: [
    "ingénieur génie civil",
    "calcul de structures",
    "béton armé",
    "charpente métallique",
    "Eurocodes",
    "BAEL",
    "dynamique des structures",
    "bureau de contrôle technique",
    "Dakar",
    "Sénégal",
    "stage ingénieur structures",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "fr_FR",
    url: "/",
    siteName: "Cheikh Oumar Sy — Ingénieur Génie Civil",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${display.variable} ${serif.variable} ${body.variable}`}>
        <div
          hidden
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html:
              "<!--\n" +
              "CHANTIER — direction contract (variation of seed 0b6a2871, bold register of the editorial family)\n" +
              "THESIS: The portfolio as a construction site-hoarding / civic billboard; the work at architectural scale, enormous type over full-bleed renders. Refuses the quiet refined editorial (that is the Atelier Index sibling).\n" +
              "OWN-WORLD: Off-white (#F2F0EC) + near-black ink (#141414); ONE loud safety accent — signal orange-red (#F0512A); ink hazard bands used as full-width fields. Archivo heavy/expanded display at billboard scale, Geist body, Spectral only for a rare aside. Full-bleed renders as bands; coordinate tick marks; a loud availability notice.\n" +
              "STORY: A recruiter is hit immediately with 'structures engineer, at scale, available', scans the loud indexed work, and acts (email/CV) with zero friction.\n" +
              "FIRST VIEWPORT: A full-bleed render band; the name set ENORMOUS across/over it; a single loud accent notice bar with availability; primary action loud and obvious.\n" +
              "FORM: site-hoarding / civic billboard; bold register of editorial spread; seed key 0b6a2871 (variation).\n" +
              "FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md\n" +
              "-->",
          }}
        />
        {children}
      </body>
    </html>
  );
}
