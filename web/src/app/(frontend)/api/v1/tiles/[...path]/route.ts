import { NextRequest, NextResponse } from "next/server";
import { fetchGcsObject } from "@/lib/tiles/gcsObject";
import { toGcsObjectKey } from "@/lib/tiles/proxyPath";

export const dynamic = "force-dynamic";

const CORS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Range, Content-Type",
  "Access-Control-Expose-Headers":
    "Accept-Ranges, Content-Range, Content-Length, ETag",
};

function passthroughHeaders(upstream: Response, out: Headers): void {
  for (const h of [
    "Content-Type",
    "Content-Range",
    "Content-Length",
    "Accept-Ranges",
    "ETag",
  ]) {
    const v = upstream.headers.get(h);
    if (v) out.set(h, v);
  }
  if (!out.get("Content-Type")) {
    out.set("Content-Type", "application/vnd.pmtiles");
  }
  out.set(
    "Cache-Control",
    "public, max-age=86400, stale-while-revalidate=3600",
  );
}

async function proxyTile(
  req: NextRequest,
  pathSegments: string[],
  method: "GET" | "HEAD",
): Promise<NextResponse> {
  const objectKey = toGcsObjectKey(pathSegments);
  if (!objectKey) {
    return NextResponse.json({ error: "invalid tile path" }, { status: 400 });
  }

  try {
    const upstream = await fetchGcsObject(objectKey, {
      method,
      range: req.headers.get("Range"),
    });

    const out = new Headers(CORS);
    passthroughHeaders(upstream, out);

    if (method === "HEAD" || !upstream.body) {
      return new NextResponse(null, { status: upstream.status, headers: out });
    }

    return new NextResponse(upstream.body, { status: upstream.status, headers: out });
  } catch {
    return NextResponse.json({ error: "tile fetch failed" }, { status: 502 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function HEAD(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyTile(req, path, "HEAD");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyTile(req, path, "GET");
}