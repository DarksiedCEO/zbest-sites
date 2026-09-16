import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Stamps the provenance of every gate run next to the artifacts it produces.
 *
 * `next build` builds the working tree, not a commit, so a green run proves
 * nothing about WHICH source produced it. Screenshots are the phase-completion
 * evidence (Brief §3, §9), so each run records the commit it ran against and
 * whether the tree was dirty. This records provenance rather than blocking a
 * dirty run — iterating on a phase necessarily means running the gate dirty.
 */
export default async function globalSetup() {
  const repoRoot = path.join(import.meta.dirname, "..");
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();

  const sha = git("rev-parse", "HEAD");
  // The stamp is untracked, so it can never dirty the tree it reports on.
  const dirty = git("status", "--porcelain");
  const stamp = [
    `commit:    ${sha}`,
    `tree:      ${git("rev-parse", "HEAD^{tree}")}`,
    `clean:     ${dirty === "" ? "yes" : "NO — artifacts below do not correspond to any commit"}`,
    ...(dirty === "" ? [] : ["modified:", ...dirty.split("\n").map((l) => `  ${l}`)]),
    `captured:  ${new Date().toISOString()}`,
    "",
  ].join("\n");

  const dir = path.join(repoRoot, "e2e", "snapshots", "phase-1");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "PROVENANCE.txt"), stamp);

  if (dirty !== "") {
    console.warn(
      `\n  ⚠  Gate running against a DIRTY tree — screenshots will not match ${sha.slice(0, 7)}.\n`,
    );
  }
}
