/**
 * Libellés d'interface, français et anglais.
 *
 * Ne contient QUE le mobilier de la page — boutons, en-têtes de tableau,
 * étiquettes d'accessibilité. Tout ce qui relève du contenu éditorial (titres
 * de sections, descriptions, expériences, projets) reste dans le CMS, traduit
 * via la localisation Payload. Mettre « Fermer » ou « Voir les rendus » dans
 * l'admin n'apporterait rien et alourdirait la saisie.
 */

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

/** Chemin de la page d'accueil pour une langue : le français reste à la racine. */
export function localeHref(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
}

/** Adresse d'un article dans une langue : /articles/x en français, /en/articles/x en anglais. */
export function articleHref(locale: Locale, slug: string): string {
  return locale === DEFAULT_LOCALE ? `/articles/${slug}` : `/${locale}/articles/${slug}`;
}

/** Date lisible, dans la langue de lecture. */
export function formatDate(value: string | Date, locale: Locale): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric", month: "long", year: "numeric",
  }).format(d);
}

/** Nom de chaque langue dans sa propre langue — jamais traduit. */
export const LOCALE_NAMES: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

/* Le français fait référence : le type `Dict` en dérive, et l'anglais doit en
   reprendre toutes les clés — une omission devient une erreur de compilation. */
const fr = {
  localeName: "Français",
  localeSwitchLabel: "Langue",
  toEnglish: "Passer en anglais",
  toFrench: "Passer en français",

  brandHome: "accueil",
  mainNav: "Navigation principale",
  openMenu: "Ouvrir le menu",
  menu: "Menu",

  downloadCv: "Télécharger le CV",
  downloadMyCv: "Télécharger mon CV",
  seeProjects: "Voir mes projets",
  writeEmail: "Écrire un e-mail",
  emailSubject: "Prise de contact — Ingénieur génie civil",

  status: "Statut",
  location: "Localisation",
  domain: "Domaine",
  email: "E-mail",
  phone: "Téléphone",
  socials: "Réseaux",
  zenodoPublication: "Publication Zenodo",

  keyPoints: "Points clés",
  keyResult: "Résultat clé",
  skillsDomain: "Domaine",
  skillsItems: "Compétences / référentiels",

  publications: "Publications",
  previousPublication: "Publication précédente",
  nextPublication: "Publication suivante",
  choosePublication: "Choisir une publication",

  seeRenders: "Voir les rendus",
  seeProject: "Voir le projet",
  seeDrawings: "Voir les planches",
  views: "vues",
  sheets: "planches",
  projectViews: "Vues du projet",
  projectSheets: "Planches du projet",
  previousView: "Vue précédente",
  nextView: "Vue suivante",
  close: "Fermer",
  openProject: "Ouvrir {title}",
  projectDialog: "Projet : {title}",
  viewLabel: "Vue {n} : {alt}",
  articles: "Articles & Réflexions",
  readArticle: "Lire l'article",
  previousArticles: "Articles précédents",
  nextArticles: "Articles suivants",
  articleBy: "Par",
  publishedOnLinkedin: "Publié initialement sur LinkedIn",
  backToPortfolio: "Retour au portfolio",
  allArticles: "Tous les articles",
  articleNotFound: "Article introuvable",
  requestDrawings: "Demander les plans",
  requestSubject: "Demande de plans — {title}",
  onRequest: "Plans, notes de calcul et modèles disponibles sur demande.",
};

const en: typeof fr = {
  localeName: "English",
  localeSwitchLabel: "Language",
  toEnglish: "Switch to English",
  toFrench: "Switch to French",

  brandHome: "home",
  mainNav: "Main navigation",
  openMenu: "Open menu",
  menu: "Menu",

  downloadCv: "Download CV",
  downloadMyCv: "Download my CV",
  seeProjects: "See my projects",
  writeEmail: "Send an email",
  emailSubject: "Enquiry — Civil engineer",

  status: "Status",
  location: "Location",
  domain: "Field",
  email: "Email",
  phone: "Phone",
  socials: "Networks",
  zenodoPublication: "Zenodo publication",

  keyPoints: "Key points",
  keyResult: "Key result",
  skillsDomain: "Area",
  skillsItems: "Skills / standards",

  publications: "Publications",
  previousPublication: "Previous publication",
  nextPublication: "Next publication",
  choosePublication: "Choose a publication",

  seeRenders: "See renders",
  seeProject: "See project",
  seeDrawings: "See drawings",
  views: "views",
  sheets: "drawings",
  projectViews: "Project views",
  projectSheets: "Project drawings",
  previousView: "Previous view",
  nextView: "Next view",
  close: "Close",
  openProject: "Open {title}",
  projectDialog: "Project: {title}",
  viewLabel: "View {n}: {alt}",
  articles: "Articles & Reflections",
  readArticle: "Read the article",
  previousArticles: "Previous articles",
  nextArticles: "Next articles",
  articleBy: "By",
  publishedOnLinkedin: "Originally published on LinkedIn",
  backToPortfolio: "Back to the portfolio",
  allArticles: "All articles",
  articleNotFound: "Article not found",
  requestDrawings: "Request drawings",
  requestSubject: "Drawing request — {title}",
  onRequest: "Drawings, design notes and models available on request.",
};

export type Dict = typeof fr;

const DICTS: Record<Locale, Dict> = { fr, en };

export function dict(locale: Locale): Dict {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}

/**
 * Remplace les jetons {clé} d'un libellé par leurs valeurs.
 *
 * Le dictionnaire ne contient que des chaînes, jamais de fonctions : il est
 * passé en props à des composants clients, et React refuse de sérialiser une
 * fonction à travers la frontière serveur → client. Les composants importent
 * donc `fmt` directement.
 */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
