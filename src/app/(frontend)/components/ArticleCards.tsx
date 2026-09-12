"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { articleHref, formatDate, type Dict, type Locale } from "../lib/i18n";

type Cover = { src: string; alt: string; vector: boolean } | null;
export type ArticleCard = {
  id?: string | number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  cover: Cover;
};

/**
 * Rail des cartes « Articles & Réflexions ».
 *
 * Trois cartes visibles en grand écran, deux en tablette, une en téléphone.
 * Le défilement est celui du navigateur : le rail reste parcourable au doigt,
 * à la molette et au clavier même sans JavaScript. Les flèches ne sont qu'un
 * confort — elles n'apparaissent que lorsqu'il y a effectivement de quoi
 * défiler, plutôt que de rester là, grisées et inutiles.
 */
export default function ArticleCards({
  articles,
  locale,
  t,
}: {
  articles: ArticleCard[];
  locale: Locale;
  t: Dict;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [peutDefiler, setPeutDefiler] = useState(false);
  const [auDebut, setAuDebut] = useState(true);
  const [aLaFin, setALaFin] = useState(false);

  const jauger = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const debord = el.scrollWidth - el.clientWidth;
    setPeutDefiler(debord > 4);
    setAuDebut(el.scrollLeft <= 4);
    setALaFin(el.scrollLeft >= debord - 4);
  }, []);

  useEffect(() => {
    jauger();
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(jauger);
    ro.observe(el);
    el.addEventListener("scroll", jauger, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", jauger);
    };
  }, [jauger]);

  /**
   * Avance d'une carte, gouttière comprise.
   *
   * La cible est calculée et bornée explicitement plutôt que confiée à
   * `scrollBy` : combiné à l'accrochage, un déplacement relatif se faisait
   * ramener à son point de départ en cours de route.
   */
  const pousser = (sens: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const carte = el.querySelector<HTMLElement>(".art-card");
    const pas = carte ? carte.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    const max = el.scrollWidth - el.clientWidth;
    const cible = Math.max(0, Math.min(max, el.scrollLeft + sens * pas));
    el.scrollTo({ left: cible, behavior: "smooth" });
  };

  return (
    <div className="art-wrap">
      <div className="art-rail" ref={rail}>
        {articles.map((a, i) => (
          <article className="art-card reveal" key={a.id ?? a.slug}>
            <a className="art-link" href={articleHref(locale, a.slug)}>
              <span className="art-cover">
                {a.cover ? (
                  a.cover.vector ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="art-cover-svg" src={a.cover.src} alt={a.cover.alt} loading={i === 0 ? "eager" : "lazy"} />
                  ) : (
                    <Image
                      src={a.cover.src}
                      alt={a.cover.alt}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      priority={i === 0}
                      style={{ objectFit: "cover" }}
                    />
                  )
                ) : (
                  <span className="art-cover-empty" aria-hidden="true" />
                )}
              </span>
              <span className="art-body">
                <span className="art-meta">
                  <span className="art-cat">{a.category}</span>
                  <span className="art-date">{formatDate(a.date, locale)}</span>
                </span>
                <span className="art-title">{a.title}</span>
                <span className="art-excerpt">{a.excerpt}</span>
                <span className="art-foot">
                  <span className="art-author">{t.articleBy} {a.author}</span>
                  <span className="art-more arrow">{t.readArticle}</span>
                </span>
              </span>
            </a>
          </article>
        ))}
      </div>

      {peutDefiler && (
        <div className="art-nav">
          <button type="button" className="art-arrow" aria-label={t.previousArticles} onClick={() => pousser(-1)} disabled={auDebut}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
          <button type="button" className="art-arrow" aria-label={t.nextArticles} onClick={() => pousser(1)} disabled={aLaFin}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
