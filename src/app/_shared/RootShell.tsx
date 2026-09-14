import { Archivo, Spectral, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../(frontend)/globals.css";

/**
 * Enveloppe commune aux deux mises en page racine, française et anglaise.
 *
 * `<html lang>` ne peut être posé que dans une mise en page racine : le site a
 * donc deux racines, une par groupe de routes — « / » en français et « /en » en
 * anglais. Tout ce qui ne dépend pas de la langue (polices, feuille de style,
 * note de direction artistique) vit ici pour n'exister qu'en un seul exemplaire.
 * Le dossier « _shared » commence par un tiret bas : Next l'exclut du routage.
 */

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

const DIRECTION_NOTE =
  "<!--\n" +
  "CHANTIER — direction contract (variation of seed 0b6a2871, bold register of the editorial family)\n" +
  "THESIS: The portfolio as a construction site-hoarding / civic billboard; the work at architectural scale, enormous type over full-bleed renders. Refuses the quiet refined editorial (that is the Atelier Index sibling).\n" +
  "OWN-WORLD: Off-white (#F2F0EC) + near-black ink (#141414); ONE loud safety accent — signal orange-red (#F0512A); ink hazard bands used as full-width fields. Archivo heavy/expanded display at billboard scale, Geist body, Spectral only for a rare aside. Full-bleed renders as bands; coordinate tick marks; a loud availability notice.\n" +
  "STORY: A recruiter is hit immediately with 'structures engineer, at scale, available', scans the loud indexed work, and acts (email/CV) with zero friction.\n" +
  "FIRST VIEWPORT: A full-bleed render band; the name set ENORMOUS across/over it; a single loud accent notice bar with availability; primary action loud and obvious.\n" +
  "FORM: site-hoarding / civic billboard; bold register of editorial spread; seed key 0b6a2871 (variation).\n" +
  "FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md\n" +
  "-->";

export default function RootShell({ lang, children }: { lang: "fr" | "en"; children: React.ReactNode }) {
  return (
    <html lang={lang}>
      <body className={`${display.variable} ${serif.variable} ${body.variable}`}>
        <div hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: DIRECTION_NOTE }} />
        {children}
        {/* Mesure d'audience : visites, provenance, pays, appareil. Sans
            cookie ni identifiant persistant — le site n'a donc pas à demander
            de consentement. Le script ne part qu'une fois l'analytique
            activée côté Vercel ; sans cela, rien n'est envoyé.
            Les téléchargements du CV, eux, se comptent en base par la route
            « /cv » : un fichier statique n'exécute aucun script. */}
        <Analytics />
      </body>
    </html>
  );
}
