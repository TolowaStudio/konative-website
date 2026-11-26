// Ghost API helpers. Single source of truth for talking to the shared
// Tolowa Studio Ghost instance (one Ghost, multi-newsletter, see STRATEGY.md B6).
//
// Two channels:
//   - Content API (public read): list posts, fetch by slug. Auth via ?key=<contentKey>.
//   - Admin API (server-only): create members, create posts. Auth via Ghost JWT.
//
// The Admin JWT is minted on every server request from GHOST_ADMIN_API_KEY,
// which has the shape "<id>:<hex-secret>". No third-party deps — uses Node crypto.

import crypto from "node:crypto";

function b64url(input: string | Buffer): string {
  const b = typeof input === "string" ? Buffer.from(input) : input;
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function ghostUrl(): string {
  const url = process.env.GHOST_URL || process.env.NEXT_PUBLIC_GHOST_URL || "";
  return url.replace(/\/$/, "");
}

export function ghostContentKey(): string | null {
  return (
    process.env.GHOST_CONTENT_API_KEY ||
    process.env.NEXT_PUBLIC_GHOST_CONTENT_API_KEY ||
    null
  );
}

export function ghostAdminKey(): string | null {
  return process.env.GHOST_ADMIN_API_KEY || null;
}

/** Mint a short-lived JWT for the Ghost Admin API. */
export function mintGhostAdminJwt(adminKey?: string): string {
  const key = adminKey || ghostAdminKey();
  if (!key) throw new Error("GHOST_ADMIN_API_KEY not set");
  const [kid, secretHex] = key.split(":");
  if (!kid || !secretHex) {
    throw new Error("Invalid GHOST_ADMIN_API_KEY format (expected '<id>:<hex-secret>')");
  }
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT", kid }));
  const payload = b64url(JSON.stringify({ iat: now, exp: now + 300, aud: "/admin/" }));
  const signingInput = `${header}.${payload}`;
  const signature = crypto
    .createHmac("sha256", Buffer.from(secretHex, "hex"))
    .update(signingInput)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${signingInput}.${signature}`;
}

/** Server-side fetch wrapped with Ghost Admin JWT auth. */
export async function ghostAdminFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = ghostUrl();
  if (!url) throw new Error("GHOST_URL not set");
  const jwt = mintGhostAdminJwt();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Ghost ${jwt}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${url}${path}`, { ...init, headers });
}

/** Public Content API fetch — key passed as query param. */
export async function ghostContentFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = ghostUrl();
  const key = ghostContentKey();
  if (!url) throw new Error("GHOST_URL not set");
  if (!key) throw new Error("GHOST_CONTENT_API_KEY not set");
  const sep = path.includes("?") ? "&" : "?";
  return fetch(`${url}${path}${sep}key=${encodeURIComponent(key)}`, init);
}

// --- newsletter identity (Konative Dispatch) -------------------------------
// Created 2026-05-23 in shared Tolowa Studio Ghost instance.
// See STRATEGY.md B6, Stash /projects/konative/strategy.
//
// Two identifiers, two purposes:
//   - KONATIVE_NEWSLETTER_ID — the Ghost "newsletter" record. Used to subscribe
//     new members to Konative Dispatch on signup and to drive email sends.
//   - KONATIVE_TAG_SLUG — the Ghost primary-tag slug used to categorize posts
//     belonging to this publication. Filtering posts by primary_tag is more
//     reliable than filtering by `newsletter.slug` because Ghost only sets a
//     post's newsletter when the email actually goes out — web-only / archive
//     posts have `newsletter: null`. Tag is set at publish time and persists.
export const KONATIVE_NEWSLETTER_ID =
  process.env.KONATIVE_NEWSLETTER_ID || "6a1115c22d98680001cb1028";
export const KONATIVE_NEWSLETTER_NAME =
  process.env.KONATIVE_NEWSLETTER_NAME || "Konative Dispatch";
export const KONATIVE_NEWSLETTER_SLUG =
  process.env.KONATIVE_NEWSLETTER_SLUG || "konative-dispatch";
export const KONATIVE_TAG_SLUG =
  process.env.KONATIVE_TAG_SLUG || "konative-dispatch";

// --- Tribal Infrastructure Brief (Konative Dispatch extension) ---------------
// Biweekly/weekly tribal DC + interconnect + grant radar. Not yet publishing;
// tag + newsletter slugs reserved for Phase 4 draft-tribal-brief.ts pipeline.
export const TRIBAL_INFRASTRUCTURE_BRIEF_TAG_SLUG =
  process.env.TRIBAL_INFRASTRUCTURE_BRIEF_TAG_SLUG ||
  "tribal-infrastructure-brief";
export const TRIBAL_INFRASTRUCTURE_BRIEF_NEWSLETTER_SLUG =
  process.env.TRIBAL_INFRASTRUCTURE_BRIEF_NEWSLETTER_SLUG ||
  "tribal-infrastructure-brief";

/** List published Tribal Infrastructure Brief posts (Content API). Returns [] until first issue ships. */
export async function fetchTribalInfrastructureBriefPosts(
  limit = 10,
): Promise<{ slug: string; title: string; updated_at: string | null }[]> {
  const tag = TRIBAL_INFRASTRUCTURE_BRIEF_TAG_SLUG;
  try {
    const res = await ghostContentFetch(
      `/ghost/api/content/posts/?limit=${limit}&fields=slug,title,updated_at&filter=${encodeURIComponent(
        `tag:${tag}`,
      )}`,
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      posts?: { slug: string; title: string; updated_at: string | null }[];
    };
    return data.posts ?? [];
  } catch {
    return [];
  }
}

export interface GhostDraftPostInput {
  title: string;
  slug: string;
  html: string;
  customExcerpt?: string;
  tagSlug?: string;
  tagName?: string;
}

/** Create a draft post in Ghost Admin (review before publish/send). */
export async function createGhostDraftPost(
  input: GhostDraftPostInput,
): Promise<{ id: string; slug: string; adminUrl: string }> {
  const tagSlug = input.tagSlug ?? TRIBAL_INFRASTRUCTURE_BRIEF_TAG_SLUG;
  const tagName = input.tagName ?? "Tribal Infrastructure Brief";
  const payload = {
    posts: [
      {
        title: input.title,
        slug: input.slug,
        html: input.html,
        custom_excerpt: input.customExcerpt,
        status: "draft",
        tags: [{ name: tagName, slug: tagSlug }],
      },
    ],
  };
  const res = await ghostAdminFetch("/ghost/api/admin/posts/?source=html", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ghost draft create failed (${res.status}): ${text.slice(0, 400)}`);
  }
  const data = (await res.json()) as {
    posts?: { id: string; slug: string; url?: string }[];
  };
  const post = data.posts?.[0];
  if (!post?.id) throw new Error("Ghost draft create returned no post");
  const base = ghostUrl();
  return {
    id: post.id,
    slug: post.slug,
    adminUrl: `${base}/ghost/#/editor/post/${post.id}`,
  };
}
