import Image from "next/image";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Interactions from "./Interactions";
import LangSwitch from "./LangSwitch";
import { getArticle, getContent, articleCover } from "../lib/content";
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
  const [article, c] = await Promise.all([getArticle(slug, locale), getContent(locale)]);
  if (!article) notFound();

  const t = dict(locale);
  const site = (c.site as any) ?? {};
  const st = site.sectionTitles ?? {};
  const cover = articleCover(article);
  const published = formatDate((article as any).date, locale);

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
          <a className="nav-cta" href={site.cvUrl} target="_blank" rel="noopener">CV</a>
        </div>
      </header>

      <main id="content">
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

            {cover && (
              <div className="article-cover reveal">
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  fill
                  sizes="(max-width: 1100px) 100vw, 1000px"
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}

            <div className="article-body reveal">
              <RichText data={(article as any).content} />
            </div>

            {(article as any).linkedinUrl && (
              <p className="article-source reveal">
                <a className="link arrow" href={(article as any).linkedinUrl} target="_blank" rel="noopener">
                  {t.publishedOnLinkedin}
                </a>
              </p>
            )}

            <p className="article-back article-back-end">
              <a className="link arrow-back" href={`${localeHref(locale)}#articles`}>{t.allArticles}</a>
            </p>
          </div>
        </article>
      </main>

      <Interactions />
    </>
  );
}
