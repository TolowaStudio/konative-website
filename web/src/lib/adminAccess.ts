/** Paths that must not be reachable on the public Cloud Run host without admin auth. */
export const ADMIN_PROTECTED_PREFIXES = ["/cms", "/studio", "/dashboard"] as const;

export function isAdminProtectedPath(pathname: string): boolean {
  return ADMIN_PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export type AdminAccessResult = "ok" | "disabled" | "unauthorized";

/** Verify Bearer or Basic (admin:<token>) credentials for protected admin surfaces. */
export function verifyAdminAccess(
  authHeader: string | null,
  expectedToken: string | undefined,
): AdminAccessResult {
  const token = (expectedToken ?? "").trim();
  if (!token) {
    // Local Studio/CMS work without a shared secret; production must set ADMIN_ACCESS_TOKEN.
    if (process.env.NODE_ENV === "development") return "ok";
    return "disabled";
  }

  const auth = authHeader ?? "";
  if (auth === `Bearer ${token}`) return "ok";

  const basicMatch = auth.match(/^Basic\s+(.+)$/i);
  if (basicMatch) {
    try {
      const decoded = atob(basicMatch[1]);
      const colon = decoded.indexOf(":");
      if (colon === -1) return "unauthorized";
      const user = decoded.slice(0, colon);
      const pass = decoded.slice(colon + 1);
      if (user === "admin" && pass === token) return "ok";
    } catch {
      return "unauthorized";
    }
  }

  return "unauthorized";
}
