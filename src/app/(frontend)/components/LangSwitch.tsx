"use client";

import { useEffect, useRef } from "react";
import { LOCALES, LOCALE_NAMES, localeHref, articleHref, type Locale } from "../lib/i18n";

/**
 * Sélecteur de langue : un bouton unique qui déroule la liste des langues.
 *
 * Bâti sur <details>, dont l'ouverture est native : sans JavaScript, le menu
 * s'ouvre et les liens restent atteignables — le reste du site étant lui aussi
 * servi sans dépendre du script, le sélecteur ne devait pas faire exception.
 * Le JavaScript n'ajoute que le confort : fermeture à l'Échap et au clic
 * en dehors.
 *
 * Les liens sont de vraies ancres vers « / » et « /en » : chaque langue a sa
 * propre mise en page racine (pour `<html lang>`), la navigation se fait donc
 * par chargement complet.
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
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = () => {
      if (ref.current?.open) ref.current.open = false;
    };
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !ref.current?.open) return;
      close();
      ref.current.querySelector<HTMLElement>("summary")?.focus();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <details className={"lang-switch" + (variant === "overlay" ? " lang-switch-overlay" : "")} ref={ref}>
      <summary className="lang-button" aria-label={label}>
        <span className="lang-code">{locale.toUpperCase()}</span>
        <svg className="lang-caret" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 4.5 L6 8 L9.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </summary>
      <ul className="lang-menu">
        {LOCALES.map((l) => (
          <li key={l}>
            <a
              className={"lang-option" + (l === locale ? " is-on" : "")}
              href={slug ? articleHref(l, slug) : localeHref(l)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
            >
              <span className="lang-option-code">{l.toUpperCase()}</span>
              {LOCALE_NAMES[l]}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
