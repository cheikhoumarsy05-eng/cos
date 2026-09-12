import { getPayload } from "payload";
import config from "@payload-config";

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

export async function getContent() {
  const payload = await payloadClient();
  const [hero, about, publication, skills, stats, contact, site, projects, experience, freelance, education] =
    await Promise.all([
      payload.findGlobal({ slug: "hero" }),
      payload.findGlobal({ slug: "about" }),
      payload.findGlobal({ slug: "publication" }),
      payload.findGlobal({ slug: "skills" }),
      payload.findGlobal({ slug: "stats" }),
      payload.findGlobal({ slug: "contact" }),
      payload.findGlobal({ slug: "site" }),
      payload.find({ collection: "projects", limit: 100, sort: "order" }),
      payload.find({ collection: "experience", limit: 100, sort: "order" }),
      payload.find({ collection: "freelance", limit: 100, sort: "order" }),
      payload.find({ collection: "education", limit: 100, sort: "order" }),
    ]);

  return {
    hero,
    about,
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
    specs: (p.specs ?? []).map((s: any) => ({ k: s.k, v: s.v })),
    tags: (p.tags ?? []).map((t: any) => t.value),
    images: (p.images ?? []).flatMap((im: any) => {
      const uploaded = mediaUrl(im.upload);
      const src = uploaded ?? im.src;
      return src ? [{ src, alt: mediaAlt(im.upload) ?? im.alt ?? "" }] : [];
    }),
  };
}
