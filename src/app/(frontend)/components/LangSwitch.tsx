import { LOCALES, LOCALE_NAMES, localeHref, articleHref, type Locale } from "../lib/i18n";

/**
 * Bascule de langue : les deux codes, côte à côte.
 *
 * Les deux langues sont montrées plutôt que la seule courante — on voit d'un
 * coup d'œil que le site existe en anglais, ce qu'un bouton unique laissait
 * deviner. La langue lue se distingue par la graisse et la couleur pleine ;
 * l'autre, atténuée, est le lien.
 *
 * L'ordre reste FR puis EN quelle que soit la langue lue : un repère qui se
 * réordonne oblige à relire à chaque page.
 *
 * La langue courante n'est pas un lien : elle mène là où l'on se trouve
 * déjà. Rendu sur le serveur, sans état ni écouteur, la bascule fonctionne
 * même sans JavaScript.
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
  return (
    <span
      className={"lang-toggle" + (variant === "overlay" ? " lang-toggle-overlay" : "")}
      role="group"
      aria-label={label}
    >
      {LOCALES.map((code, i) => {
        const actuelle = code === locale;
        const contenu = code.toUpperCase();
        return (
          <span key={code} className="lang-part">
            {i > 0 && <span className="lang-sep" aria-hidden="true">/</span>}
            {actuelle ? (
              <span className="lang-code lang-code-actif" aria-current="true" lang={code}>
                {contenu}
              </span>
            ) : (
              <a
                className="lang-code"
                href={slug ? articleHref(code, slug) : localeHref(code)}
                hrefLang={code}
                lang={code}
                title={LOCALE_NAMES[code]}
              >
                {contenu}
              </a>
            )}
          </span>
        );
      })}
    </span>
  );
}
