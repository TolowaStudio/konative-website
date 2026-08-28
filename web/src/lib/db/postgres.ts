/**
 * Cloud SQL / Postgres client for Cloud Run (TOL-314 target).
 *
 * Exposes a D1-shaped interface so existing query modules work unchanged once
 * the schema is migrated from D1 (SQLite) to Postgres.
 */
import { Pool, type PoolClient } from "pg";
import type { IntelDatabase, IntelPreparedStatement } from "./types";
import { PostgresDatabaseUnavailableError } from "./postgres-errors";

export { PostgresDatabaseUnavailableError };

let pool: Pool | null = null;

/**
 * Supabase transaction pooler (and similar managed Postgres) presents a cert chain
 * that fails Node's default TLS verification when sslmode=require is parsed by pg.
 * Explicitly relax verification for SSL-required DSNs (Supabase serverless guidance).
 */
export function resolvePgSslFromConnectionString(
  connectionString: string,
): { rejectUnauthorized: false } | undefined {
  try {
    const normalized = connectionString.replace(/^postgres:\/\//, "postgresql://");
    const url = new URL(normalized);
    const sslmode = url.searchParams.get("sslmode")?.toLowerCase();
    if (sslmode === "require" || sslmode === "verify-ca" || sslmode === "verify-full") {
      return { rejectUnauthorized: false };
    }
    if (url.searchParams.get("ssl") === "true") {
      return { rejectUnauthorized: false };
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function getConnectionString(): string {
  const uri = process.env.DATABASE_URI?.trim();
  if (!uri) {
    throw new PostgresDatabaseUnavailableError(
      "DATABASE_URI is not configured for the Node/Cloud Run runtime.",
    );
  }
  return uri;
}

export function getPostgresPool(): Pool {
  if (!pool) {
    const connectionString = getConnectionString();
    const ssl = resolvePgSslFromConnectionString(connectionString);
    pool = new Pool({
      connectionString,
      ...(ssl ? { ssl } : {}),
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
    pool.on("error", (error) => {
      console.error("Konative Postgres pool error", {
        dependency: "postgres",
        error: error.message,
      });
    });
  }
  return pool;
}

function convertPlaceholders(sql: string, params: unknown[]): { sql: string; values: unknown[] } {
  let index = 0;
  const values: unknown[] = [];
  const converted = sql.replace(/\?/g, () => {
    values.push(params[index]);
    index += 1;
    return `$${index}`;
  });
  return { sql: converted, values };
}

class PostgresStatement implements IntelPreparedStatement {
  constructor(
    private readonly pool: Pool,
    private readonly sql: string,
    private readonly params: unknown[] = [],
  ) {}

  bind(...values: unknown[]): PostgresStatement {
    return new PostgresStatement(this.pool, this.sql, values);
  }

  async all<T = Record<string, unknown>>(): Promise<{ results: T[] }> {
    const { sql, values } = convertPlaceholders(this.sql, this.params);
    try {
      const result = await this.pool.query(sql, values);
      return { results: result.rows as T[] };
    } catch (error) {
      console.error("Konative Postgres query failed", {
        dependency: "postgres",
        operation: "all",
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async first<T = Record<string, unknown>>(): Promise<T | null> {
    const { results } = await this.all<T>();
    return results[0] ?? null;
  }
}

/** D1-compatible adapter backed by Postgres. */
export class PostgresD1Adapter implements IntelDatabase {
  constructor(private readonly pool: Pool) {}

  prepare(sql: string): PostgresStatement {
    return new PostgresStatement(this.pool, sql);
  }
}

export function getPostgresD1(): PostgresD1Adapter {
  return new PostgresD1Adapter(getPostgresPool());
}

export async function closePostgresPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export type { PoolClient };
