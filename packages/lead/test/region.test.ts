import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { leadEmail } from "../src/email";
import { handleLead } from "../src/pipeline";
import { memoryLimiter } from "../src/rate-limit";
import { OUTSIDE, REGION, REGION_COPY, SERVICE_AREAS, regionServed } from "../src/region";
import { captureLogger, readJsonl, tempOutbox, toyParse } from "./helpers";

/** Service area (founder decisions 2026-10-30: the 50 US states, DC, and PR, GU, VI, AS, MP). */

const NONCE = "gate-nonce-0123456789abcdef";
const env = (dir: string) => ({
  ZBEST_LEAD_TRANSPORT: "fake",
  ZBEST_LEAD_FAKE_OUTBOX: dir,
  ZBEST_GATE_NONCE: NONCE,
  ZBEST_LEAD_FAKE_ACK: NONCE,
  LEAD_TRUSTED_PROXY: "x-forwarded-for",
});
const post = (fields: Record<string, string>, id = randomUUID()) =>
  new Request("http://www.zbestmedia.com/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", host: "www.zbestmedia.com", "x-forwarded-for": "198.51.100.9" },
    body: JSON.stringify({ form: "start", submission_id: id, fields: { name: "Ada", business: "B", reach: "ada@example.com", ...fields } }),
  });
const opts = (dir = tempOutbox(), limit = 100) => ({
  app: "zbm" as const,
  parse: toyParse,
  env: env(dir),
  logger: captureLogger().logger,
  limiters: { perIp: memoryLimiter({ limit, windowSec: 600 }) },
});

describe("REGION schema: exactly the 50 states, DC and the five inhabited territories", () => {
  it("lists 56 areas with ISO codes, plus the one declined option", () => {
    const codes = SERVICE_AREAS.map((a) => a.value);
    expect(codes).toHaveLength(56);
    expect(new Set(codes).size).toBe(56);
    expect(codes.filter((c) => /^US-[A-Z]{2}$/.test(c) && c !== "US-DC")).toHaveLength(50);
    expect(codes.slice(-6)).toEqual(["US-DC", "PR", "GU", "VI", "AS", "MP"]);
    for (const absent of ["US-PR", "US-GU", "US-VI", "US-AS", "US-MP", "UM", "US-UM", "CA", "GB"]) expect(codes as readonly string[]).not.toContain(absent);
    expect(OUTSIDE).toEqual({ value: "outside", label: "Outside these areas" });
  });

  it("a parsed value parses again unchanged (the client sends what it parsed)", () => {
    const once = REGION.parse({ state: " PR " });
    expect(REGION.parse(once)).toEqual({ state: "PR" });
  });

  it("accepts a served area or 'outside'; anything else (or nothing) is a field error", () => {
    expect(REGION.parse({ state: "US-CA" })).toEqual({ state: "US-CA" });
    expect(REGION.parse({ state: " GU " })).toEqual({ state: "GU" });
    for (const t of ["VI", "AS", "MP"]) expect(REGION.parse({ state: t })).toEqual({ state: t });
    expect(REGION.parse({ state: "outside" })).toEqual({ state: "outside" });
    for (const bad of [{}, { state: "" }, { state: "CA" }, { state: "us-ca" }, { state: "US-PR" }, { state: "US-VI" }, { state: "UM" }, { state: "vi" }, { state: "FR" }, { state: 5 }]) {
      const issues = REGION.safeParse(bad).error?.issues.map((i) => [i.path.join("."), i.message]);
      expect(issues, JSON.stringify(bad)).toEqual([["state", REGION_COPY.choose]]);
    }
  });

  it("serves every listed area and declines 'outside'", () => {
    for (const a of SERVICE_AREAS) expect(regionServed({ state: a.value }), a.value).toBe(true);
    expect(regionServed({ state: "outside" })).toBe(false);
  });
});

describe("pipeline: 'Outside these areas' is declined politely; nothing is stored or sent", () => {
  it("422 region_unavailable, no row, no email, a code-only log line", async () => {
    const dir = tempOutbox();
    const log = captureLogger();
    const res = await handleLead(post({ state: "outside" }), { ...opts(dir), logger: log.logger });
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, error: { code: "region_unavailable" } });
    expect(readJsonl(dir, "rows.jsonl")).toEqual([]);
    expect(readJsonl(dir, "emails.jsonl")).toEqual([]);
    expect(log.lines).toEqual([{ level: "info", event: "region_refused", fields: { app: "zbm", form: "start", code: "outside" } }]);
  });

  it("a missing or unknown area is a 422 field error and nothing is stored", async () => {
    const dir = tempOutbox();
    for (const fields of [{}, { state: "" }, { state: "ON" }]) {
      const res = await handleLead(
        new Request("http://www.zbestmedia.com/api/lead", {
          method: "POST",
          headers: { "content-type": "application/json", host: "www.zbestmedia.com", "x-forwarded-for": "198.51.100.9" },
          body: JSON.stringify({ form: "start", submission_id: randomUUID(), fields: { name: "Ada", ...fields, ...(Object.keys(fields).length ? {} : { state: "" }) } }),
        }),
        opts(dir),
      );
      expect(res.status).toBe(422);
    }
    expect(readJsonl(dir, "rows.jsonl")).toEqual([]);
  });

  it("a served area is stored as a column and shown in the founder email", async () => {
    const dir = tempOutbox();
    expect((await handleLead(post({ state: "PR" }), opts(dir))).status).toBe(200);
    const rows = readJsonl<Record<string, unknown>>(dir, "rows.jsonl");
    expect(rows[0]).toMatchObject({ service_area: "PR" });
    expect(rows[0]!.payload).not.toHaveProperty("state");
    const [email] = readJsonl<{ text: string }>(dir, "emails.jsonl");
    expect(email!.text).toContain("\nRegion: PR\n");
  });

  it("declines are charged to the rate limit like any 422", async () => {
    const o = opts(tempOutbox(), 1);
    expect((await handleLead(post({ state: "outside" }), o)).status).toBe(422);
    expect((await handleLead(post({ state: "US-NY" }), o)).status).toBe(429);
  });

  it("the same submission with a changed area is a conflict, not a silent overwrite", async () => {
    const o = opts();
    const id = randomUUID();
    expect((await handleLead(post({ state: "US-TX" }, id), o)).status).toBe(200);
    expect((await handleLead(post({ state: "US-NM" }, id), o)).status).toBe(409);
  });

  it("leadEmail prints the area code", () => {
    const email = leadEmail(
      { submission_id: randomUUID(), app: "zbc", form: "clipper", payload: {}, payload_hash: "h", services: [], source: null, service_area: "GU", user_agent: null },
      new Date(0),
    );
    expect(email.text).toContain("\nRegion: GU\n");
  });
});
