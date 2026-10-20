import Interactions from "./Interactions";
import Projects from "./Projects";
import PublicationList from "./PublicationList";
import Image from "next/image";
import { getContent, getArticles, mediaUrl, mediaAlt, toProject, toArticleCard } from "../lib/content";
import LangSwitch from "./LangSwitch";
import ArticleCards from "./ArticleCards";
import ContactForm from "./ContactForm";
import { dict, type Locale } from "../lib/i18n";
import { SITE_URL } from "@/lib/site";
import type { Project } from "@/data/projects";

export default async function HomePage({ locale }: { locale: Locale }) {
  const [c, articles] = await Promise.all([getContent(locale), getArticles(locale)]);
  const t = dict(locale);
  const hero = c.hero as any;
  const about = c.about as any;
  const pub = c.publication as any;
  const pubItems = (pub.items ?? []) as any[];
  const firstPub = pubItems[0] ?? {};
  const expertise = c.expertise as any;
  const skills = c.skills as any;
  const stats = c.stats as any;
  const contact = c.contact as any;
  const site = c.site as any;
  const st = site.sectionTitles ?? {};

  const heroImg = mediaUrl(hero.image) ?? hero.imageSrc;
  const heroImgAlt = mediaAlt(hero.image) ?? hero.imageAlt ?? "";
  const portraitImg = mediaUrl(about.portrait) ?? about.portraitSrc;
  const portraitAlt = mediaAlt(about.portrait) ?? about.portraitAlt ?? "";

  // normalize CMS project docs into the component's shape
  const projects: Project[] = (c.projects as any[]).map(toProject);
  const shortCaption = (alt: string | undefined, fallback: string) => {
    const head = (alt ?? "").split(/[:,]/)[0].trim();
    return head && head.length <= 34 ? head : fallback;
  };
  // Le CV suit la langue du site : la route /cv sert la version anglaise sur « ?lang=en ».
  const cvHref = locale === "en" ? `${site.cvUrl}${String(site.cvUrl).includes("?") ? "&" : "?"}lang=en` : site.cvUrl;
  const programs = c.programs as any[];
  // Les programmes empruntent la fiche des projets : même rangée, même ouverture
  // animée, mêmes bulles d'outils. Seules les figures changent : montrées
  // entières, un graphique ou une capture de téléphone ne se recadre pas.
  const programProjects: Project[] = programs.map((p, i) => {
    const images = ((p.images ?? []) as any[]).flatMap((im) => {
      const src = mediaUrl(im.upload) ?? im.src;
      return src ? [{ src, alt: mediaAlt(im.upload) ?? im.alt ?? "" }] : [];
    });
    return {
      id: `programme-${p.id}`,
      index: String(i + 1).padStart(2, "0"),
      type: p.category,
      title: p.name,
      // Les outils sont déjà dans les bulles : pas de ligne de caractéristiques.
      specs: [],
      desc: p.summary,
      tags: String(p.stack).split("·").map((s) => s.trim()).filter(Boolean),
      images,
      // Légende courte, comme celle des projets : « Écran Parcours », pas la
      // description entière, qui couvrirait la figure sur téléphone.
      fieldLabel: shortCaption(images[0]?.alt, p.category),
      program: true,
      features: ((p.features ?? []) as any[]).map((f) => f.value),
      url: p.url ?? undefined,
    };
  });

  // Données structurées schema.org, construites depuis le CMS pour rester
  // synchronisées avec le contenu. Les DOI rendent les publications
  // vérifiables : c'est ce qui distingue un profil attesté d'une simple
  // page d'auto-déclaration.
  const personId = `${SITE_URL}#person`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.brand,
        jobTitle: hero.role ?? undefined,
        description: about.lead,
        url: SITE_URL,
        ...(contact.email ? { email: `mailto:${contact.email}` } : {}),
        ...(contact.phoneHref ? { telephone: contact.phoneHref } : {}),
        address: { "@type": "PostalAddress", addressLocality: "Dakar", addressCountry: "SN" },
        sameAs: [contact.linkedin, contact.github].filter(Boolean),
        knowsAbout: ((skills.technical ?? []) as any[]).map((k) => k.value),
      },
      ...((pub.items ?? []) as any[]).map((it) => ({
        "@type": "ScholarlyArticle",
        headline: it.title,
        ...(it.sub ? { description: it.sub } : {}),
        ...(it.doiUrl ? { url: it.doiUrl } : {}),
        ...(it.doi
          ? { identifier: { "@type": "PropertyValue", propertyID: "DOI", value: it.doi } }
          : {}),
        author: { "@id": personId },
        inLanguage: locale,
      })),
      {
        "@type": "WebSite",
        url: SITE_URL,
        name: site.brand,
        inLanguage: locale,
        about: { "@id": personId },
      },
    ],
  };

  /* Les numéros de section se suivent sans trou même quand une section est absente —
     « Articles & réflexions » ne s'affiche qu'une fois un premier texte publié. */
  let compteur = 0;
  const n = () => String(++compteur).padStart(2, "0");

  /* Cinq entrées seulement : l'accueil, le profil, les deux corps de preuve —
     les projets livrés et les textes — puis le contact. Recherche, expérience,
     compétences et formation restent des sections de la page, traversées au
     défilement : les nommer toutes rendrait le menu aussi long que le site.
     Le scrollspy n'observe que ces ancres, chacune restant active sur les
     sections qui la suivent. */
  const NAV: [string, string][] = [
    ["top", st.home],
    ["a-propos", st.aboutNav ?? st.about],
    ["projets", st.projectsNav ?? st.projects],
    ["articles", st.blogNav ?? "Blog"],
    ["contact", st.contactNav ?? st.contact],
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="topnav" id="topnav">
        <div className="wrap topnav-inner">
          <a href="#top" className="brand" aria-label={`${site.brand} — ${t.brandHome}`}>
            {site.brand}<span className="brand-mark">.</span>
          </a>
          <nav className="nav-links" aria-label={t.mainNav}>
            {NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
          <LangSwitch locale={locale} label={t.localeSwitchLabel} />
          {/* Trois barres plutôt qu'un dessin d'un seul trait : séparées, elles
              peuvent pivoter en croix pendant que le panneau se déroule. */}
          <button className="menu-toggle" id="menu-open" aria-label={t.openMenu} aria-controls="overlay-menu" aria-expanded={false}>
            <span className="menu-barres" aria-hidden="true">
              <span /><span /><span />
            </span>
          </button>
        </div>

        {/* Panneau déroulant, et non calque plein écran : placé dans l'en-tête,
            il s'ancre sous la barre sans qu'on ait à coder sa hauteur en dur, et
            reste un simple bandeau. Le CV et le sélecteur de langue n'y sont plus
            repris — ils tiennent désormais dans la barre elle-même. */}
        <div className="overlay-menu" id="overlay-menu" aria-label={t.menu} inert>
          <div className="wrap overlay-inner">
            <nav className="overlay-nav" aria-label={t.menu}>
              {NAV.map(([id, label], i) => (
                <a key={id} href={`#${id}`}><span className="on">{String(i + 1).padStart(2, "0")}</span>{label}</a>
              ))}
            </nav>
            <div className="overlay-foot">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <span>{contact.location}</span>
            </div>
          </div>
        </div>
      </header>

      <main id="content">
        {/* HERO */}
        <section className="section hero" id="top">
          <div className="wrap hero-grid">
            <div className="hero-top">
              <div>
                <p className="hero-folio">{hero.folioLabel}</p>
                <h1 className="hero-name">
                  {hero.nameLine1}<br />{hero.nameLine2}<br /><span className="accent">{hero.nameAccent}</span>
                </h1>
                {hero.role && <p className="hero-role">{hero.role}</p>}
                {hero.disciplines && <p className="hero-disciplines">{hero.disciplines}</p>}
                <p className="hero-sub">{hero.sub}</p>
                <div className="hero-actions">
                  <a className="btn btn-primary arrow" href="#projets">{t.seeProjects}</a>
                  <a className="btn btn-outline" href={cvHref} target="_blank" rel="noopener">{t.downloadMyCv}</a>
                </div>
              </div>
              {heroImg && (
                <div className="hero-media">
                  <div className="frame">
                    <Image src={heroImg} alt={heroImgAlt} fill priority sizes="(max-width: 900px) 100vw, 640px" style={{ objectFit: "cover" }} />
                  </div>
                  {(hero.imageCaption || hero.imageYear) && (
                    <div className="cap"><span>{hero.imageCaption}</span><span>{hero.imageYear}</span></div>
                  )}
                </div>
              )}
            </div>
            <div className="hero-strip">
              <div className="item"><span className="k">{t.status}</span><span className="v avail"><span className="dot" aria-hidden="true" />{hero.availability}</span></div>
              <div className="item"><span className="k">{t.location}</span><span className="v">{hero.location}</span></div>
              <div className="item"><span className="k">{t.domain}</span><span className="v">{hero.domain}</span></div>
            </div>
          </div>
        </section>

        {/* À PROPOS */}
        <section className="section band-paper2" id="a-propos">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.about}</h2></div></div>
            <div className="about-grid">
              <div className="reveal">
                <p className="about-lead">{about.lead}</p>
                {(about.body ?? []).map((b: any) => <p className="about-body" key={b.id ?? b.value}>{b.value}</p>)}
                <p className="about-stat">
                  <span>{about.statYears}</span> {about.statYearsText}{" "}
                  <span>{about.statProjects}</span> {about.statProjectsText}{" "}
                  <span>{about.statPublication}</span> {about.statPublicationText} — <em>{about.statNote}</em>
                </p>
                {(stats.items ?? []).length > 0 && (
                  <dl className="tally" aria-label={stats.title}>
                    {(stats.items as any[]).map((s) => {
                      const m = String(s.value).match(/^(\d+)(\D*)$/);
                      const num = m ? m[1] : s.value;
                      const suffix = m ? m[2] : "";
                      return (
                        <div className="tally-item" key={s.id ?? s.label}>
                          <dt className="tally-num">{num}<span className="tally-suffix">{suffix}</span></dt>
                          <dd className="tally-label">{s.label}</dd>
                        </div>
                      );
                    })}
                  </dl>
                )}
              </div>
              <div className="about-portrait reveal">
                {portraitImg && (
                  <div className="frame">
                    <Image src={portraitImg} alt={portraitAlt} fill sizes="(max-width: 900px) 100vw, 420px" style={{ objectFit: "cover" }} />
                  </div>
                )}
                <div className="facts">
                  {(about.facts ?? []).map((f: any) => (
                    <div className="row" key={f.id ?? f.k}><span className="k">{f.k}</span><span className="v">{f.v}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPÉRIENCE */}
        <section className="section" id="experience">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.experience}</h2></div></div>
            {/* Comme dans le CV : les expériences professionnelles d'abord, puis
                les activités indépendantes. Période à gauche, puis le poste,
                l'entreprise et les missions, derrière un filet vertical. */}
            <div className="xp-block">
              <h3 className="xp-block-title reveal">{t.professionalExperience}</h3>
              <div className="xp">
                {(c.experience as any[]).map((e) => (
                  <div className="xp-row reveal" key={e.id}>
                    <div className="xp-when">{e.when}</div>
                    <div className="xp-body">
                      <h4 className="xp-role">{e.role}</h4>
                      <p className="xp-org">{e.org}{e.city ? <span className="xp-city"> · {e.city}</span> : null}</p>
                      {e.summary && <p className="xp-summary">{e.summary}</p>}
                      <ul className="xp-points">{(e.points ?? []).map((pt: any) => <li key={pt.id ?? pt.value}>{pt.value}</li>)}</ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="xp-block">
              <h3 className="xp-block-title reveal">{t.independentWork}</h3>
              <div className="xp">
                {(c.freelance as any[]).map((f) => (
                  <div className="xp-row reveal" key={`fl-${f.id}`}>
                    <div className="xp-when">{f.when}</div>
                    <div className="xp-body">
                      <h4 className="xp-role">{f.title}</h4>
                      {/* La description résume ce que disent les missions : on ne
                          l'affiche qu'en l'absence de celles-ci. */}
                      {(f.points ?? []).length === 0 && f.body && <p className="xp-summary">{f.body}</p>}
                      <ul className="xp-points">{(f.points ?? []).map((pt: any) => <li key={pt.id ?? pt.value}>{pt.value}</li>)}</ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJETS */}
        <section className="section band-paper2" id="projets">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.projects}</h2></div></div>
            {/* Les projets « mis en avant » sont les études de structure : ils
                gardent la grande rangée. L'architecture suit, en grille serrée,
                pour ne pas brouiller le profil d'ingénieur structures. */}
            <Projects projects={projects.filter((p) => p.featured)} t={t} />
            {projects.some((p) => !p.featured) && (
              <div className="proj-group">
                <div className="proj-group-head reveal">
                  <h3 className="proj-group-title">{t.architectureGroup}</h3>
                </div>
                <Projects projects={projects.filter((p) => !p.featured)} t={t} compact />
              </div>
            )}
          </div>
        </section>

        {/* COMPÉTENCES */}
        <section className="section" id="competences">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.skills}</h2></div></div>
            {/* Deux colonnes : les domaines en tableau à gauche, les outils et les
                qualités dans un encadré à droite, qui reste visible au défilement.
                Les compétences sont saisies en une ligne séparée par des points
                médians : on les relie par « · ». */}
            <div className="skills-split">
              <table className="skills-table reveal">
                <thead>
                  <tr><th scope="col">{t.skillsDomain}</th><th scope="col">{t.skillsItems}</th></tr>
                </thead>
                <tbody>
                  {(skills.domains ?? []).map((d: any) => (
                    <tr key={d.id ?? d.title}>
                      <th scope="row" className="skills-domain">{d.title}</th>
                      <td className="skills-items">
                        {String(d.items ?? "").split("·").map((x: string) => x.trim()).filter(Boolean).join(" · ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <aside className="skills-aside reveal">
                {(skills.tools ?? []).length > 0 && (
                  <div>
                    <h3 className="skills-aside-title">{t.skillsTools}</h3>
                    <div className="tool-grid">
                      {(skills.tools as any[]).map((tool: any) => (
                        <span className={"tool" + (tool.key ? " key" : "")} key={tool.id ?? tool.name}>{tool.name}</span>
                      ))}
                    </div>
                    {skills.toolsNote && <p className="tools-note small-label">{skills.toolsNote}</p>}
                  </div>
                )}
                {(skills.personal ?? []).length > 0 && (
                  <div className="skills-aside-block">
                    <h3 className="skills-aside-title">{t.skillsQualities}</h3>
                    <ul className="skills-qualities">
                      {(skills.personal as any[]).map((x: any) => <li key={x.id ?? x.value}>{x.value}</li>)}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
        {/* RECHERCHE & OUTILS DE CALCUL — les programmes, puis les publications
            qu'ils ont servi à produire : CIRÉ va avec l'étude du pont,
            l'oscillation des portiques avec la dynamique. */}
        <section className="section band-paper2" id="recherche">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{t.researchAndTools}</h2></div></div>
            {programs.length > 0 && (
              <div id="programmes">
                <div className="proj-group-head reveal"><h3 className="proj-group-title">{st.programs ?? "Programmes"}</h3></div>
                {/* CIRÉ garde la grande rangée ; les programmes suivants passent en cartes. */}
                <Projects projects={programProjects.slice(0, 1)} t={t} />
                {programProjects.length > 1 && (
                  <div className="proj-group proj-group-tight">
                    <Projects projects={programProjects.slice(1)} t={t} compact />
                  </div>
                )}
              </div>
            )}
            <div className="proj-group">
              <div className="proj-group-head reveal"><h3 className="proj-group-title">{st.research}</h3></div>
              <div className="pub-panel">
                <PublicationList items={pubItems} t={t} />
              </div>
            </div>
          </div>
        </section>

        {/* FORMATION */}
        <section className="section" id="formation">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.education}</h2></div></div>
            <div className="edu">
              {(c.education as any[]).map((e) => (
                <div className="edu-row" key={e.id}>
                  <span className="edu-when">{e.when}</span>
                  <div><p className="edu-title">{e.title}</p><p className="edu-org">{e.org}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ARTICLES & RÉFLEXIONS */}
        {articles.length > 0 && (
          <section className="section band-paper2" id="articles">
            <div className="wrap">
              <div className="ed-head reveal">
                <p className="ed-index">{n()}</p>
                <div className="ed-head-text">
                  <h2 className="ed-title">{st.articles}</h2>
                  
                </div>
              </div>
              <ArticleCards articles={articles.map(toArticleCard)} locale={locale} t={t} />
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section className="section" id="contact">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.contact}</h2></div></div>
            <div className="contact">
              <div className="contact-intro reveal">
                <h3 className="contact-title">{contact.title}</h3>
                {contact.lead && <p className="contact-lead">{contact.lead}</p>}
                <div className="hero-actions" style={{ marginTop: 28 }}>
                  <a className="btn btn-ink arrow" href={`mailto:${contact.email}?subject=${encodeURIComponent(t.emailSubject)}`}>{t.writeEmail}</a>
                  <a className="btn btn-outline" href={cvHref} target="_blank" rel="noopener">{t.downloadCv}</a>
                </div>
              </div>
              <div className="contact-coords reveal">
                <div className="row"><div className="k">{t.email}</div><div className="v"><a className="link" href={`mailto:${contact.email}`}>{contact.email}</a></div></div>
                <div className="row"><div className="k">{t.phone}</div><div className="v"><a className="link" href={`tel:${contact.phoneHref}`}>{contact.phone}</a></div></div>
                <div className="row"><div className="k">{t.socials}</div><div className="v cc-links"><a className="link" href={contact.linkedin} target="_blank" rel="noopener">LinkedIn</a><a className="link" href={contact.github} target="_blank" rel="noopener">GitHub</a></div></div>
                <div className="row"><div className="k">{t.location}</div><div className="v">{contact.location}</div></div>
              </div>
              <ContactForm locale={locale} t={t} />
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-inner">
          <span>© {site.brand} · {new Date().getFullYear()}</span>
          <div className="foot-links">
            <a className="link" href={firstPub.doiUrl} target="_blank" rel="noopener">{t.zenodoPublication}</a>
            <a className="link" href={contact.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <a className="link" href={contact.github} target="_blank" rel="noopener">GitHub</a>
            {site.footerNote && <span>{site.footerNote}</span>}
          </div>
        </div>
      </footer>

      <Interactions />
    </>
  );
}
