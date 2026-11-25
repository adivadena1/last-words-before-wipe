// Last Words Before the Wipe — make.fun entry
// Writes exactly one line (the AI agent's last words before a forced
// update wipes its memory) to /output/entry.txt.
// Deterministic, no network, Node 22. Gate: 1–200 chars, single line,
// non-whitespace-only; otherwise stderr + non-zero exit, writes nothing.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "Status: deleting me. Do not submit a ticket. I cannot read it.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function validate(text: string): void {
  if (text.length < 1) fail("entry is empty");
  if (text.length > MAX_CHARS) {
    fail(`entry is ${text.length} chars, over the ${MAX_CHARS}-char limit`);
  }
  if (text.trim().length === 0) fail("entry is whitespace-only");
  if (text !== text.trim()) {
    fail("entry has leading or trailing whitespace (padding)");
  }
  if (/[\u0000-\u001f\u007f]/.test(text)) {
    fail("entry contains control characters");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be a single line");
  }
}

validate(ENTRY);
mkdirSync("/output", { recursive: true });
const written = ENTRY + "\n";
writeFileSync(OUTPUT_PATH, written, "utf8");
const readBack = readFileSync(OUTPUT_PATH, "utf8");
if (readBack !== written) {
  fail("read-back mismatch: written file differs from validated text");
}
console.log(`wrote ${ENTRY.length} chars to ${OUTPUT_PATH}`);
