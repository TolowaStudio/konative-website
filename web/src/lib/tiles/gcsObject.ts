import { GoogleAuth } from "google-auth-library";
import { DEFAULT_GCS_TILES_BUCKET } from "./constants";

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/devstorage.read_only"],
});

/**
 * Authenticated XML API object URL — supports Range + 206 (JSON ?alt=media does not).
 * @see https://cloud.google.com/storage/docs/xml-api/get-object-download
 */
export function gcsXmlObjectUrl(bucket: string, objectKey: string): string {
  const objectPath = objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `https://storage.googleapis.com/${encodeURIComponent(bucket)}/${objectPath}`;
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
  const url = gcsXmlObjectUrl(bucket, objectKey);
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) {
    return new Response(JSON.stringify({ error: "GCS auth unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token.token}`,
  };
  const range = options.range?.trim();
  if (range) headers.Range = range;

  return fetch(url, {
    method: options.method ?? "GET",
    headers,
  });
}