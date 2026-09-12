import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "./i18n";

let cached: Awaited<ReturnType<typeof getPayload>> | null = null;

export async function payloadClient() {
  if (!cached) cached = await getPayload({ config });
  return cached;
}

/** Resolve an uploaded Media relation (object or id) to its URL, else null. */
export function mediaUrl(m: unknown): string | null {
  if (m && typeof m === "object" && "url" in m && typeof (m as any).url === "string") {
    return (m as any).url as string;
  }
  return null;
}

/** Resolve alt text from an uploaded Media relation. */
export function mediaAlt(m: unknown): string | null {
  if (m && typeof m === "object" && "alt" in m && typeof (m as any).alt === "string") {
    return (m as any).alt as string;
  }
  return null;
}

/**
 * Charge tout le contenu de la page d'accueil dans une langue donnée.
 *
 * `fallback: true` est actif dans la config Payload : un champ anglais encore
 * vide ressort avec sa valeur française, de sorte que la page /en reste
 * entièrement lisible pendant la relecture des traductions.
 */
export async function getContent(locale: Locale = "fr") {
  const payload = await payloadClient();
  const [hero, about, expertise, publication, skills, stats, contact, site, projects, experience, freelance, education] =
    await Promise.all([
      payload.findGlobal({ slug: "hero", locale }),
      payload.findGlobal({ slug: "about", locale }),
      payload.findGlobal({ slug: "expertise", locale }),
      payload.findGlobal({ slug: "publication", locale }),
      payload.findGlobal({ slug: "skills", locale }),
      payload.findGlobal({ slug: "stats", locale }),
      payload.findGlobal({ slug: "contact", locale }),
      payload.findGlobal({ slug: "site", locale }),
      payload.find({ collection: "projects", limit: 100, sort: "order", locale }),
      payload.find({ collection: "experience", limit: 100, sort: "order", locale }),
      payload.find({ collection: "freelance", limit: 100, sort: "order", locale }),
      payload.find({ collection: "education", limit: 100, sort: "order", locale }),
    ]);

  return {
    hero,
    about,
    expertise,
    publication,
    skills,
    stats,
    contact,
    site,
    projects: projects.docs,
    experience: experience.docs,
    freelance: freelance.docs,
    education: education.docs,
  };
}

/** Normalize a Payload project doc to the frontend Project shape. */
export function toProject(p: any) {
  return {
    id: p.id?.toString() ?? p.title,
    index: p.index,
    type: p.type,
    title: p.title,
    fieldLabel: p.fieldLabel,
    desc: p.desc,
    featured: Boolean(p.featured),
    drawings: Boolean(p.drawings),
    specs: (p.specs ?? []).map((s: any) => ({ k: s.k, v: s.v })),
    tags: (p.tags ?? []).map((t: any) => t.value),
    images: (p.images ?? []).flatMap((im: any) => {
      const uploaded = mediaUrl(im.upload);
      const src = uploaded ?? im.src;
      return src ? [{ src, alt: mediaAlt(im.upload) ?? im.alt ?? "" }] : [];
    }),
  };
}
