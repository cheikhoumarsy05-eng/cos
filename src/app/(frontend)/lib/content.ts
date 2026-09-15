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

/**
 * Articles publiés, du plus récent au plus ancien.
 *
 * `depth: 1` résout la relation vers Media pour disposer de l'URL de couverture
 * sans requête supplémentaire.
 */
/**
 * Les articles en brouillon ne doivent jamais atteindre le site.
 *
 * Payload renvoie par défaut les documents quel que soit leur statut : un
 * article commencé mais non publié apparaîtrait donc en ligne, ce qui viderait
 * les brouillons de leur intérêt. Toutes les lectures publiques passent par ce
 * filtre — la liste, la page d'un article, et les adresses du sitemap.
 */
const SEULEMENT_PUBLIES = { _status: { equals: "published" } } as const;

export async function getArticles(locale: Locale = "fr") {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: "articles",
    where: SEULEMENT_PUBLIES,
    limit: 200,
    sort: "-date",
    locale,
    depth: 1,
  });
  return res.docs;
}

/** Un article par son identifiant d'URL, ou null s'il n'existe pas. */
export async function getArticle(slug: string, locale: Locale = "fr") {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: "articles",
    where: { and: [{ slug: { equals: slug } }, SEULEMENT_PUBLIES] },
    limit: 1,
    locale,
    depth: 1,
  });
  return res.docs[0] ?? null;
}

/** Tous les identifiants d'URL, pour le prérendu statique et le sitemap. */
export async function getArticleSlugs(): Promise<string[]> {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: "articles",
    where: SEULEMENT_PUBLIES,
    limit: 500,
    depth: 0,
    pagination: false,
  });
  return res.docs.map((d: any) => d.slug).filter(Boolean);
}

/**
 * Couverture d'un article : le téléversement prime sur le chemin /public.
 *
 * `vector` signale un SVG. Next refuse de passer les SVG par son optimiseur
 * d'images sans `dangerouslyAllowSVG`, garde-fou qu'on ne relâche pas pour une
 * illustration : ces couvertures sont servies par une balise <img> ordinaire,
 * ce qui les garde nettes à toute taille et évite un détour par le raster.
 */
export function articleCover(a: any): { src: string; alt: string; vector: boolean } | null {
  const src = mediaUrl(a?.cover) ?? a?.coverSrc;
  if (!src) return null;
  return {
    src,
    alt: mediaAlt(a?.cover) ?? a?.coverAlt ?? a?.title ?? "",
    vector: /\.svg(\?|$)/i.test(src),
  };
}

/** Réduit un article Payload à la forme simple attendue par la carte (composant client). */
export function toArticleCard(a: any) {
  return {
    id: a.id,
    slug: a.slug as string,
    title: a.title as string,
    category: a.category as string,
    excerpt: a.excerpt as string,
    author: a.author as string,
    date: a.date as string,
    cover: articleCover(a),
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
