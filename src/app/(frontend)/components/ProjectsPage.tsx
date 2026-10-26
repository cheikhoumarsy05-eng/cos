import Projects from "./Projects";
import SubPage from "./SubPage";
import { getContent, toProject } from "../lib/content";
import { dict, type Locale } from "../lib/i18n";
import type { Project } from "@/data/projects";

/* Page Projets : tous les projets. Les études de structure gardent la grande
   rangée ; l'architecture suit, en grille serrée, pour ne pas brouiller le
   profil d'ingénieur structures. L'accueil n'en montre qu'un aperçu. */
export default async function ProjectsPage({ locale }: { locale: Locale }) {
  const c = await getContent(locale);
  const t = dict(locale);
  const st = ((c.site as any) ?? {}).sectionTitles ?? {};
  const projects: Project[] = (c.projects as any[]).map(toProject);

  return (
    <SubPage locale={locale} path="projets" title={st.projects}>
      <Projects projects={projects.filter((p) => p.featured)} t={t} />
      {projects.some((p) => !p.featured) && (
        <div className="proj-group">
          <div className="proj-group-head reveal">
            <h2 className="proj-group-title">{t.architectureGroup}</h2>
          </div>
          <Projects projects={projects.filter((p) => !p.featured)} t={t} compact />
        </div>
      )}
    </SubPage>
  );
}
