import Interactions from "./components/Interactions";
import Projects from "./components/Projects";
import { getContent, mediaUrl, mediaAlt, toProject } from "./lib/content";
import type { Project } from "@/data/projects";

export const revalidate = 60;

export default async function Home() {
  const c = await getContent();
  const hero = c.hero as any;
  const about = c.about as any;
  const pub = c.publication as any;
  const skills = c.skills as any;
  const contact = c.contact as any;
  const site = c.site as any;
  const st = site.sectionTitles ?? {};

  const projects: Project[] = (c.projects as any[]).map(toProject);

  const NAV: [string, string][] = [
    ["a-propos", st.about], ["experience", st.experience], ["recherche", st.research],
    ["projets", st.projects], ["competences", st.skills], ["contact", st.contact],
  ];

  return (
    <>
      <header className="topnav" id="topnav">
        <div className="wrap topnav-inner">
          <a href="#top" className="brand" aria-label={