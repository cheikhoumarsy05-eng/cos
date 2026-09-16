"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dict } from "../lib/i18n";

/**
 * Deux aides à la lecture d'un article : la progression et le partage d'une
 * phrase choisie.
 *
 * La progression se mesure sur le corps du texte, pas sur la page : compter
 * l'en-tête, la couverture et le pied donnerait une barre déjà bien avancée
 * au premier mot, et pleine avant la dernière ligne.
 *
 * Le partage de citation n'ajoute aucune barre d'outils permanente : il
 * n'apparaît que lorsqu'une phrase est sélectionnée, disparaît dès qu'on
 * reprend la lecture, et ne modifie jamais le texte.
 */

/** Position et texte d'une sélection en cours dans l'article. */
type Selection = { texte: string; x: number; y: number };

const MOTS_MINIMUM = 3;

export default function AideLecture({
  titre,
  auteur,
  url,
  t,
}: {
  titre: string;
  auteur: string;
  url: string;
  t: Dict;
}) {
  const [progression, setProgression] = useState(0);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [copie, setCopie] = useState(false);
  const image = useRef<number | null>(null);

  /* ── Progression ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const corps = document.querySelector<HTMLElement>(".article-body");
    if (!corps) return;

    const mesurer = () => {
      const r = corps.getBoundingClientRect();
      const hauteurLue = -r.top;
      // Le texte est « lu » quand son bas atteint le bas de l'écran : au-delà,
      // il ne reste que le pied de page.
      const course = r.height - window.innerHeight;
      const part = course <= 0 ? (r.top <= 0 ? 1 : 0) : hauteurLue / course;
      setProgression(Math.min(1, Math.max(0, part)));
      image.current = null;
    };

    // Le défilement déclenche bien plus souvent que l'écran ne se redessine :
    // on ne mesure qu'une fois par image.
    const auDefilement = () => {
      if (image.current === null) image.current = requestAnimationFrame(mesurer);
    };

    mesurer();
    window.addEventListener("scroll", auDefilement, { passive: true });
    window.addEventListener("resize", auDefilement, { passive: true });
    return () => {
      window.removeEventListener("scroll", auDefilement);
      window.removeEventListener("resize", auDefilement);
      if (image.current !== null) cancelAnimationFrame(image.current);
    };
  }, []);

  /* ── Citation sélectionnée ───────────────────────────────────────────── */
  useEffect(() => {
    const surRelachement = () => {
      const sel = window.getSelection();
      const texte = sel?.toString().trim() ?? "";

      // Trop court pour être une citation : on ne dérange pas.
      if (!sel || sel.isCollapsed || texte.split(/\s+/).length < MOTS_MINIMUM) {
        setSelection(null);
        return;
      }
      // Et seulement dans le corps de l'article.
      const corps = document.querySelector(".article-body");
      if (!corps || !corps.contains(sel.anchorNode)) {
        setSelection(null);
        return;
      }

      const rect = sel.getRangeAt(0).getBoundingClientRect();
      // Une sélection peut commencer hors de l'écran — on a fait défiler en
      // la gardant, ou elle couvre plusieurs paragraphes. Le bouton se
      // placerait alors au-dessus du bord supérieur, hors de vue.
      const dansEcran = rect.bottom > 60 && rect.top < window.innerHeight;
      if (!dansEcran) {
        setSelection(null);
        return;
      }
      setSelection({
        texte,
        x: Math.min(Math.max(rect.left + rect.width / 2, 90), window.innerWidth - 90),
        // Sous la sélection quand elle touche le haut de l'écran, au-dessus
        // sinon : le bouton ne doit jamais sortir par le haut.
        y: Math.max(rect.top, 74),
      });
    };

    const surDefilement = () => setSelection(null);

    document.addEventListener("mouseup", surRelachement);
    document.addEventListener("touchend", surRelachement);
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => {
      document.removeEventListener("mouseup", surRelachement);
      document.removeEventListener("touchend", surRelachement);
      window.removeEventListener("scroll", surDefilement);
    };
  }, []);

  const partagerCitation = useCallback(async () => {
    if (!selection) return;
    const texte = `« ${selection.texte} » — ${auteur}`;
    // Le partage natif du téléphone quand il existe, le presse-papier sinon.
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: titre, text: texte, url });
        setSelection(null);
        return;
      } catch {
        // Partage refusé ou annulé : on retombe sur la copie.
      }
    }
    try {
      await navigator.clipboard.writeText(`${texte}\n${url}`);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2000);
    } catch {
      return;
    }
    setSelection(null);
  }, [selection, auteur, titre, url]);

  return (
    <>
      <div className="lecture-progres" aria-hidden="true">
        <span style={{ transform: `scaleX(${progression})` }} />
      </div>

      {selection && (
        <button
          type="button"
          className="citation-partage"
          style={{ left: selection.x, top: selection.y }}
          onClick={partagerCitation}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5.5 20 12l-5 6.5M20 12H7.5M4 5.5v13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.shareQuote}
        </button>
      )}

      <span className={"art-copie art-copie-flottant" + (copie ? " vu" : "")} role="status" aria-live="polite">
        {copie ? t.quoteCopied : ""}
      </span>
    </>
  );
}
