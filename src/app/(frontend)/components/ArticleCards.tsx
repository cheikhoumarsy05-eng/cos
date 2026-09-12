import Image from "next/image";
import { articleCover } from "../lib/content";
import { articleHref, formatDate, type Dict, type Locale } from "../lib/i18n";

/**
 * Grille de cartes éditoriales de la section « Articles & Réflexions ».
 *
 * Trois colonnes en grand écran, deux en tablette, une en téléphone. Chaque
 * carte est un lien entier vers la page de l'article : la zone cliquable
 * couvre la couverture comme le texte, sans lien imbriqué.
 */
export default function ArticleCards({
  articles,
  locale,
  t,
}: {
  articles: any[];
  locale: Locale;
  t: Dict;
}) {
  return (
    <div className="art-grid">
      {articles.map((a, i) => {
        const cover = articleCover(a);
        return (
          <article className="art-card reveal" key={a.id ?? a.slug}>
            <a className="art-link" href={articleHref(locale, a.slug)}>
              <span className="art-cover">
                {cover ? (
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    priority={i === 0}
                    style={{ objectFit: "cover" }}
                  />
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
      })}
    </div>
  );
}
