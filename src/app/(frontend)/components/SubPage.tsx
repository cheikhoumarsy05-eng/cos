import Interactions from "./Interactions";
import LangSwitch from "./LangSwitch";
import Monogram from "./Monogram";
import SiteFooter from "./SiteFooter";
import { getContent } from "../lib/content";
import { dict, localeHref, type Locale } from "../lib/i18n";

/**
 * Cadre des pages détaillées — /projets et /programmes, et leurs pendants
 * anglais. L'accueil n'en garde qu'un aperçu ; la liste complète vit ici.
 *
 * Même en-tête que les pages d'articles : la marque ramène à l'accueil, la
 * navigation à ancres de l'accueil est remplacée par un retour au portfolio,
 * et le sélecteur de langue mène à la même page dans l'autre langue.
 */
export default async function SubPage({
  locale,
  path,
  title,
  children,
}: {
  locale: Locale;
  /** Segment d'adresse commun aux deux langues : « projets » ou « programmes ». */
  path: string;
  title: string;
  children: React.ReactNode;
}) {
  const c = await getContent(locale);
  const t = dict(locale);
  const site = (c.site as any) ?? {};
  const contact = (c.contact as any) ?? {};
  const home = localeHref(locale);

  return (
    <>
      <header className="topnav topnav-article" id="topnav">
        <div className="wrap topnav-inner">
          <a href={home} className="brand" aria-label={`${site.brand} — ${t.brandHome}`}>
            <Monogram />
            <span className="brand-name">{site.brand}<span className="brand-mark">.</span></span>
          </a>
          <nav className="nav-links" aria-label={t.mainNav}>
            <a href={home}>{t.backToPortfolio}</a>
          </nav>
          <LangSwitch locale={locale} label={t.localeSwitchLabel} path={path} />
        </div>
      </header>

      <main id="content">
        <section className="section">
          <div className="wrap">
            <p className="subpage-back"><a className="link" href={home}>← {t.backToPortfolio}</a></p>
            <div className="ed-head reveal"><div className="ed-head-text"><h1 className="ed-title">{title}</h1></div></div>
            {children}
          </div>
        </section>
      </main>

      <SiteFooter site={site} contact={contact} />
      <Interactions />
    </>
  );
}
