import type { Metadata } from "next";
import Link from "next/link";
import {
  ghostContentFetch,
  ghostContentKey,
  ghostUrl,
  KONATIVE_TAG_SLUG,
} from "@/lib/ghost";

// Server-component conversion 2026-05-23 — was client-rendered. Now SSR'd
// so search engines and AI answer engines see the post list at first paint.
// Excludes Konative Dispatch issues (they have their own archive at /dispatch).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Konative",
  description:
    "Insights and analysis from Konative on data center development, powered land, and infrastructure markets.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Konative — Blog",
    description:
      "Insights and analysis on data center development, powered land, and infrastructure markets.",
    url: "/blog",
    type: "website",
  },
};

interface BlogCardPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  feature_image: string | null;
  published_at: string;
  reading_time: number;
  primary_tag_name: string | null;
}

async function getPosts(): Promise<BlogCardPost[]> {
  if (!ghostUrl() || !ghostContentKey()) return [];
  // Exclude Konative Dispatch — those live at /dispatch.
  const filter = encodeURIComponent(
    `status:published+primary_tag:-${KONATIVE_TAG_SLUG}`,
  );
  const fields =
    "id,title,custom_excerpt,excerpt,slug,feature_image,published_at,reading_time";
  const path = `/ghost/api/content/posts/?filter=${filter}&fields=${fields}&include=primary_tag&limit=30&order=published_at%20desc`;
  try {
    const res = await ghostContentFetch(path);
    if (!res.ok) return [];
    const data = (await res.json()) as {
      posts?: Array<{
        id: string;
        title?: string;
        custom_excerpt?: string | null;
        excerpt?: string | null;
        slug?: string;
        feature_image?: string | null;
        published_at?: string | null;
        reading_time?: number | null;
        primary_tag?: { name?: string } | null;
      }>;
    };
    return (data.posts ?? []).map((p) => ({
      id: p.id,
      title: p.title ?? "",
      excerpt: p.custom_excerpt ?? p.excerpt ?? "",
      slug: p.slug ?? "",
      feature_image: p.feature_image ?? null,
      published_at: p.published_at ?? "",
      reading_time: p.reading_time ?? 0,
      primary_tag_name: p.primary_tag?.name ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function BlogIndex() {
  const posts = await getPosts();
  return (
    <section className="blog">
      <div className="blog__inner">
        <div className="blog__header">
          <h1>Blog</h1>
          <p>
            Insights, analysis, and updates from the Konative team on data center
            development and infrastructure markets.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="blog__empty">
            <h2>Coming Soon</h2>
            <p>
              We&apos;re preparing our first articles. Check back soon or{" "}
              <Link href="/contact">contact us</Link> for project updates.
            </p>
          </div>
        ) : (
          <div className="blog__grid">
            {posts.map((post) => (
              <article key={post.id} className="blog__card">
                {post.feature_image && (
                  <div className="blog__card-image">
                    <img src={post.feature_image} alt={post.title} loading="lazy" />
                  </div>
                )}
                <div className="blog__card-body">
                  <div className="blog__card-meta">
                    {post.primary_tag_name && (
                      <span className="blog__card-source">{post.primary_tag_name}</span>
                    )}
                    <time dateTime={post.published_at} className="blog__card-date">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </time>
                  </div>
                  <h3 className="blog__card-title">
                    <Link href={`/blog/${post.slug}`} className="blog__card-link">
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="blog__card-excerpt">{post.excerpt}</p>
                  )}
                  {post.reading_time > 0 && (
                    <p className="blog__card-readtime">
                      {post.reading_time} min read
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
