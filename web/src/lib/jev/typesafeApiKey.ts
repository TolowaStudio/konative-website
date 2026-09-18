function trimEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

/**
 * TypeSafe / Baton JEV auth — never log the resolved value.
 * Cloud Run binds GSM `typesafe-jev-api-key` as TYPESAFE_API_KEY (Tolowa pattern).
 */
export function resolveTypesafeApiKey(env: NodeJS.ProcessEnv = process.env): string | null {
  const key =
    trimEnv(env.TYPESAFE_API_KEY) ||
    trimEnv(env.KONATIVE_TYPESAFE_API_KEY) ||
    trimEnv(env.TYPESAFE_JEV_API_KEY);
  return key || null;
}
