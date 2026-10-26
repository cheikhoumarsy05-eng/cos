import Projects from "./Projects";
import SubPage from "./SubPage";
import { getContent, toProgramProjects } from "../lib/content";
import { dict, type Locale } from "../lib/i18n";
import type { Project } from "@/data/projects";

/* Page Programmes : tous les programmes, CIRÉ en grande rangée, les suivants
   en cartes. L'accueil n'en montre qu'un aperçu ; les travaux de recherche
   ont leur propre section sur l'accueil. */
export default async function ProgramsPage({ locale }: { locale: Locale }) {
  const c = await getContent(locale);
  const t = dict(locale);
  const st = ((c.site as any) ?? {}).sectionTitles ?? {};
  const programProjects: Project[] = toProgramProjects(c.programs as any[]);

  return (
    <SubPage locale={locale} path="programmes" title={st.programs ?? "Programmes"}>
      <Projects projects={programProjects.slice(0, 1)} t={t} />
      {programProjects.length > 1 && (
        <div className="proj-group proj-group-tight">
          <Projects projects={programProjects.slice(1)} t={t} compact />
        </div>
      )}
    </SubPage>
  );
}
