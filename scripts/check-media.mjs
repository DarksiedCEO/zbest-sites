#!/usr/bin/env node
/**
 * FD-VISUAL-01 §3.2 / §7.3–7.4, static half (the rendered half is
 * e2e/tests/fd-visual-01-media.spec.ts). Fails when:
 *
 *   - a media file anywhere in apps/ or packages/ has no manifest entry, or a
 *     manifest entry has no file;
 *   - a file's bytes or pixel size no longer match its entry (sha256, width,
 *     height), so an asset cannot be swapped under an approved entry;
 *   - an entry is missing a required field, or a concept entry's alt text does
 *     not start with "Concept:";
 *   - the registry (packages/ui/src/media/assets.ts) and the manifest list
 *     different assets;
 *   - source outside packages/ui/src/media renders an image or video directly
 *     (<img>, <video>, <picture>, next/image), which would bypass MediaFrame
 *     and with it the ConceptBadge.
 *
 * No dependencies; runs in CI's unit job as `pnpm check:media`.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "packages/ui/assets");
const MANIFEST = path.join(ASSETS, "manifest.json");
const REGISTRY = path.join(ROOT, "packages/ui/src/media/assets.ts");
const MEDIA_DIR = path.join(ROOT, "packages/ui/src/media");
const MEDIA_EXT = /\.(png|jpe?g|webp|avif|gif|svg|ico|mp4|webm|mov)$/i;
const SKIP_DIRS = new Set(["node_modules", ".next", ".turbo", "test-results", "playwright-report"]);
const CLASSES = new Set(["real", "concept", "process", "portrait"]);
const REQUIRED = ["id", "file", "sha256", "width", "height", "class", "creator", "date", "rightsHolder", "alt", "caption", "pages"];

const errors = [];
const fail = (msg) => errors.push(msg);
const rel = (p) => path.relative(ROOT, p);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Width and height from a PNG's IHDR chunk. */
function pngSize(buf) {
  const sig = "89504e470d0a1a0a";
  if (buf.subarray(0, 8).toString("hex") !== sig) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const entries = manifest.assets ?? [];
const byFile = new Map();
const ids = new Set();

for (const e of entries) {
  const where = `manifest entry "${e.id ?? "?"}"`;
  for (const k of REQUIRED) if (e[k] === undefined || e[k] === "") fail(`${where}: missing "${k}"`);
  if (!("tool" in e)) fail(`${where}: missing "tool" (use null with a toolNote when unrecorded)`);
  if (e.tool == null && !e.toolNote) fail(`${where}: "tool" is null with no "toolNote" explaining why`);
  if (!("consentRef" in e)) fail(`${where}: missing "consentRef"`);
  if (e.class === "real" && !e.consentRef) fail(`${where}: real work needs a written-consent reference`);
  if (!CLASSES.has(e.class)) fail(`${where}: class "${e.class}" is not one of ${[...CLASSES].join(", ")}`);
  if (e.class === "concept" && !String(e.alt).startsWith("Concept:")) fail(`${where}: concept alt text must start with "Concept:"`);
  if (!Array.isArray(e.pages)) fail(`${where}: "pages" must be a list`);
  if (ids.has(e.id)) fail(`${where}: duplicate id`);
  ids.add(e.id);

  const file = path.join(ASSETS, e.file);
  byFile.set(path.resolve(file), e);
  let buf;
  try {
    buf = readFileSync(file);
  } catch {
    fail(`${where}: file ${rel(file)} does not exist`);
    continue;
  }
  const sha = createHash("sha256").update(buf).digest("hex");
  if (sha !== e.sha256) fail(`${where}: sha256 of ${rel(file)} is ${sha}, manifest says ${e.sha256}`);
  const size = pngSize(buf);
  if (size && (size.width !== e.width || size.height !== e.height)) {
    fail(`${where}: ${rel(file)} is ${size.width}×${size.height}, manifest says ${e.width}×${e.height}`);
  }
}

// Every media file in the apps and packages must be a manifest entry.
// design-inputs/ is the founder's provenance record, not served, so it is not scanned.
for (const p of [...walk(path.join(ROOT, "apps")), ...walk(path.join(ROOT, "packages"))]) {
  if (MEDIA_EXT.test(p) && !byFile.has(path.resolve(p))) fail(`${rel(p)}: media file with no manifest entry`);
}

// The registry must import exactly the manifest's assets.
const registry = readFileSync(REGISTRY, "utf8");
const registered = new Set([...registry.matchAll(/^\s+"([a-z0-9-]+)":\s+\w+,$/gm)].map((m) => m[1]));
for (const id of ids) if (!registered.has(id)) fail(`registry: "${id}" is in the manifest but not in ${rel(REGISTRY)}`);
for (const id of registered) if (!ids.has(id)) fail(`registry: "${id}" is in ${rel(REGISTRY)} but not in the manifest`);

// No direct image or video rendering outside the media primitives.
const DIRECT = /<img[\s>]|<video[\s>]|<picture[\s>]|from\s+["']next\/image["']|next\/legacy\/image/;
for (const p of [...walk(path.join(ROOT, "apps")), ...walk(path.join(ROOT, "packages"))]) {
  if (!/\.(tsx?|jsx?|mdx)$/.test(p) || p.endsWith(".d.ts") || p.startsWith(MEDIA_DIR)) continue;
  const src = readFileSync(p, "utf8");
  const m = src.match(DIRECT);
  if (m) fail(`${rel(p)}: renders media directly (${m[0].trim()}); use MediaFrame so the manifest and ConceptBadge apply`);
}

if (errors.length) {
  console.error(`check-media: ${errors.length} problem(s)\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(`check-media: ${entries.length} manifest entries, files, hashes, sizes, alt text and registry agree; no direct media rendering.`);
