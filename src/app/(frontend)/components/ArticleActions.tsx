"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dict } from "../lib/i18n";

/**
 * Barre d'actions d'un article : vues, « j'aime », mise de côté, partage.
 *
 * Tout est rendu côté navigateur. Les pages d'articles sont prégénérées et
 * gardées une heure : un compteur rendu avec la page afficherait un chiffre
 * figé, parfois faux d'une heure. Le texte arrive donc en statique, immédiat,
 * et les nombres le rejoignent une fois la page affichée.
 *
 * Deux gardes vivent dans le navigateur du lecteur plutôt que sur le serveur,
 * faute de quoi il faudrait l'identifier pour les tenir :
 *
 * — une vue par article et par session, pour qu'un rafraîchissement répété ne
 *   gonfle pas le compteur ;
 * — l'état « j'aime », conservé localement, pour qu'un même lecteur ne compte
 *   qu'une fois.
 *
 * Cette honnêteté a sa contrepartie : quelqu'un qui vide son stockage peut
 * aimer deux fois. Sur un portfolio, mieux vaut ce défaut qu'un traçage.
 */

type Stats = { views: number; likes: number };

const clefVue = (slug: string) => `cos:vue:${slug}`;
const clefJaime = (slug: string) => `cos:jaime:${slug}`;
const clefFavori = (slug: string) => `cos:favori:${slug}`;

/** Lecture d'un stockage qui peut être refusé (navigation privée, réglages). */
function lireDrapeau(stockage: "local" | "session", clef: string): boolean {
  try {
    const s = stockage === "local" ? window.localStorage : window.sessionStorage;
    return s.getItem(clef) === "1";
  } catch {
    return false;
  }
}

function ecrireDrapeau(stockage: "local" | "session", clef: string, valeur: boolean) {
  try {
    const s = stockage === "local" ? window.localStorage : window.sessionStorage;
    if (valeur) s.setItem(clef, "1");
    else s.removeItem(clef);
  } catch {
    // Stockage refusé : l'action reste sans mémoire, la page fonctionne.
  }
}

export default function ArticleActions({
  slug,
  titre,
  url,
  minutes,
  t,
}: {
  slug: string;
  titre: string;
  url: string;
  minutes: number;
  t: Dict;
}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [jaime, setJaime] = useState(false);
  const [favori, setFavori] = useState(false);
  const [copie, setCopie] = useState(false);
  const [bat, setBat] = useState(false);

  // Premier passage : on relève les états locaux, on compte la vue si elle
  // n'a pas déjà été comptée dans cette session, puis on lit les totaux.
  useEffect(() => {
    setJaime(lireDrapeau("local", clefJaime(slug)));
    setFavori(lireDrapeau("local", clefFavori(slug)));

    let vivant = true;
    const dejaVu = lireDrapeau("session", clefVue(slug));

    const charger = async () => {
      try {
        const reponse = dejaVu
          ? await fetch(`/stats/${slug}`, { cache: "no-store" })
          : await fetch(`/stats/${slug}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "vue" }),
            });
        if (!dejaVu) ecrireDrapeau("session", clefVue(slug), true);
        const donnees = (await reponse.json()) as Stats;
        if (vivant && typeof donnees.views === "number") setStats(donnees);
      } catch {
        // Compteurs indisponibles : la barre s'affiche sans les nombres.
      }
    };
    charger();
    return () => {
      vivant = false;
    };
  }, [slug]);

  const basculerJaime = useCallback(async () => {
    const nouvel = !jaime;
    setJaime(nouvel);
    ecrireDrapeau("local", clefJaime(slug), nouvel);
    if (nouvel) {
      setBat(true);
      window.setTimeout(() => setBat(false), 420);
    }
    // Le compteur avance tout de suite à l'écran : attendre le serveur pour
    // un simple « j'aime » donnerait l'impression d'un bouton qui colle.
    setStats((s) => (s ? { ...s, likes: Math.max(0, s.likes + (nouvel ? 1 : -1)) } : s));
    try {
      const reponse = await fetch(`/stats/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nouvel ? "jaime" : "retirer-jaime" }),
      });
      const donnees = (await reponse.json()) as Stats;
      if (typeof donnees.likes === "number") setStats(donnees);
    } catch {
      // On garde l'affichage optimiste : le geste du lecteur reste visible.
    }
  }, [jaime, slug]);

  const basculerFavori = useCallback(() => {
    const nouvel = !favori;
    setFavori(nouvel);
    ecrireDrapeau("local", clefFavori(slug), nouvel);
  }, [favori, slug]);

  const copierLien = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopie(true);
    window.setTimeout(() => setCopie(false), 2000);
  }, [url]);

  const partageX = `https://x.com/intent/tweet?text=${encodeURIComponent(titre)}&url=${encodeURIComponent(url)}`;
  const partageWhatsApp = `https://wa.me/?text=${encodeURIComponent(`${titre} — ${url}`)}`;

  return (
    <div className="art-actions">
      <div className="art-actions-mesures">
        <span className="art-mesure" title={t.readingTime}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 7.5V12l3 1.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {minutes} {t.minRead}
        </span>

        <span className="art-mesure" title={t.views}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {stats ? stats.views.toLocaleString("fr-FR") : "—"}
        </span>
      </div>

      <div className="art-actions-boutons">
        <button
          type="button"
          className={"art-action" + (jaime ? " est-actif" : "") + (bat ? " bat" : "")}
          onClick={basculerJaime}
          aria-pressed={jaime}
          title={jaime ? t.liked : t.like}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"
              fill={jaime ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="art-action-nombre">{stats ? stats.likes : ""}</span>
          <span className="visuellement-cache">{jaime ? t.liked : t.like}</span>
        </button>

        <button
          type="button"
          className={"art-action" + (favori ? " est-actif" : "")}
          onClick={basculerFavori}
          aria-pressed={favori}
          title={favori ? t.saved : t.save}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6.5 4.5h11v15l-5.5-4-5.5 4v-15Z"
              fill={favori ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="visuellement-cache">{favori ? t.saved : t.save}</span>
        </button>

        <span className="art-actions-separateur" aria-hidden="true" />

        <button type="button" className="art-action" onClick={copierLien} title={t.copyLink}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.2 1.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.2-1.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="visuellement-cache">{t.copyLink}</span>
        </button>

        <a className="art-action" href={partageX} target="_blank" rel="noopener" title="X">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4l7.2 9.2L4.4 20H7l5.3-5.6L16.5 20H20l-7.5-9.6L19.6 4H17l-4.9 5.2L8.1 4H4Z" fill="currentColor" />
          </svg>
          <span className="visuellement-cache">X</span>
        </a>

        <a className="art-action" href={partageWhatsApp} target="_blank" rel="noopener" title="WhatsApp">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 3.8a8.2 8.2 0 0 0-7 12.4L4 20.2l4.1-1a8.2 8.2 0 1 0 3.9-15.4Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M9.3 8.6c.3-.1.6 0 .8.3l.7 1.1c.1.2.1.5-.1.7l-.4.4c.5 1 1.3 1.8 2.3 2.3l.4-.4c.2-.2.5-.2.7-.1l1.1.7c.3.2.4.5.3.8-.2.6-.8 1-1.5 1-2.6-.2-4.7-2.3-4.9-4.9 0-.7.3-1.3 1-1.5Z" fill="currentColor" />
          </svg>
          <span className="visuellement-cache">WhatsApp</span>
        </a>
      </div>

      {/* Confirmation annoncée aux lecteurs d'écran comme à l'œil. */}
      <span className={"art-copie" + (copie ? " vu" : "")} role="status" aria-live="polite">
        {copie ? t.linkCopied : ""}
      </span>
    </div>
  );
}
