import config from "@payload-config";
import { getPayload } from "payload";
import { projects as projectData } from "./data/projects.js";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "cheikhoumarsy05@gmail.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "changeme123";

const run = async () => {
  const payload = await getPayload({ config });

  // 1. admin user
  const existing = await payload.find({ collection: "users", limit: 1 });
  if (existing.totalDocs === 0) {
    await payload.create({
      collection: "users",
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "Cheikh Oumar Sy" },
    });
    payload.logger.info(`Admin user created: ${ADMIN_EMAIL}`);
  }

  // 2. projects (from the existing data module — single source of truth)
  const existingProjects = await payload.find({ collection: "projects", limit: 1 });
  if (existingProjects.totalDocs === 0) {
    await Promise.all(projectData.map((p, order) => payload.create({
      collection: "projects",
      data: {
        index: p.index, order, type: p.type, title: p.title, fieldLabel: p.fieldLabel, desc: p.desc,
        specs: p.specs.map((s) => ({ k: s.k, v: s.v })),
        tags: p.tags.map((value) => ({ value })),
        images: p.images.map((im) => ({ src: im.src, fallback: im.fallback, alt: im.alt })),
      },
    })));
    payload.logger.info(`Seeded ${projectData.length} projects`);
  }

  // 3. experience
  if ((await payload.find({ collection: "experience", limit: 1 })).totalDocs === 0) {
    const xp = [
      { when: "Juin–Août 2026 · Août–Oct 2025", role: "Stagiaire Ingénieur — Bureau de Contrôle Technique", org: "SEATEC Sénégal", points: ["Vérification des plans de coffrage et de ferraillage selon le BAEL.", "Vérification des notes de calcul sous Robot Structural Analysis (RSA).", "Contrôle qualité sur chantier et rédaction de rapports techniques."] },
      { when: "Août–Sept 2024", role: "Stagiaire Conducteur de Travaux — Plomberie", org: "SENTRA BTP SA", points: ["Suivi des travaux de plomberie sur un programme de 222 villas.", "Supervision du gros œuvre d'une villa R+3."] },
      { when: "Juin–Juil 2023", role: "Stagiaire Conducteur de Travaux", org: "SENTRA BTP SA", points: ["Fondations d'un immeuble R+7 avec sous-sol.", "Coordination des équipes sur site."] },
    ];
    await Promise.all(xp.map((e, order) => payload.create({ collection: "experience", data: { order, when: e.when, role: e.role, org: e.org, points: e.points.map((value) => ({ value })) } })));
    payload.logger.info("Seeded experience");
  }

  // 4. freelance
  if ((await payload.find({ collection: "freelance", limit: 1 })).totalDocs === 0) {
    const fr = [
      { when: "2026 — en cours", title: "Concepteur freelance — Béton armé", body: "Production de plans d'exécution, vérification de conformité et rédaction de rapports techniques pour des projets en béton armé." },
      { when: "2026 — en cours", title: "Formateur en logiciels de calcul de structures", body: "Formation en ligne à la prise en main des logiciels, à la modélisation et l'analyse de bâtiments en béton armé, au dimensionnement et à la production de plans d'exécution." },
    ];
    await Promise.all(fr.map((f, order) => payload.create({ collection: "freelance", data: { order, ...f } })));
    payload.logger.info("Seeded freelance");
  }

  // 5. education
  if ((await payload.find({ collection: "education", limit: 1 })).totalDocs === 0) {
    const ed = [
      { when: "2023 — 2026", title: "Ingénieur de Conception en Génie Civil (DIC3)", org: "IPSL — Saint-Louis, Sénégal" },
      { when: "2021 — 2023", title: "Diplôme Supérieur de Technologie", org: "ESP — Dakar, Sénégal" },
      { when: "2021", title: "Baccalauréat Scientifique S1", org: "Lycée Maba Diakhou BA" },
    ];
    await Promise.all(ed.map((e, order) => payload.create({ collection: "education", data: { order, ...e } })));
    payload.logger.info("Seeded education");
  }

  // 6. globals
  await payload.updateGlobal({ slug: "hero", data: {
    folioLabel: "Portfolio · Ingénieur Structures",
    nameLine1: "Cheikh", nameLine2: "Oumar", nameAccent: "Sy",
    sub: "Ingénieur en génie civil — structures. Du calcul au plan d'exécution : béton armé, charpente métallique, dynamique.",
    imageSrc: "/projects/nafi-1.webp", imageFallback: "/projects/nafi-1.jpg",
    imageAlt: "Maison Nafi Diom — villa R+2, façade principale au crépuscule",
    imageCaption: "Maison Nafi Diom · R+2 · Archicad & Lumion", imageYear: "2024",
    availability: "Disponible — stage 4 à 6 mois", location: "Dakar, Sénégal",
    domain: "Béton armé · Charpente métallique · Dynamique",
  } });

  await payload.updateGlobal({ slug: "about", data: {
    lead: "Concevoir et vérifier des structures, du calcul au plan d'exécution.",
    body: [
      { value: "Ingénieur de conception en génie civil orienté structures, je travaille le dimensionnement en béton armé et charpente métallique selon les Eurocodes et le BAEL, la vérification de conformité en bureau de contrôle technique, et la dynamique des structures. Je développe aussi mes propres outils de calcul sous Python pour automatiser l'analyse et le dimensionnement." },
      { value: "Polyvalent entre le bureau d'études et le terrain, j'ai suivi des chantiers de gros œuvre et de plomberie et mené une publication scientifique sur l'analyse dynamique des ponts ferroviaires à grande vitesse." },
    ],
    statYears: "3+ ans", statProjects: "5 projets", statPublication: "1 publication", statNote: "Zenodo, 2026",
    portraitSrc: "/img/portrait.webp", portraitFallback: "/img/portrait.jpg",
    portraitAlt: "Cheikh Oumar Sy, ingénieur en génie civil",
    facts: [
      { k: "Langues", v: "Français · Anglais technique · Wolof" },
      { k: "Permis", v: "Permis B" },
      { k: "Outils clés", v: "RSA · CYPECAD · Revit · Python" },
    ],
  } });

  await payload.updateGlobal({ slug: "publication", data: {
    title: "Analyse dynamique d'un pont ferroviaire à grande vitesse",
    sub: "Vitesses critiques et vérification selon EN 1991-2 — Zenodo, 2026.",
    points: [
      { value: "Analyse dynamique sous convois HSLM-A et identification des vitesses critiques de résonance." },
      { value: "Étude de sensibilité de la réponse structurelle à l'amortissement." },
      { value: "Dimensionnement d'amortisseurs à masse accordée (AMA / TMD) sous Python." },
    ],
    doi: "10.5281/zenodo.20069677", doiUrl: "https://doi.org/10.5281/zenodo.20069677",
    sideFacts: [
      { k: "Norme", v: "EN 1991-2", accent: true },
      { k: "Convois", v: "HSLM-A", accent: false },
      { k: "Outils", v: "Python · AMA/TMD", accent: false },
    ],
  } });

  await payload.updateGlobal({ slug: "skills", data: {
    technical: [
      "Dimensionnement béton armé & charpente métallique (Eurocodes, BAEL)",
      "Production de plans d'exécution",
      "Vérification de conformité (bureau de contrôle)",
      "Dynamique des structures & analyse modale (EN 1991-2, EN 1990)",
      "Développement d'outils de calcul sous Python",
      "Métrés, attachements & devis",
    ].map((value) => ({ value })),
    tools: [
      { name: "RSA", key: true }, { name: "Revit", key: true }, { name: "Python", key: true }, { name: "CYPECAD", key: true },
      { name: "Archicad", key: false }, { name: "AutoCAD", key: false }, { name: "Graitec", key: false }, { name: "CBS", key: false },
      { name: "DDC", key: false }, { name: "EXPERT", key: false }, { name: "RMD7", key: false }, { name: "LaTeX", key: false },
    ],
    personal: ["Rigueur", "Analyse & résolution de problèmes", "Gestion de projet", "Polyvalence bureau / terrain", "Adaptabilité"].map((value) => ({ value })),
  } });

  await payload.updateGlobal({ slug: "contact", data: {
    title: "Disponible pour un stage de 4 à 6 mois.",
    lead: "Calcul des structures, bureau de contrôle technique ou recherche appliquée — parlons de la mission qui vous attend. Réponse rapide, du bureau d'études au terrain.",
    email: "cheikhoumarsy05@gmail.com", phone: "+221 76 630 10 88", phoneHref: "+221766301088",
    linkedin: "https://www.linkedin.com/in/cheikh-oumar-sy-29912b23b", github: "https://github.com/cheikhoumarsy05-eng",
    location: "Dakar — Sénégal",
  } });

  await payload.updateGlobal({ slug: "site", data: {
    brand: "Cheikh Oumar Sy", cvUrl: "/cv-cheikh-oumar-sy.pdf", footerNote: "Conçu à Dakar.",
    sectionTitles: {
      about: "À propos", experience: "Expérience", experienceLead: "Bureau de contrôle, conduite de travaux, chantier.",
      research: "Recherche appliquée", projects: "Projets",
      projectsLead: "Conception, modélisation et calcul de bâtiments résidentiels — du volume à l'élément.",
      freelance: "Freelance", skills: "Compétences", education: "Formation", contact: "Contact",
    },
  } });

  payload.logger.info("✅ Seed complete.");
};

// Top-level await so `payload run` (which does `await import(file)`) waits for the
// async work to finish before the process exits. A fire-and-forget `run()` exits early.
try {
  await run();
} catch (e) {
  console.error("Seed failed:", e);
  process.exit(1);
}
