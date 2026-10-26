import Image from "next/image";
import type { Locale } from "../lib/i18n";

/* Encadré « Logiciels » de la section Compétences : les logiciels saisis dans
   l'admin (Compétences → Outils & logiciels), rangés par famille, chacun avec
   son logo : les logiciels d'ingénierie d'abord, puis les outils de travail
   (programmation et bureautique). Les logos sont dans public/logos (PNG 160 px
   recadrés sur le symbole, fond transparent) ; Python garde son logo dessiné
   ici. Un logiciel inconnu du catalogue passe dans « Autres » avec une pastille
   à ses initiales. */

type Group = "eng" | "work" | "other";
// label : nom complet, en info-bulle ; short : nom affiché, court pour tenir sur une ligne.
type Entry = { label: string; short?: string; group: Group; logo: React.ReactNode };

const GROUPS: Record<Locale, Record<Group, string>> = {
  fr: { eng: "Ingénierie — logiciels principaux", work: "Outils de travail", other: "Autres outils" },
  en: { eng: "Engineering — main software", work: "Work tools", other: "Other tools" },
};

/* Pastille carrée façon icône d'application : une grande lettre et, en bas,
   le code court du logiciel sur un bandeau plus sombre. */
function Tile({ bg, band, letter, code }: { bg: string; band: string; letter: string; code: string }) {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <rect x="2" y="2" width="44" height="44" rx="5" fill={bg} />
      <path d="M2 35h44v6a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5z" fill={band} />
      <text x="24" y="28" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="22" fill="#fff">{letter}</text>
      <text x="24" y="43" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="7.5" letterSpacing="0.4" fill="#fff">{code}</text>
    </svg>
  );
}

function PythonLogo() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <path fill="#3776AB" d="M23.6 4c-9.8 0-9.2 4.3-9.2 4.3v4.4h9.4V14H10.7S4 13.3 4 23.7s5.8 10 5.8 10h3.5v-4.8s-.2-5.8 5.7-5.8h9.8s5.5.1 5.5-5.3V8.9S35.1 4 23.6 4zm-5.4 3.1a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z" />
      <path fill="#FFD43B" d="M24.4 44c9.8 0 9.2-4.3 9.2-4.3v-4.4h-9.4V34h13.1S44 34.7 44 24.3s-5.8-10-5.8-10h-3.5v4.8s.2 5.8-5.7 5.8h-9.8s-5.5-.1-5.5 5.3v8.9S12.9 44 24.4 44zm5.4-3.1a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4z" />
    </svg>
  );
}

const logo = (file: string) => <Image src={`/logos/${file}`} alt="" width={40} height={40} style={{ objectFit: "contain" }} />;

const CATALOG: Record<string, Entry> = {
  rsa: { label: "Autodesk Robot Structural Analysis", short: "Robot (RSA)", group: "eng", logo: logo("rsa.png") },
  cypecad: { label: "CYPECAD", group: "eng", logo: logo("cypecad.png") },
  graitec: { label: "Graitec", group: "eng", logo: logo("graitec.png") },
  cbs: { label: "Autodesk Concrete Building Structures", short: "CBS", group: "eng", logo: logo("cbs.png") },
  ddc: { label: "DDC", group: "eng", logo: logo("ddc.png") },
  matlab: { label: "MathWorks MATLAB", short: "MATLAB", group: "eng", logo: logo("matlab.png") },
  autocad: { label: "Autodesk AutoCAD", short: "AutoCAD", group: "eng", logo: logo("autocad.png") },
  revit: { label: "Autodesk Revit", short: "Revit", group: "eng", logo: logo("revit.png") },
  archicad: { label: "Graphisoft Archicad", short: "Archicad", group: "eng", logo: logo("archicad.png") },
  python: { label: "Python", group: "work", logo: <PythonLogo /> },
  vscode: { label: "Visual Studio Code", short: "VS Code", group: "work", logo: logo("vscode.png") },
  word: { label: "Microsoft Word", short: "Word", group: "work", logo: logo("word.png") },
  excel: { label: "Microsoft Excel", short: "Excel", group: "work", logo: logo("excel.png") },
  powerpoint: { label: "Microsoft PowerPoint", short: "PowerPoint", group: "work", logo: logo("powerpoint.png") },
  latex: { label: "LaTeX", group: "work", logo: logo("latex.svg") },
};

const keyOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

export default function SoftwareList({ tools, locale, title }: { tools: { id?: string; name: string }[]; locale: Locale; title: string }) {
  const items = tools.map((tool) => {
    const known = CATALOG[keyOf(tool.name)];
    const initials = tool.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
    return {
      id: tool.id ?? tool.name,
      ...(known ?? { label: tool.name, group: "other" as Group, logo: <Tile bg="#141414" band="#000" letter={initials.charAt(0)} code={initials} /> }),
    };
  });
  const groups = (Object.keys(GROUPS[locale]) as Group[])
    .map((g) => ({ g, list: items.filter((x) => x.group === g) }))
    .filter((x) => x.list.length > 0);
  if (groups.length === 0) return null;

  return (
    <div className="soft reveal">
      <div className="soft-head">
        <h3 className="soft-title">{title}</h3>
      </div>
      <div className="soft-box">
        {groups.map(({ g, list }, gi) => (
          <div className="soft-group" key={g}>
            <p className="soft-group-label">{GROUPS[locale][g]}</p>
            <ul className="soft-grid">
              {list.map((x, i) => (
                // --i : rang d'apparition, les logiciels du second lot venant après ceux du premier.
                <li className="soft-item" key={x.id} title={x.label} style={{ "--i": (gi === 0 ? 0 : groups[0].list.length) + i } as React.CSSProperties}>
                  <span className="soft-logo">{x.logo}</span>
                  <span className="soft-name">{x.short ?? x.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
