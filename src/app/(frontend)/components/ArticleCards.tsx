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

/** Une carte article : couverture et corps, la carte entière étant le lien. */
function Carte({ a, i, locale, t }: { a: ArticleCard; i: number; locale: Locale; t: Dict }) {
  return (
    <article className="art-card">
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
                sizes="(max-width: 820px) 100vw, 46vw"
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
  );
}

/**
 * Carrousel « Articles & Réflexions ».
 *
 * Un article occupe toute la largeur et on passe au suivant par les flèches,
 * les points ou les touches directionnelles — même mécanique que la section
 * « Recherche appliquée », pour que les deux sections se manipulent pareil.
 *
 * Les touches ne sont écoutées que lorsque le focus se trouve dans le
 * carrousel : la section 05 pose un écouteur sur `window`, et deux écouteurs
 * globaux feraient avancer les deux carrousels d'un même appui.
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
  const [active, setActive] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const count = articles.length;
  const multiple = count > 1;

  const go = useCallback(
    (d: number) => setActive((i) => (i + d + count) % count),
    [count],
  );

  // La fenêtre prend la hauteur de la diapositive active : une carte plus
  // courte ne laisse donc pas de blanc sous elle.
  useEffect(() => {
    if (!multiple) return;
    const viewport = viewportRef.current;
    const mesurer = () => {
      const slide = slideRefs.current[active];
      if (viewport && slide) viewport.style.height = `${slide.offsetHeight}px`;
    };
    mesurer();
    const ro = new ResizeObserver(mesurer);
    slideRefs.current.forEach((s: HTMLDivElement | null) => s && ro.observe(s));
    window.addEventListener("resize", mesurer);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", mesurer);
    };
  }, [active, multiple]);

  const auClavier = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  if (count === 0) return null;
  if (!multiple) {
    return (
      <div className="art-wrap reveal">
        <Carte a={articles[0]} i={0} locale={locale} t={t} />
      </div>
    );
  }

  return (
    <div
      className="art-wrap reveal"
      role="group"
      aria-roledescription="carrousel"
      aria-label={t.articles}
      onKeyDown={auClavier}
    >
      <div className="art-viewport" ref={viewportRef}>
        <div className="art-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {articles.map((a, i) => (
            <div
              className="art-slide"
              key={a.id ?? a.slug}
              ref={(el) => { slideRefs.current[i] = el; }}
              aria-hidden={i !== active}
              inert={i !== active ? true : undefined}
            >
              <Carte a={a} i={i} locale={locale} t={t} />
            </div>
          ))}
        </div>
      </div>

      <div className="art-nav">
        <button type="button" className="art-arrow" aria-label={t.previousArticles} onClick={() => go(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
        <div className="art-dots" role="tablist" aria-label={t.articles}>
          {articles.map((a, i) => (
            <button
              type="button"
              key={a.id ?? a.slug}
              className={"art-dot" + (i === active ? " active" : "")}
              role="tab"
              aria-selected={i === active}
              aria-label={`${t.articles} ${i + 1} : ${a.title}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <span className="art-count" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <button type="button" className="art-arrow" aria-label={t.nextArticles} onClick={() => go(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
      </div>
    </div>
  );
}
