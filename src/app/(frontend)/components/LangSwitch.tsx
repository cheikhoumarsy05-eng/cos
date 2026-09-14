import { LOCALES, LOCALE_NAMES, localeHref, articleHref, type Locale } from "../lib/i18n";

/**
 * Bascule de langue : un seul geste.
 *
 * Le site n'a que deux langues ; un menu déroulant demandait trois actions
 * — ouvrir, viser, cliquer — pour un choix binaire. Le bouton affiche la
 * langue courante et mène à l'autre : une pression suffit, et le code
 * affiché change pour refléter la nouvelle langue.
 *
 * Plus d'état ni d'écouteur : le composant est rendu sur le serveur, et la
 * bascule fonctionne sans JavaScript. Les liens restent de vraies ancres vers
 * « / » et « /en », chaque langue ayant sa propre mise en page racine.
 */
export default function LangSwitch({
  locale,
  label,
  variant = "topnav",
  slug,
}: {
  locale: Locale;
  label: string;
  variant?: "topnav" | "overlay";
  /** Sur une page d'article, bascule vers le même article dans l'autre langue. */
  slug?: string;
}) {
  const autre = LOCALES.find((l) => l !== locale) ?? locale;
  const href = slug ? articleHref(autre, slug) : localeHref(autre);

  return (
    <a
      className={"lang-toggle" + (variant === "overlay" ? " lang-toggle-overlay" : "")}
      href={href}
      hrefLang={autre}
      lang={autre}
      aria-label={`${label} — ${LOCALE_NAMES[autre]}`}
      title={LOCALE_NAMES[autre]}
    >
      <span className="lang-code" aria-hidden="true">{locale.toUpperCase()}</span>
    </a>
  );
}
