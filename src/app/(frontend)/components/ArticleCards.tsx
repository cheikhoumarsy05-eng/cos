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
            <span className="art-more arrow">{t.readArticle}</span>
          </span>
        </span>
      </a>
    </article>
  );
}

/**
 * « Articles & Réflexions », empilés — une carte par article, toutes visibles.
 *
 * Même raisonnement qu'en section 05 : le carrousel qui précédait n'exposait
 * que le premier article, et sur téléphone il se rate au scroll. La carte
 * garde sa mise en page en deux colonnes, seul l'empilement remplace le
 * défilement latéral.
 *
 * La signature n'est pas reprise ici : tout le site est celui de l'auteur.
 * Elle demeure sur la page de l'article, où elle a un sens.
 *
 * Sans état ni écouteur, le composant reste rendu sur le serveur.
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
  if (articles.length === 0) return null;

  return (
    <div className="art-wrap">
      {articles.map((a, i) => (
        <div className="art-item reveal" key={a.id ?? a.slug}>
          <p className="art-head"><span className="art-num">{String(i + 1).padStart(2, "0")}</span></p>
          <Carte a={a} i={i} locale={locale} t={t} />
        </div>
      ))}
    </div>
  );
}
