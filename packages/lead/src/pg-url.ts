/**
 * POSTGRES_URL → explicit driver options (AEGIS H1, M1).
 *
 * The `postgres` driver forwards every query parameter it does not know as a
 * Postgres startup parameter, so a vendor URL such as Neon's
 * `?sslmode=require&channel_binding=require` makes every connection fail with
 * 42704. And a URL the WHATWG parser rejects makes the driver throw an error
 * that carries the whole connection string. So the URL is parsed here, once,
 * inside a try, and the driver only ever receives discrete options.
 *
 * Known parameters:
 *   sslmode          disable | allow | prefer | require | verify-ca | verify-full
 *   channel_binding  disable | prefer | require — accepted and dropped: the
 *                    driver does not implement SCRAM channel binding, and
 *                    password auth over TLS still works without it.
 *   pgbouncer        true | false — a Prisma/Supabase hint; dropped (the driver
 *                    already runs with prepare: false).
 *   connection_limit, pool_timeout
 *                    Prisma pool hints (integers); dropped — this driver runs one
 *                    connection per instance with its own timeouts.
 *   supa             Vercel–Supabase integration tag (e.g. base-pooler.x);
 *                    dropped — it is a label for Supabase's own tooling.
 *   options          ONLY `endpoint=<neon-endpoint-id>` (Neon's fallback for
 *                    clients without SNI). Passed through to the server as the
 *                    `options` startup parameter, which the driver supports.
 *                    The driver also sends SNI, so Neon does not need it; any
 *                    other `options` value (e.g. `-c search_path=…`) is refused.
 *   connect_timeout  seconds; mapped to the driver option.
 * Anything else is refused, by key name only. A repeated key is refused.
 *
 * TLS semantics (AEGIS r2 N3), deliberately those of libpq:
 *   - `sslmode=require` encrypts but does NOT verify the certificate, so it
 *     does not stop an active man in the middle;
 *   - `sslmode=verify-full` (or verify-ca) verifies the chain and hostname.
 *     RECOMMENDED for Neon and Supabase, whose certificates chain to public
 *     CAs: use `?sslmode=verify-full` in POSTGRES_URL;
 *   - `channel_binding=require` is accepted but NOT enforced (the driver has
 *     no channel binding). SCRAM still authenticates the password; use
 *     verify-full if you need protection against interception.
 *   - an explicit remote `sslmode=disable` is honoured as the operator's
 *     choice; without sslmode a remote host gets TLS.
 *
 * Remote hosts with no sslmode default to TLS (`require`): every hosted
 * Postgres the design considers (Neon, Supabase, Vercel Marketplace) requires
 * it, and a plaintext connection to a remote database is never the intent.
 *
 * Errors carry a short reason code, NEVER any part of the URL.
 */

export type PgSsl = false | "prefer" | "require" | "verify-full";

export type PgOptions = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: PgSsl;
  connect_timeout?: number;
  /** Startup `options` parameter — only ever `endpoint=<id>` (Neon). */
  startup_options?: string;
};

export type PgUrlResult = { ok: true; options: PgOptions } | { ok: false; reason: string };

const SSL: Record<string, PgSsl> = {
  disable: false,
  allow: "prefer",
  prefer: "prefer",
  require: "require",
  "verify-ca": "verify-full",
  "verify-full": "verify-full",
};

const LOCAL = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function parsePostgresUrl(raw: string): PgUrlResult {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { ok: false, reason: "unparseable" };
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") return { ok: false, reason: "not-a-postgres-url" };
  if (!url.hostname) return { ok: false, reason: "no-host" };

  let username: string;
  let password: string;
  let database: string;
  try {
    username = decodeURIComponent(url.username);
    password = decodeURIComponent(url.password);
    database = decodeURIComponent(url.pathname.replace(/^\//, ""));
  } catch {
    return { ok: false, reason: "bad-percent-encoding" };
  }
  if (!username) return { ok: false, reason: "no-user" };
  if (!database || database.includes("/")) return { ok: false, reason: "no-database" };

  const port = url.port ? Number(url.port) : 5432;
  if (!Number.isInteger(port) || port < 1 || port > 65535) return { ok: false, reason: "bad-port" };

  const host = url.hostname.replace(/^\[(.*)\]$/, "$1");
  let ssl: PgSsl = LOCAL.has(url.hostname) ? false : "require";
  let connect_timeout: number | undefined;
  let startup_options: string | undefined;
  const seen = new Set<string>();
  const plain = (key: string) => /^[A-Za-z0-9_]{1,40}$/.test(key);

  for (const [key, value] of url.searchParams) {
    if (seen.has(key)) return { ok: false, reason: plain(key) ? `duplicate-param-${key}` : "duplicate-param" };
    seen.add(key);
    switch (key) {
      case "sslmode": {
        const mapped = SSL[value];
        if (mapped === undefined) return { ok: false, reason: "bad-sslmode" };
        ssl = mapped;
        break;
      }
      case "channel_binding":
        if (!["disable", "prefer", "require"].includes(value)) return { ok: false, reason: "bad-channel_binding" };
        break;
      case "pgbouncer":
        if (value !== "true" && value !== "false") return { ok: false, reason: "bad-pgbouncer" };
        break;
      case "connection_limit":
      case "pool_timeout":
        if (!/^\d{1,5}$/.test(value)) return { ok: false, reason: `bad-${key}` };
        break;
      case "supa":
        if (!/^[A-Za-z0-9._-]{1,64}$/.test(value)) return { ok: false, reason: "bad-supa" };
        break;
      case "options":
        if (!/^endpoint=[a-z0-9-]{1,63}$/.test(value)) return { ok: false, reason: "bad-options-only-endpoint-allowed" };
        startup_options = value;
        break;
      case "connect_timeout": {
        const n = Number(value);
        if (!Number.isInteger(n) || n < 1 || n > 120) return { ok: false, reason: "bad-connect_timeout" };
        connect_timeout = n;
        break;
      }
      default:
        // The key is ours to log only if it is a plain identifier.
        return { ok: false, reason: plain(key) ? `unknown-param-${key}` : "unknown-param" };
    }
  }

  return {
    ok: true,
    options: {
      host,
      port,
      database,
      username,
      password,
      ssl,
      ...(connect_timeout ? { connect_timeout } : {}),
      ...(startup_options ? { startup_options } : {}),
    },
  };
}
