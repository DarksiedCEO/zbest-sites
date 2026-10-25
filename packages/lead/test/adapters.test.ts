import { describe, expect, it, vi } from "vitest";
import { leadEmail } from "../src/email";
import { sanitize } from "../src/log";
import { memoryLimiter, parseRateLimit, restLimiter } from "../src/rate-limit";
import { resendNotifier } from "../src/resend";
import { DeliveryError, type LeadRecord } from "../src/types";

const record = (over: Partial<LeadRecord> = {}): LeadRecord => ({
  submission_id: "00000000-0000-4000-8000-000000000001",
  app: "zbm",
  form: "start",
  payload: { name: "Ada", reach: "ada@example.com", services: ["out-of-home"], details: "line1\nline2" },
  payload_hash: "h",
  services: ["out-of-home"],
  source: "bb-i405",
  ip_hash: null,
  user_agent: null,
  ...over,
});

describe("rate limit", () => {
  it("parses '<count>/<seconds>' and rejects anything else", () => {
    expect(parseRateLimit(undefined)).toEqual({ limit: 8, windowSec: 600 });
    expect(parseRateLimit("20/60")).toEqual({ limit: 20, windowSec: 60 });
    for (const bad of ["0/60", "10", "a/b", "10/0", "-1/5"]) expect(parseRateLimit(bad)).toBeNull();
  });

  it("token bucket blocks after the limit and refills over the window", async () => {
    let t = 0;
    const limiter = memoryLimiter({ limit: 2, windowSec: 10 }, () => t);
    expect((await limiter.hit("k")).allowed).toBe(true);
    expect((await limiter.hit("k")).allowed).toBe(true);
    const blocked = await limiter.hit("k");
    expect(blocked).toEqual({ allowed: false, retryAfterSec: 5 });
    t = 5_000;
    expect((await limiter.hit("k")).allowed).toBe(true);
    expect((await limiter.hit("other")).allowed).toBe(true);
  });

  it("REST limiter counts in the shared store and falls back to memory when it is down", async () => {
    let count = 0;
    const fetchImpl = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as string[][];
      expect(body[0]![0]).toBe("INCR");
      expect(body[0]![1]).not.toMatch(/\d+\.\d+\.\d+\.\d+/);
      count += 1;
      return Response.json([{ result: count }, { result: 1 }]);
    }) as unknown as typeof fetch;
    const limiter = restLimiter({
      url: "https://kv.example",
      token: "t",
      spec: { limit: 2, windowSec: 60 },
      fallback: memoryLimiter({ limit: 1, windowSec: 60 }),
      fetchImpl,
      now: () => 30_000,
    });
    expect((await limiter.hit("zbm:abc")).allowed).toBe(true);
    expect((await limiter.hit("zbm:abc")).allowed).toBe(true);
    expect(await limiter.hit("zbm:abc")).toEqual({ allowed: false, retryAfterSec: 30 });

    const onFallback = vi.fn();
    const down = restLimiter({
      url: "https://kv.example",
      token: "t",
      spec: { limit: 2, windowSec: 60 },
      fallback: memoryLimiter({ limit: 1, windowSec: 60 }),
      onFallback,
      fetchImpl: (async () => new Response("no", { status: 500 })) as unknown as typeof fetch,
    });
    expect((await down.hit("k")).allowed).toBe(true);
    expect((await down.hit("k")).allowed).toBe(false);
    expect(onFallback).toHaveBeenCalledTimes(2);
  });
});

describe("Resend notifier", () => {
  it("posts the message with the idempotency key and never surfaces the response body", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const ok = resendNotifier({
      apiKey: "re_123",
      from: "Leads <leads@example.com>",
      to: ["founder@example.com"],
      fetchImpl: (async (url: string, init: RequestInit) => {
        calls.push({ url, init });
        return Response.json({ id: "x" });
      }) as unknown as typeof fetch,
    });
    await ok.send({ subject: "s", text: "t", replyTo: "v@example.com" }, "lead-1");
    expect(calls[0]!.url).toBe("https://api.resend.com/emails");
    const headers = calls[0]!.init.headers as Record<string, string>;
    expect(headers["Idempotency-Key"]).toBe("lead-1");
    expect(headers.Authorization).toBe("Bearer re_123");
    expect(JSON.parse(String(calls[0]!.init.body))).toEqual({
      from: "Leads <leads@example.com>",
      to: ["founder@example.com"],
      subject: "s",
      text: "t",
      reply_to: "v@example.com",
    });

    const rejected = resendNotifier({
      apiKey: "k",
      from: "a@example.com",
      to: ["founder@example.com"],
      fetchImpl: (async () => Response.json({ message: "founder@example.com is not verified" }, { status: 403 })) as unknown as typeof fetch,
    });
    const error = await rejected.send({ subject: "s", text: "t" }, "k").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(DeliveryError);
    expect((error as DeliveryError).detail).toBe(403);
    expect(String((error as Error).message)).not.toContain("founder@");
  });
});

describe("founder email", () => {
  it("subject carries form, services and source on one line; reply-to is the visitor's email", () => {
    const email = leadEmail(record(), new Date("2026-10-25T00:00:00Z"));
    expect(email.subject).toBe("New lead — Z Best Media · start · out-of-home · src:bb-i405");
    expect(email.replyTo).toBe("ada@example.com");
    expect(email.text).toContain("Source tag: bb-i405");
    expect(email.text).toContain("details: line1\nline2");
  });

  it("no CR/LF can reach the subject; a non-email reach sets no reply-to", () => {
    const email = leadEmail(record({ form: "a\r\nBcc: x@evil.example", source: null, payload: { reach: "call me" } }), new Date());
    expect(email.subject).not.toMatch(/[\r\n]/);
    expect(email.replyTo).toBeUndefined();
  });

  it("assessment payloads take reply-to from contact.reach", () => {
    const email = leadEmail(record({ payload: { contact: { reach: "x@example.com" } } }), new Date());
    expect(email.replyTo).toBe("x@example.com");
  });
});

describe("log sanitizer", () => {
  it("drops keys outside the allowlist and strips free text from values", () => {
    const out = sanitize({ app: "zbm", code: "a b@c.d", ...({ name: "Ada", email: "a@b.c" } as object) });
    expect(out).toEqual({ app: "zbm", code: "abc.d" });
  });
});
