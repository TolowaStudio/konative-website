import { GoogleAuth } from "google-auth-library";
import { DEFAULT_GCS_TILES_BUCKET } from "./constants";

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/devstorage.read_only"],
});

function gcsMediaUrl(bucket: string, objectKey: string): string {
  const encoded = objectKey.split("/").map(encodeURIComponent).join("%2F");
  return `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o/${encoded}?alt=media`;
}

export function tilesBucketName(): string {
  return process.env.GCS_TILES_BUCKET?.trim() || DEFAULT_GCS_TILES_BUCKET;
}

export type GcsFetchOptions = {
  method?: "GET" | "HEAD";
  range?: string | null;
};

export async function fetchGcsObject(
  objectKey: string,
  options: GcsFetchOptions = {},
): Promise<Response> {
  const bucket = tilesBucketName();
  const url = gcsMediaUrl(bucket, objectKey);
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) {
    return new Response(JSON.stringify({ error: "GCS auth unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${token.token}`,
  };
  const range = options.range?.trim();
  if (range) headers["Range"] = range;

  return fetch(url, {
    method: options.method ?? "GET",
    headers,
  });
}