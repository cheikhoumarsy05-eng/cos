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
  formTitle: "Écrire un message",
  formName: "Nom complet",
  formEmail: "E-mail",
  formMessage: "Message",
  formNamePlaceholder: "Votre nom complet",
  formEmailPlaceholder: "Votre adresse e-mail",
  formMessagePlaceholder: "Écrivez votre message",
  formSend: "Envoyer le message",
  formSending: "Envoi en cours…",
  formSent: "Message envoyé. Merci, je reviens vers vous rapidement.",
  formRequired: "Merci de remplir les trois champs.",
  formError: "L'envoi a échoué. Réessayez, ou écrivez-moi directement par e-mail.",
  emailSubject: "Prise de contact — Ingénieur génie civil",

  status: "Statut",
  location: "Localisation",
  domain: "Domaine",
  email: "E-mail",
  phone: "Téléphone",
  socials: "Réseaux",
  zenodoPublication: "Publication Zenodo",

  keyPoints: "Points clés",
  /* Intertitres de la section Expérience, dans l'ordre du CV : expériences
     professionnelles, activités indépendantes, puis engagement associatif. */
  independentWork: "Activités indépendantes",
  volunteering: "Engagement associatif",
  professionalExperience: "Expériences professionnelles",
  internships: "Stages & chantier",
  /* Intertitre des projets d'architecture, rangés sous les projets de
     structure dans une grille plus serrée. */
  architectureGroup: "Conception architecturale",
  researchAndTools: "Programmes et travaux de recherche",
  numLocale: "fr-FR",
  seeDemo: "Voir la démo",
  demoKind: "Démo interactive",
  demoDialog: "Démo interactive — {title}",
  demoTitle: "Oscillation libre d'un portique",
  tmdTitle: "Un train, une travée, un AMA",
  tmdLead: "Les essieux passent au rythme de la fréquence propre du tablier : la vibration s'amplifie à chaque essieu. À droite, un amortisseur à masse accordée oscille en opposition et la contient.",
  tmdWithout: "Sans AMA",
  tmdWith: "Avec AMA",
  tmdShort: "AMA",
  tmdPlotLabel: "Déplacement à mi-travée au passage du train, sans et avec AMA",
  tmdReadout: "Amplitude maximale réduite d'environ {r} %. Schéma de principe : tablier simple, premier mode, effet de l'AMA ramené à un amortissement équivalent.",
  demoLead: "Lâché après un déplacement en tête, le portique oscille puis s'arrête. Réglez l'amortissement et la hauteur pour voir combien de cycles il lui faut.",
  demoDamping: "Amortissement",
  demoStoreys: "Hauteur",
  demoReplay: "Relancer",
  demoReadout: "Période T ≈ {T} s · environ {n} cycles avant que l'amplitude ne tombe à 10 %. Animation ralentie, premier mode seul.",
  demoFrameLabel: "Portique en béton armé R+{n} en oscillation libre",
  demoPlotLabel: "Déplacement du dernier niveau en fonction du temps, avec son enveloppe exponentielle",
  keyResult: "Résultat clé",
  programFeatures: "Ce que fait le programme",
  programLink: "Voir le code sur GitHub",
  readPublication: "Lire la publication",
  skillsDomain: "Domaine",
  skillsItems: "Compétences / référentiels",
  skillsTools: "Outils",
  skillsQualities: "Qualités",

  seeRenders: "Voir les rendus",
  seeProject: "Voir le projet",
  seeDrawings: "Voir les planches",
  seeVisuals: "Voir les visuels",
  visuals: "visuels",
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
  articleBy: "Par",
  publishedOnLinkedin: "Publié initialement sur LinkedIn",
  backToPortfolio: "Retour au portfolio",
  allArticles: "Tous les articles",
  articleNotFound: "Article introuvable",
  requestDrawings: "Demander les plans",
  requestSubject: "Demande de plans — {title}",
  onRequest: "Plans, notes de calcul et modèles disponibles sur demande.",

  // Lecture d'un article : mesures, actions, partage et navigation.
  readingTime: "Temps de lecture",
  minRead: "min de lecture",
  like: "J'aime cet article",
  liked: "Article aimé",
  save: "Mettre de côté",
  saved: "Mis de côté",
  copyLink: "Copier le lien",
  linkCopied: "Lien copié",
  shareQuote: "Partager cette citation",
  quoteCopied: "Citation copiée",
  keepReading: "À lire aussi",
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
  formTitle: "Send a message",
  formName: "Full name",
  formEmail: "Email",
  formMessage: "Message",
  formNamePlaceholder: "Your full name",
  formEmailPlaceholder: "Your email address",
  formMessagePlaceholder: "Write your message",
  formSend: "Send the message",
  formSending: "Sending…",
  formSent: "Message sent. Thank you, I'll get back to you shortly.",
  formRequired: "Please fill in all three fields.",
  formError: "Sending failed. Please try again, or email me directly.",
  emailSubject: "Enquiry — Civil engineer",

  status: "Status",
  location: "Location",
  domain: "Field",
  email: "Email",
  phone: "Phone",
  socials: "Networks",
  zenodoPublication: "Zenodo publication",

  keyPoints: "Key points",
  independentWork: "Freelance work",
  volunteering: "Volunteering",
  professionalExperience: "Professional experience",
  internships: "Internships & site work",
  architectureGroup: "Architectural design",
  researchAndTools: "Programs and research work",
  numLocale: "en-GB",
  seeDemo: "See demo",
  demoKind: "Interactive demo",
  demoDialog: "Interactive demo — {title}",
  demoTitle: "Free vibration of a frame",
  tmdTitle: "A train, a span, a TMD",
  tmdLead: "The axles pass at the deck's natural frequency, so each one pumps the vibration up. On the right, a tuned mass damper swings out of phase and keeps it in check.",
  tmdWithout: "Without TMD",
  tmdWith: "With TMD",
  tmdShort: "TMD",
  tmdPlotLabel: "Mid-span displacement as the train passes, without and with a TMD",
  tmdReadout: "Peak amplitude reduced by about {r}%. Principle sketch: simple deck, first mode, the TMD's effect reduced to equivalent damping.",
  demoLead: "Released after a lateral push at the top, the frame sways and comes to rest. Adjust damping and height to see how many cycles it takes.",
  demoDamping: "Damping",
  demoStoreys: "Height",
  demoReplay: "Replay",
  demoReadout: "Period T ≈ {T} s · about {n} cycles before the amplitude drops to 10%. Slowed-down animation, first mode only.",
  demoFrameLabel: "R+{n} reinforced concrete frame in free vibration",
  demoPlotLabel: "Top-floor displacement over time, with its exponential envelope",
  keyResult: "Key result",
  programFeatures: "What it does",
  programLink: "View the code on GitHub",
  readPublication: "Read the publication",
  skillsDomain: "Area",
  skillsItems: "Skills / standards",
  skillsTools: "Tools",
  skillsQualities: "Qualities",

  seeRenders: "See renders",
  seeProject: "See project",
  seeDrawings: "See drawings",
  seeVisuals: "See visuals",
  visuals: "visuals",
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
  articleBy: "By",
  publishedOnLinkedin: "Originally published on LinkedIn",
  backToPortfolio: "Back to the portfolio",
  allArticles: "All articles",
  articleNotFound: "Article not found",
  requestDrawings: "Request drawings",
  requestSubject: "Drawing request — {title}",
  onRequest: "Drawings, design notes and models available on request.",

  readingTime: "Reading time",
  minRead: "min read",
  like: "Like this article",
  liked: "Article liked",
  save: "Save for later",
  saved: "Saved",
  copyLink: "Copy link",
  linkCopied: "Link copied",
  shareQuote: "Share this quote",
  quoteCopied: "Quote copied",
  keepReading: "More reading",
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
