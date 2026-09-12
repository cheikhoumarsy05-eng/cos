import type { Metadata } from "next";
import ArticleView from "../../components/ArticleView";
import { getArticle, getArticleSlugs, articleCover } from "../../lib/content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

/** Prérendu de chaque article au build ; un nouvel article apparaît à la revalidation. */
export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a: any = await getArticle(slug, "fr");
  if (!a) return { title: "Article" };
  const cover = articleCover(a);
  const url = `/articles/${slug}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: a.title,
    description: a.excerpt,
    authors: [{ name: a.author }],
    alternates: { canonical: url, languages: { fr: url, en: `/en/articles/${slug}`, "x-default": url } },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      alternateLocale: ["en_US"],
      url,
      title: a.title,
      description: a.excerpt,
      publishedTime: a.date,
      authors: [a.author],
      ...(cover ? { images: [{ url: cover.src, alt: cover.alt }] } : {}),
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.excerpt },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleView slug={slug} locale="fr" />;
}
