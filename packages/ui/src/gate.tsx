/**
 * Build-identity marker for the phase gate (Brief §3, §9).
 *
 * The gate generates a nonce per run and passes it to the server it spawns.
 * Asserting the served *document* carries it is the only thing that proves the
 * page under test came from the process the gate started. Three audits defeated
 * weaker checks: a free port can be taken first, and any on-disk token (BUILD_ID
 * included) can be read and replayed by any local process, because it proves
 * only that the responder can read the build — not that it is the build.
 *
 * Renders nothing unless ZBEST_GATE_NONCE is set, so it never reaches
 * production, where the variable is never defined.
 */
export function GateNonce() {
  const nonce = process.env.ZBEST_GATE_NONCE;
  if (!nonce) return null;
  // React 19 hoists metadata tags into <head>; nothing is painted, so captures
  // stay byte-identical.
  return <meta name="x-zbest-gate-nonce" content={nonce} />;
}
