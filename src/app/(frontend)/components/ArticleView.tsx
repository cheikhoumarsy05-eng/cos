import Image from "next/image";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Interactions from "./Interactions";
import LangSwitch from "./LangSwitch";
import ArticleActions from "./ArticleActions";
import AideLecture from "./AideLecture";
import { getArticle, getContent, articleCover, tempsDeLecture, getArticleVoisins, toArticleCard } from "../lib/content";
import { dict, articleHref, localeHref, formatDate, type Locale } from "../lib/i18n";
import { SITE_URL } from "@/lib/site";

/**
 * Page d'un article, servie sous /articles/<slug> en français et
 * /en/articles/<slug> en anglais.
 *
 * Elle reprend l'en-tête du portfolio pour que le lecteur ne se sente pas
 * éjecté du site, mais la navigation à ancres de la page d'accueil n'a pas de
 * sens ici : elle est remplacée par un retour au portfolio, le sélecteur de
 * langue pointant vers le même article dans l'autre langue.
 */
export default async function ArticleView({ slug, locale }: { slug: string; locale: Locale }) {
  const [article, c, voisins] = await Promise.all([
    getArticle(slug, locale),
    getContent(locale),
    getArticleVoisins(slug, locale),
  ]);
  if (!article) notFound();

  const t = dict(locale);
  /* Un bandeau signale qu'on lit un brouillon : sans lui, on peut croire
     regarder le site public et s'étonner que personne ne voie l'article. */
  let enApercu = false;
  try {
    enApercu = (await draftMode()).isEnabled;
  } catch {
    // Prérendu : jamais en aperçu.
  }
  const site = (c.site as any) ?? {};
  const st = site.sectionTitles ?? {};
  const cover = articleCover(article);
  const published = formatDate((article as any).date, locale);
  const minutes = tempsDeLecture((article as any).content);
  /* Le plus récent d'abord : c'est l'ordre du site, et celui qu'on suit quand
     on continue à lire. */
  const suite = [voisins.suivant, voisins.precedent].filter(Boolean).map((d) => toArticleCard(d));
  const adresse = `${SITE_URL}${articleHref(locale, slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: (article as any).title,
    description: (article as any).excerpt,
    datePublished: (article as any).date,
    inLanguage: locale,
    author: { "@type": "Person", name: (article as any).author, url: SITE_URL },
    ...(cover ? { image: cover.src.startsWith("http") ? cover.src : `${SITE_URL}${cover.src}` } : {}),
    mainEntityOfPage: `${SITE_URL}${articleHref(locale, slug)}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="topnav topnav-article" id="topnav">
        <div className="wrap topnav-inner">
          <a href={localeHref(locale)} className="brand" aria-label={`${site.brand} — ${t.brandHome}`}>
            {site.brand}<span className="brand-mark">.</span>
          </a>
          <nav className="nav-links" aria-label={t.mainNav}>
            <a href={localeHref(locale)}>{t.backToPortfolio}</a>
            <a href={`${localeHref(locale)}#articles`}>{st.articles ?? t.articles}</a>
          </nav>
          <LangSwitch locale={locale} label={t.localeSwitchLabel} slug={slug} />
        </div>
      </header>

      <main id="content">
        {enApercu && (
          <p className="bandeau-apercu">
            <span>Aperçu — cet article n'est pas publié.</span>
            <a href={`/apercu/sortie?retour=${encodeURIComponent(articleHref(locale, slug))}`}>Quitter l'aperçu</a>
          </p>
        )}

        <article className="section article-page">
          <div className="wrap">
            <p className="article-back">
              <a className="link arrow-back" href={`${localeHref(locale)}#articles`}>{t.allArticles}</a>
            </p>

            <div className="article-head reveal">
              <p className="article-meta">
                <span className="art-cat">{(article as any).category}</span>
                <span className="art-date">{published}</span>
              </p>
              <h1 className="article-title">{(article as any).title}</h1>
              <p className="article-lead">{(article as any).excerpt}</p>
              <p className="article-byline">{t.articleBy} {(article as any).author}</p>
            </div>

            {/* Seule mesure utile avant d'ouvrir le texte : savoir combien de
                temps il demande. Le reste — vues, j'aime, partage — attend la
                fin de lecture, là où le geste a un sens. */}
            <p className="article-duree">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7.5V12l3 1.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {minutes} {t.minRead}
            </p>

            {cover && (
              <div className="article-cover reveal">
                {cover.vector ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="art-cover-svg" src={cover.src} alt={cover.alt} />
                ) : (
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 1100px) 100vw, 1000px"
                    priority
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
            )}

            <div className="article-body reveal">
              {/* `disableContainer` supprime la div d'emballage de RichText : sans cela les
                  nœuds ne sont pas enfants directs de .article-body et la règle d'espacement
                  entre blocs ne s'applique à rien — les paragraphes se touchent. */}
              <RichText data={(article as any).content} disableContainer />
            </div>

            <ArticleActions
              slug={slug}
              titre={(article as any).title}
              url={adresse}
              t={t}
            />

            {(article as any).linkedinUrl && (
              <p className="article-source reveal">
                <a className="link arrow" href={(article as any).linkedinUrl} target="_blank" rel="noopener">
                  {t.publishedOnLinkedin}
                </a>
              </p>
            )}

            {suite.length > 0 && (
              <section className="article-suite reveal" aria-label={t.keepReading}>
                <h2 className="article-suite-titre">{t.keepReading}</h2>
                <div className="article-suite-grille">
                  {suite.map((a) => (
                    /* Même carte que sur la page d'accueil — couverture, rubrique,
                       date, titre et accroche — simplement posée en hauteur : côte
                       à côte, le format horizontal de l'accueil serait écrasé. */
                    <article className="art-card" key={a.slug}>
                      <a className="art-link" href={articleHref(locale, a.slug)}>
                        <span className="art-cover">
                          {a.cover ? (
                            a.cover.vector ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img className="art-cover-svg" src={a.cover.src} alt={a.cover.alt} loading="lazy" />
                            ) : (
                              <Image src={a.cover.src} alt={a.cover.alt} fill sizes="(max-width: 820px) 100vw, 46vw" style={{ objectFit: "cover" }} />
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
                  ))}
                </div>
              </section>
            )}

            <p className="article-back article-back-end">
              <a className="link arrow-back" href={`${localeHref(locale)}#articles`}>{t.allArticles}</a>
            </p>
          </div>
        </article>
      </main>

      <AideLecture titre={(article as any).title} auteur={(article as any).author} url={adresse} t={t} />
      <Interactions />
    </>
  );
}
