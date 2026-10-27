import Interactions from "./Interactions";
import AutoScroll from "./AutoScroll";
import Projects from "./Projects";
import PublicationList from "./PublicationList";
import Image from "next/image";
import { getContent, getArticles, mediaUrl, mediaAlt, toProject, toProgramProjects, toArticleCard } from "../lib/content";
import LangSwitch from "./LangSwitch";
import ArticleCards from "./ArticleCards";
import ContactForm from "./ContactForm";
import ServiceIcon from "./ServiceIcons";
import ServiceContact from "./ServiceContact";
import { association } from "../lib/associations";
import SocialIcon, { type Social } from "./SocialIcons";
import SkillIcon from "./SkillIcons";
import Monogram from "./Monogram";
import SiteFooter from "./SiteFooter";
import SoftwareList from "./SoftwareList";
import { dict, pageHref, type Locale } from "../lib/i18n";
import { SITE_URL } from "@/lib/site";
import type { Project } from "@/data/projects";

export default async function HomePage({ locale }: { locale: Locale }) {
  const [c, articles] = await Promise.all([getContent(locale), getArticles(locale)]);
  const t = dict(locale);
  const hero = c.hero as any;
  const about = c.about as any;
  const pub = c.publication as any;
  const pubItems = (pub.items ?? []) as any[];
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
  // Le CV suit la langue du site : la route /cv sert la version anglaise sur « ?lang=en ».
  const cvHref = locale === "en" ? `${site.cvUrl}${String(site.cvUrl).includes("?") ? "&" : "?"}lang=en` : site.cvUrl;
  const programProjects: Project[] = toProgramProjects(c.programs as any[]);

  // Frise de la section Expérience : les expériences professionnelles.
  // Les activités indépendantes (collection `freelance`) forment la section
  // « Mes services », l'engagement associatif (`volunteering`) la section « Associatif ».
  type TimelineItem = { key: string; when: string; title: string; org?: string; desc?: string; figure?: string; figureLabel?: string };
  const place = (org?: string, city?: string) => [org, city].filter(Boolean).join(" · ") || undefined;
  const timelineGroups = ([
    { key: "pro", title: t.professionalExperience, items: (c.experience as any[]).map((e): TimelineItem => ({ key: `xp-${e.id}`, when: e.when, title: e.role, org: place(e.org, e.city), desc: e.summary, figure: e.figure, figureLabel: e.figureLabel })) },
  ]).filter((g) => g.items.length > 0);

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
        sameAs: [contact.linkedin, contact.github, contact.instagram].filter(Boolean),
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
            <Monogram />
            <span className="brand-name">{site.brand}<span className="brand-mark">.</span></span>
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
          </div>
        </section>

        {/* À PROPOS */}
        <section className="section band-paper2" id="a-propos">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.about}</h2></div></div>
            <div className="about-grid">
              <div className="reveal">
                {(about.body ?? []).map((b: any) => <p className="about-body" key={b.id ?? b.value}>{b.value}</p>)}
                <p className="about-cv"><a className="btn btn-ink arrow" href={cvHref} target="_blank" rel="noopener">{t.downloadMyCv}</a></p>
                {/* Les chiffres « 4 expériences… 20+ projets… 3 travaux » (champs
                    stat* de l'admin) ont laissé place au texte de présentation,
                    saisi dans les Paragraphes. Les champs restent en base. */}
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
            {/* Expérience professionnelle, sans intertitre puisque c'est le seul
                bloc de la section, en frise verticale : une carte par poste, le chiffre fort à
                gauche, la date au-dessus de l'intitulé, une phrase de description.
                Un point creux signale une activité en cours. Les missions
                détaillées restent dans l'admin. */}
            {timelineGroups.map((g) => (
              <div className="xp-block" key={g.key}>
                <ol className="tl">
                  {g.items.map((it) => (
                    <li className={"tl-item reveal" + (/en cours|present|ongoing/i.test(it.when) ? " is-ongoing" : "")} key={it.key}>
                      <span className="tl-dot" aria-hidden="true" />
                      <div className="tl-card">
                        {it.figure && (
                          <p className="tl-fig"><span className="tl-num">{it.figure}</span>{it.figureLabel && <span className="tl-fig-label">{it.figureLabel}</span>}</p>
                        )}
                        <div className="tl-body">
                          <p className="tl-when">{it.when}</p>
                          <h4 className="tl-role">{it.title}</h4>
                          {it.org && <p className="tl-org">{it.org}</p>}
                          {it.desc && <p className="tl-desc">{it.desc}</p>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* MES SERVICES — les activités indépendantes présentées comme une
            offre : une carte par service, son icône, son titre et un court
            texte (champ Description de l'admin) ; les Missions, en liste, ne
            sont pas affichées. Le bouton « Demander un service » ouvre une
            fenêtre WhatsApp / e-mail. */}
        {(c.freelance as any[]).length > 0 && (
          <section className="section" id="services">
            <div className="wrap">
              <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{t.services}</h2></div></div>
              <div className="srv-list">
                {(c.freelance as any[]).map((f) => (
                  <article className="srv-card reveal" key={f.id}>
                    <div className="srv-top">
                      <ServiceIcon title={f.title} />
                      <h3 className="srv-title">{f.title}</h3>
                    </div>
                    {f.body && <p className="srv-text">{f.body}</p>}
                  </article>
                ))}
              </div>
              <ServiceContact phone={String(contact.phoneHref ?? contact.phone ?? "")} email={contact.email} t={t} />
            </div>
          </section>
        )}

        {/* ASSOCIATIF — une carte par association : la photo en bannière, le
            nom, la description, puis « En savoir plus » vers son site. La photo
            et le lien sont dans ASSOCIATIONS (lib/associations.ts), rangés par
            nom d'association. */}
        {(c.volunteering as any[]).length > 0 && (
          <section className="section" id="associatif">
            <div className="wrap">
              <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{t.associatif}</h2></div></div>
              <div className="asso-list">
                {(c.volunteering as any[]).map((v) => {
                  const a = association(v.org);
                  return (
                    <article className="asso-card reveal" key={v.id}>
                      <div className="asso-photo">
                        {a?.photo
                          ? <Image src={a.photo} alt={a.photoAlt ?? v.org} fill sizes="(max-width: 760px) 100vw, 640px" style={{ objectFit: "cover" }} />
                          : <span className="asso-photo-vide" aria-hidden="true">{v.org}</span>}
                      </div>
                      <div className="asso-corps">
                        <p className="asso-meta">{[v.role, v.when].filter(Boolean).join(" · ")}</p>
                        <h3 className="asso-nom">{v.org}</h3>
                        {v.summary && <p className="asso-desc">{v.summary}</p>}
                        {a?.url && <a className="btn btn-outline asso-btn" href={a.url} target="_blank" rel="noopener">{t.learnMore}</a>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* PROJETS */}
        <section className="section band-paper2" id="projets">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.projects}</h2></div></div>
            {/* Aperçu : les études de structure, en cartes (défilement latéral
                sur téléphone). La liste complète, architecture comprise, est sur
                la page Projets. */}
            <div className="hscroll">
              <Projects projects={projects.filter((p) => p.featured)} t={t} compact />
            </div>
            <p className="see-all reveal"><a className="btn btn-outline arrow" href={pageHref(locale, "projets")}>{t.seeAllProjects}</a></p>
          </div>
        </section>

        {/* COMPÉTENCES */}
        <section className="section" id="competences">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.skills}</h2></div></div>
            {/* Les compétences d'abord : les domaines en tableau sur toute la
                largeur. Les logiciels ferment la
                section, rangés par famille avec leur logo. Les compétences sont
                saisies en une ligne séparée par des points médians : on les relie
                par « · ». */}
            <table className="skills-table reveal">
              <thead>
                <tr><th scope="col">{t.skillsDomain}</th><th scope="col">{t.skillsItems}</th></tr>
              </thead>
              <tbody>
                {(skills.domains ?? []).map((d: any, i: number) => (
                  <tr key={d.id ?? d.title}>
                    <th scope="row" className="skills-domain"><span className="skills-domain-in"><SkillIcon index={i} /><span>{d.title}</span></span></th>
                    <td className="skills-items">
                      {String(d.items ?? "").split("·").map((x: string) => x.trim()).filter(Boolean).join(" · ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <SoftwareList tools={skills.tools ?? []} locale={locale} title={t.software} />
          </div>
        </section>
        {/* PROGRAMMES — aperçu en cartes courtes, sans les outils (défilement
            latéral sur téléphone). Grandes figures et démonstrations détaillées
            sont sur la page Programmes. */}
        {programProjects.length > 0 && (
          <section className="section band-paper2" id="programmes">
            <div className="wrap">
              <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.programs ?? "Programmes"}</h2></div></div>
              <div className="hscroll preview">
                <Projects projects={programProjects} t={t} compact />
              </div>
              <p className="see-all reveal"><a className="btn btn-outline arrow" href={pageHref(locale, "programmes")}>{t.seeAllPrograms}</a></p>
            </div>
          </section>
        )}

        {/* TRAVAUX DE RECHERCHE — les publications, en cartes côte à côte
            (défilement latéral sur téléphone). */}
        {pubItems.length > 0 && (
          <section className="section" id="recherche">
            <div className="wrap">
              <div className="ed-head reveal"><p className="ed-index">{n()}</p><div className="ed-head-text"><h2 className="ed-title">{st.research}</h2></div></div>
              <div className="pub-panel hscroll">
                <PublicationList items={pubItems} t={t} />
              </div>
            </div>
          </section>
        )}

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
                <div className="row"><div className="k">{t.location}</div><div className="v">{contact.location}</div></div>
                {/* Réseaux en icônes, WhatsApp compris — le numéro est celui du champ Téléphone. */}
                <div className="row"><div className="k">{t.socials}</div><div className="v contact-socials">
                  {([
                    ["LinkedIn", contact.linkedin],
                    ["GitHub", contact.github],
                    ["Instagram", contact.instagram],
                    ["WhatsApp", contact.phoneHref && `https://wa.me/${String(contact.phoneHref).replace(/\D/g, "")}`],
                  ] as [Social, string | undefined][]).filter(([, href]) => href).map(([name, href]) => (
                    <a className="contact-social" key={name} href={href} target="_blank" rel="noopener" aria-label={name} title={name}>
                      <SocialIcon name={name} size={22} />
                    </a>
                  ))}
                </div></div>
              </div>
              <ContactForm locale={locale} t={t} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter site={site} contact={contact} />

      <Interactions />
      <AutoScroll />
    </>
  );
}
