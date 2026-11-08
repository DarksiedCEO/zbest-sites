import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * AEGIS r2 L1: the browser adapter (packages/ui/src/lead/contract.ts) against
 * a server that keeps answering 425: one automatic wait-and-resend, then the
 * visitor sees the specific "too quickly" message, not a generic failure.
 */
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("client adapter — 425 form_too_fast", () => {
  it("retries once after the server's wait, then shows the form_too_fast copy", async () => {
    vi.useFakeTimers();
    const calls: string[] = [];
    vi.stubGlobal("fetch", async (_u: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      calls.push(method);
      if (method === "GET") return new Response(JSON.stringify({ ok: true, token: "v1.x" }), { status: 200 });
      return new Response(JSON.stringify({ ok: false, error: { code: "form_too_fast", retry_after_s: 2 } }), { status: 425 });
    });
    const { submitLead, FAILURE_COPY } = await import("../../ui/src/lead/contract");
    const pending = submitLead({ form: "contact", submissionId: "00000000-0000-4000-8000-000000000001", fields: {}, honeypot: "" });
    await vi.advanceTimersByTimeAsync(20_000);
    const result = await pending;
    expect(calls).toEqual(["GET", "POST", "POST"]);
    expect(result).toEqual({ status: "form_too_fast" });
    expect(FAILURE_COPY.form_too_fast).toMatch(/too quickly/);
  });
});
