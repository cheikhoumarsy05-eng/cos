export type ProjectImage = {
  /** WebP source in /public */
  src: string;
  /** JPEG fallback if present, else undefined */
  fallback?: string;
  alt: string;
};

export type Project = {
  id: string;
  index: string; // "01"
  type: string; // mono eyebrow line
  title: string;
  specs: { k: string; v: string }[];
  desc: string;
  tags: string[];
  /** Real renders; empty array => fall back to the blueprint field */
  images: ProjectImage[];
  /** Optional dimension label shown on the media field corner */
  fieldLabel: string;
  /** Mis en avant depuis le CMS : projet de calcul des structures */
  featured?: boolean;
  /** Les visuels sont des planches techniques et non des rendus. */
  drawings?: boolean;
};

export const projects: Project[] = [
  {
    id: "nafi-diom",
    index: "01",
    type: "Conception & modélisation 3D · R+2",
    title: "Maison Nafi Diom",
    specs: [
      { k: "Rôle", v: "Conception & modélisation" },
      { k: "Logiciel", v: "Archicad & Lumion" },
      { k: "Livrables", v: "Plans, façades, coupes, permis" },
    ],
    desc: "Villa individuelle R+2 à double volume : conception des façades, des volumes et de l'organisation des niveaux, jusqu'au dossier de permis de construire.",
    tags: ["Modélisation 3D", "Conception bâtiment", "Façades", "Permis de construire"],
    fieldLabel: "Rendu · façade principale",
    images: [
      { src: "/projects/nafi-1.webp", fallback: "/projects/nafi-1.jpg", alt: "Maison Nafi Diom — façade principale au crépuscule, double volume R+2 avec toiture-terrasse végétalisée" },
      { src: "/projects/nafi-2.webp", alt: "Maison Nafi Diom — vue de la façade, éclairage d'ambiance et garde-corps vitrés" },
      { src: "/projects/nafi-3.webp", alt: "Maison Nafi Diom — perspective des balcons et brise-soleil" },
      { src: "/projects/nafi-4.webp", alt: "Maison Nafi Diom — détail d'entrée et clôture paysagée" },
      { src: "/projects/nafi-5.webp", alt: "Maison Nafi Diom — vue rapprochée des menuiseries et de la végétation" },
      { src: "/projects/nafi-6.webp", alt: "Maison Nafi Diom — volume latéral et traitement de la terrasse" },
      { src: "/projects/nafi-7.webp", alt: "Maison Nafi Diom — perspective d'angle du bâtiment" },
    ],
  },
  {
    id: "dems-guediawaye",
    index: "02",
    type: "Étude structurelle complète · R+2",
    title: "Projet DEMS · R+2 Guédiawaye",
    specs: [
      { k: "Rôle", v: "Conception & calcul structure" },
      { k: "Outils", v: "Archicad · RSA · CBS · DDC" },
      { k: "Livrables", v: "Coffrages, ferraillages, rendus" },
    ],
    desc: "Projet de fin de formation : maison R+2 à Guédiawaye conduite de la conception 3D au dimensionnement complet — descente de charges, coffrages, ferraillage des poutres et longrines.",
    tags: ["Béton armé", "Descente de charges", "Ferraillage", "Plans d'exécution", "RSA"],
    fieldLabel: "Rendu · perspective rue",
    images: [
      { src: "/projects/dems-1.webp", alt: "Projet DEMS — perspective de rue au crépuscule, R+2 avec grande verrière cintrée" },
      { src: "/projects/dems-2.webp", alt: "Projet DEMS — façade éclairée, balcons filants" },
      { src: "/projects/dems-3.webp", alt: "Projet DEMS — détail de la verrière cintrée et de l'entrée" },
      { src: "/projects/dems-4.webp", alt: "Projet DEMS — vue latérale du bâtiment" },
      { src: "/projects/dems-5.webp", alt: "Projet DEMS — perspective des niveaux et garde-corps" },
      { src: "/projects/dems-6.webp", alt: "Projet DEMS — traitement de la clôture et paysagement" },
      { src: "/projects/dems-7.webp", alt: "Projet DEMS — vue d'ensemble en soirée" },
      { src: "/projects/dems-8.webp", alt: "Projet DEMS — perspective d'angle" },
    ],
  },
  {
    id: "villa-bamar",
    index: "03",
    type: "Modélisation & calcul structure",
    title: "Villa Bamar Mounass",
    specs: [
      { k: "Rôle", v: "Modélisation structure & ferraillage" },
      { k: "Outils", v: "Robot (RSA) · Revit" },
      { k: "Livrables", v: "Modèle 3D, plans de coffrage & ferraillage" },
    ],
    desc: "Modélisation structurelle complète sous Robot : descente de charges des poteaux, plans de coffrage des fondations et ferraillage des poteaux et semelles.",
    tags: ["Modélisation structure", "Robot Structural Analysis", "Fondations", "Ferraillage"],
    fieldLabel: "Coupe · fondation ferraillée",
    images: [],
  },
  {
    id: "4-studios",
    index: "04",
    type: "Conception & modélisation 3D",
    title: "4 Studios — Babacar Diouf",
    specs: [
      { k: "Rôle", v: "Conception & modélisation" },
      { k: "Logiciel", v: "Archicad" },
      { k: "Livrables", v: "Plans RDC, étage, terrasse" },
    ],
    desc: "Immeuble de quatre studios : organisation des plans du rez-de-chaussée à la terrasse et modélisation des volumes.",
    tags: ["Modélisation 3D", "Logements", "Plans"],
    fieldLabel: "Plan · niveau courant",
    images: [],
  },
  {
    id: "baay-mass",
    index: "05",
    type: "Conception & modélisation 3D",
    title: "Maison Baay Mass",
    specs: [
      { k: "Rôle", v: "Conception & modélisation" },
      { k: "Logiciel", v: "Archicad" },
      { k: "Livrables", v: "Plans RDC, étage, terrasse" },
    ],
    desc: "Maison individuelle : conception des niveaux et modélisation, du rez-de-chaussée à la terrasse.",
    tags: ["Modélisation 3D", "Conception bâtiment", "Plans"],
    fieldLabel: "Élévation · façade",
    images: [],
  },
];
