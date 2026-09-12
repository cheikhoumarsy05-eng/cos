import Interactions from "./components/Interactions";
import Projects from "./components/Projects";
import PublicationCarousel from "./components/PublicationCarousel";
import Image from "next/image";
import { getContent, mediaUrl, mediaAlt, toProject } from "./lib/content";
import type { Project } from "@/data/projects";

// The homepage is statically prerendered for a fast TTFB. CMS edits appear
// immediately: every collection/global has an afterChange/afterDelete hook
// (src/hooks/revalidateHome.ts) that calls revalidatePath("/") on save, so the
// static entry is invalidated on demand. `revalidate` is only a safety-net
// fallback in case a write ever bypasses those hooks.
export const revalidate = 3600;

export default async function Home() {
  const c = await getContent();
  const hero = c.hero as any;
  const about = c.about as any;
  const pub = c.publication as any;
  const pubItems = (pub.items ?? []) as any[];
  const firstPub = pubItems[0] ?? {};
  const skills = c.skills as any;
  const stats = c.stats as any;
  const contact = c.contact as any;
  const site = c.site as any;
  const st = site.sectionTitles ?? {};

  const heroImg = mediaUrl(hero.image) ?? hero.imageSrc;
  const heroImgAlt = mediaAlt(hero.image) ?? hero.imageAlt;
  const portraitImg = mediaUrl(about.portrait) ?? about.portraitSrc;
  const portraitAlt = mediaAlt(about.portrait) ?? about.portraitAlt;

  // normalize CMS project docs into the component's shape
  const projects: Project[] = (c.projects as any[]).map(toProject);

  const NAV: [string, string][] = [
    ["a-propos", st.about], ["experience", st.experience], ["recherche", st.research],
    ["projets", st.projects], ["freelance", st.freelance],
    ["competences", st.skills], ["formation", st.education], ["contact", st.contact],
  ];

  return (
    <>
      <header className="topnav" id="topnav">
        <div className="wrap topnav-inner">
          <a href="#top" className="brand" aria-label={`${site.brand} — accueil`}>
            {site.brand}<span className="brand-mark">.</span>
          </a>
          <nav className="nav-links" aria-label="Navigation principale">
            {NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
          <a className="nav-cta" href={site.cvUrl} target="_blank" rel="noopener">CV</a>
          <button className="menu-toggle" id="menu-open" aria-label="Ouvrir le menu" aria-controls="overlay-menu">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18 M3 12h18 M3 17h18" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
          </button>
        </div>
      </header>

      <div className="overlay-menu" id="overlay-menu" aria-label="Menu plein écran" inert>
        <div className="overlay-menu-top">
          <span className="brand">{site.brand}<span className="brand-mark" style={{ color: "var(--accent)" }}>.</span></span>
          <button className="overlay-close" id="menu-close" aria-label="Fermer le menu">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
          </button>
        </div>
        <nav className="overlay-nav" aria-label="Menu">
          {NAV.map(([id, label], i) => (
            <a key={id} href={`#${id}`}><span className="on">{String(i + 1).padStart(2, "0")}</span>{label}</a>
          ))}
        </nav>
        <div className="overlay-foot">
          <a href={site.cvUrl} target="_blank" rel="noopener">Télécharger le CV</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <span>{contact.location}</span>
        </div>
      </div>

      <main id="content">
        {/* HERO */}
        <section className="section hero" id="top">
          <div className="wrap hero-grid">
            <div className="hero-top">
              <div>
                <p className="hero-folio"><span className="hero-folio-n">00</span>{hero.folioLabel}</p>
                <h1 className="hero-name">
                  {hero.nameLine1}<br />{hero.nameLine2} <span className="accent">{hero.nameAccent}</span>
                </h1>
                <p className="hero-sub">{hero.sub}</p>
                <div className="hero-actions">
                  <a className="btn btn-primary arrow" href="#projets">Voir les projets</a>
                  <a className="btn btn-outline" href={site.cvUrl} target="_blank" rel="noopener">Télécharger le CV</a>
                </div>
              </div>
              <div className="hero-media">
                <div className="frame">
                  <Image src={heroImg} alt={heroImgAlt} fill priority sizes="(max-width: 900px) 100vw, 640px" style={{ objectFit: "cover" }} />
                </div>
                <div className="cap"><span>{hero.imageCaption}</span><span>{hero.imageYear}</span></div>
              </div>
            </div>
            <div className="hero-strip">
              <div className="item"><span className="k">Statut</span><span className="v avail"><span className="dot" aria-hidden="true" />{hero.availability}</span></div>
              <div className="item"><span className="k">Localisation</span><span className="v">{hero.location}</span></div>
              <div className="item"><span className="k">Domaine</span><span className="v">{hero.domain}</span></div>
            </div>
          </div>
        </section>

        {/* À PROPOS */}
        <section className="section band-paper2" id="a-propos">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">01</p><div className="ed-head-text"><h2 className="ed-title">{st.about}</h2></div></div>
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
                <div className="frame">
                  <Image src={portraitImg} alt={portraitAlt} fill sizes="(max-width: 900px) 100vw, 420px" style={{ objectFit: "cover" }} />
                </div>
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
            <div className="ed-head reveal"><p className="ed-index">02</p><div className="ed-head-text"><h2 className="ed-title">{st.experience}</h2><p className="ed-lead">{st.experienceLead}</p></div></div>
            <div className="xp">
              {(c.experience as any[]).map((e) => (
                <div className="xp-row reveal" key={e.id}>
                  <div className="xp-when">{e.when}</div>
                  <div>
                    <h3 className="xp-role">{e.role}</h3>
                    <p className="xp-org">{e.org}</p>
                    <ul className="xp-points">{(e.points ?? []).map((pt: any) => <li key={pt.id ?? pt.value}>{pt.value}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RECHERCHE */}
        <section className="section band-ink" id="recherche">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">03</p><div className="ed-head-text"><h2 className="ed-title">{st.research}</h2></div></div>
            <PublicationCarousel items={pubItems} />
          </div>
        </section>

        {/* PROJETS */}
        <section className="section" id="projets">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">04</p><div className="ed-head-text"><h2 className="ed-title">{st.projects}</h2><p className="ed-lead">{st.projectsLead}</p></div></div>
            <Projects projects={projects} />
          </div>
        </section>

        {/* FREELANCE */}
        <section className="section band-paper2" id="freelance">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">05</p><div className="ed-head-text"><h2 className="ed-title">{st.freelance}</h2></div></div>
            <div className="free">
              {(c.freelance as any[]).map((f) => (
                <div className="free-item reveal" key={f.id}>
                  <div className="free-when">{f.when}</div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPÉTENCES */}
        <section className="section" id="competences">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">06</p><div className="ed-head-text"><h2 className="ed-title">{st.skills}</h2></div></div>
            <div className="skills-grid">
              <div className="reveal">
                <h3 className="subhead">{skills.technicalLabel}</h3>
                <ul className="skill-list">
                  {(skills.technical ?? []).map((s: any, i: number) => (
                    <li key={s.id ?? s.value}><span className="sn">{String(i + 1).padStart(2, "0")}</span><span>{s.value}</span></li>
                  ))}
                </ul>
              </div>
              <div className="reveal">
                <h3 className="subhead">{skills.toolsLabel}</h3>
                <div className="tool-grid">
                  {(skills.tools ?? []).map((t: any) => (
                    <span className={"tool" + (t.key ? " key" : "")} key={t.id ?? t.name}>{t.name}</span>
                  ))}
                </div>
                <p className="small-label" style={{ marginTop: 14 }}>{skills.toolsNote}</p>
                <h3 className="subhead" style={{ marginTop: 36 }}>{skills.personalLabel}</h3>
                <div className="softskills">
                  {(skills.personal ?? []).map((s: any) => <span className="s" key={s.id ?? s.value}>{s.value}</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FORMATION */}
        <section className="section band-paper2" id="formation">
          <div className="wrap">
            <div className="ed-head reveal"><p className="ed-index">07</p><div className="ed-head-text"><h2 className="ed-title">{st.education}</h2></div></div>
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
            <div className="ed-head reveal"><p className="ed-index">08</p><div className="ed-head-text"><h2 className="ed-title">{st.contact}</h2></div></div>
            <div className="contact">
              <div className="reveal">
                <h3 className="contact-title">{contact.title}</h3>
                <p className="contact-lead">{contact.lead}</p>
                <div className="hero-actions" style={{ marginTop: 28 }}>
                  <a className="btn btn-ink arrow" href={`mailto:${contact.email}?subject=${encodeURIComponent("Prise de contact — Ingénieur génie civil")}`}>Écrire un e-mail</a>
                  <a className="btn btn-outline" href={site.cvUrl} target="_blank" rel="noopener">Télécharger le CV</a>
                </div>
              </div>
              <div className="contact-coords reveal">
                <div className="row"><div className="k">E-mail</div><div className="v"><a className="link" href={`mailto:${contact.email}`}>{contact.email}</a></div></div>
                <div className="row"><div className="k">Téléphone</div><div className="v"><a className="link" href={`tel:${contact.phoneHref}`}>{contact.phone}</a></div></div>
                <div className="row"><div className="k">Réseaux</div><div className="v cc-links"><a className="link" href={contact.linkedin} target="_blank" rel="noopener">LinkedIn</a><a className="link" href={contact.github} target="_blank" rel="noopener">GitHub</a></div></div>
                <div className="row"><div className="k">Localisation</div><div className="v">{contact.location}</div></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-inner">
          <span>© Sancres.com · {new Date().getFullYear()}</span>
          <div className="foot-links">
            <a className="link" href={firstPub.doiUrl} target="_blank" rel="noopener">Publication Zenodo</a>
            <a className="link" href={contact.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <a className="link" href={contact.github} target="_blank" rel="noopener">GitHub</a>
            <span>{site.footerNote}</span>
          </div>
        </div>
      </footer>

      <Interactions />
    </>
  );
}
