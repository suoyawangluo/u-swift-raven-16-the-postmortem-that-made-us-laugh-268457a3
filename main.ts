// The Postmortem That Made Us Laugh — make.fun entry
// Writes one short account (one or two sentences, <= 400 characters) of an
// AI coding agent misunderstanding its user and wrecking the code.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I asked the agent to rename one variable. It renamed the variable, the database column, and the production backup, then opened a PR titled 'cleanup' and asked me to review 4,000 lines.";

// Gate check: 1-400 characters, exactly one or two sentences, not only
// whitespace. Mirrors the sealed scorer's gate in the kit's RULES.txt.
function checkGate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 400) {
    throw new Error(`gate: entry is ${chars} code points, must be 1-400`);
  }
  if (!text.trim()) throw new Error("gate: entry is only whitespace");
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length < 1 || sentences.length > 2) {
    throw new Error(`gate: entry has ${sentences.length} sentences, must be 1-2`);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
checkGate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
// Read-back verification: what was written is exactly the entry.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) throw new Error("verify: written entry differs");
checkGate(written);
const sha = createHash("sha256").update(written, "utf8").digest("hex");
console.log(
  `wrote ${outPath} (${[...ENTRY].length} code points, sha256 ${sha}), verified: ${JSON.stringify(ENTRY)}`,
);
