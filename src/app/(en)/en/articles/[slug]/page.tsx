import type { Metadata } from "next";
import ArticleView from "../../../../(frontend)/components/ArticleView";
import { getArticle, getArticleSlugs, articleCover } from "../../../../(frontend)/lib/content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a: any = await getArticle(slug, "en");
  if (!a) return { title: "Article" };
  const cover = articleCover(a);
  const url = `/en/articles/${slug}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: a.title,
    description: a.excerpt,
    authors: [{ name: a.author }],
    alternates: { canonical: url, languages: { fr: `/articles/${slug}`, en: url, "x-default": `/articles/${slug}` } },
    openGraph: {
      type: "article",
      locale: "en_US",
      alternateLocale: ["fr_FR"],
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
  return <ArticleView slug={slug} locale="en" />;
}
