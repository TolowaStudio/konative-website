import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ghostContentFetch, ghostContentKey, ghostUrl } from "@/lib/ghost";
import {
  JsonLd,
  SITE_URL,
  articleSchema,
  breadcrumbSchema,
} from "@/components/seo/JsonLd";

// Server-component conversion 2026-05-23 — was client-rendered, which left
// the body invisible to crawlers and AI answer engines. Now SSR'd with full
// metadata + JSON-LD. See STRATEGY.md B1.
export const revalidate = 300;

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  html: string;
  slug: string;
  feature_image: string | null;
  published_at: string;
  updated_at: string | null;
  reading_time: number;
  primary_tag: { slug: string; name: string } | null;
  tags: Array<{ name: string; slug: string }>;
  authors: Array<{ name: string; profile_image: string | null }>;
}

interface GhostPost {
  id: string;
  title?: string;
  custom_excerpt?: string | null;
  excerpt?: string | null;
  html?: string | null;
  slug?: string;
  feature_image?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  reading_time?: number | null;
  primary_tag?: { slug?: string; name?: string } | null;
  tags?: Array<{ name?: string; slug?: string }>;
  authors?: Array<{ name?: string; profile_image?: string | null }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  if (!ghostUrl() || !ghostContentKey()) return null;
  const fields =
    "id,title,custom_excerpt,excerpt,html,slug,feature_image,published_at,updated_at,reading_time";
  const path = `/ghost/api/content/posts/slug/${encodeURIComponent(slug)}/?include=authors,tags&fields=${fields}`;
  try {
    const res = await ghostContentFetch(path);
    if (!res.ok) return null;
    const data = (await res.json()) as { posts?: GhostPost[] };
    const p = data.posts?.[0];
    if (!p) return null;
    return {
      id: p.id,
      title: p.title ?? "",
      excerpt: p.custom_excerpt ?? p.excerpt ?? "",
      html: p.html ?? "",
      slug: p.slug ?? slug,
      feature_image: p.feature_image ?? null,
      published_at: p.published_at ?? "",
      updated_at: p.updated_at ?? null,
      reading_time: p.reading_time ?? 0,
      primary_tag: p.primary_tag?.slug
        ? { slug: p.primary_tag.slug, name: p.primary_tag.name ?? "" }
        : null,
      tags: (p.tags ?? []).map((t) => ({
        name: t.name ?? "",
        slug: t.slug ?? "",
      })),
      authors: (p.authors ?? []).map((a) => ({
        name: a.name ?? "",
        profile_image: a.profile_image ?? null,
      })),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found — Konative" };
  const canonical = `/blog/${post.slug}`;
  return {
    title: `${post.title} — Konative`,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: "article",
      images: post.feature_image ? [post.feature_image] : undefined,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const article = articleSchema({
    url: canonicalUrl,
    headline: post.title,
    description: post.excerpt,
    image: post.feature_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    authors: post.authors.map((a) => ({ name: a.name })),
    tags: post.tags.map((t) => t.name),
    section: post.primary_tag?.name ?? "Blog",
  });
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url: canonicalUrl },
  ]);

  return (
    <section className="blog-post">
      <JsonLd data={[article, breadcrumbs]} />
      <div className="blog-post__inner">
        <header className="blog-post__header">
          <h1>{post.title}</h1>
          <div className="blog-post__meta">
            {post.authors[0] && (
              <span className="blog-post__author">{post.authors[0].name}</span>
            )}
            <time dateTime={post.published_at}>
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </time>
            {post.reading_time > 0 && (
              <span>{post.reading_time} min read</span>
            )}
          </div>
          {post.tags.length > 0 && (
            <div className="blog-post__tags">
              {post.tags.map((tag) => (
                <span key={tag.slug || tag.name} className="blog-post__tag">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.feature_image && (
          <img
            src={post.feature_image}
            alt={post.title}
            className="blog-post__feature-image"
          />
        )}

        <div
          className="blog-post__content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <p className="blog-post__back">
          <Link href="/blog">← All posts</Link>
        </p>
      </div>
    </section>
  );
}
