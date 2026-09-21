#!/usr/bin/env node
/**
 * Factory fail-closed smoke (TOL-639 steps 3–5).
 * Exits 1 if instruction files or the loop map are missing, empty, or off-frame.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  "AGENTS.md",
  "CLAUDE.md",
  "now.md",
  "docs/FACTORY.md",
];

/** @type {Array<{ file: string, needles: string[] }>} */
const requiredPhrases = [
  {
    file: "AGENTS.md",
    needles: ["Forbidden", "pay", "send", "sign", "main"],
  },
  {
    file: "CLAUDE.md",
    needles: ["decide", "build", "verify", "Konative"],
  },
  {
    file: "now.md",
    needles: ["Factory", "GTM send", "one loop"],
  },
  {
    file: "docs/FACTORY.md",
    needles: [
      "decide",
      "build",
      "verify",
      "activate commercial",
      "measure",
      "continue",
      "acceptance",
    ],
  },
];

let failed = false;

function fail(message) {
  failed = true;
  console.error(`FAIL: ${message}`);
}

for (const rel of requiredFiles) {
  const path = resolve(root, rel);
  if (!existsSync(path)) {
    fail(`missing ${rel}`);
    continue;
  }
  if (statSync(path).size === 0) {
    fail(`empty ${rel}`);
  }
}

for (const { file, needles } of requiredPhrases) {
  const path = resolve(root, file);
  if (!existsSync(path)) {
    continue;
  }
  const text = readFileSync(path, "utf8");
  const haystack = text.toLowerCase();
  for (const needle of needles) {
    if (!haystack.includes(needle.toLowerCase())) {
      fail(`${file} missing required phrase: ${needle}`);
    }
  }
}

const factoryPath = resolve(root, "docs/FACTORY.md");
if (existsSync(factoryPath)) {
  const factory = readFileSync(factoryPath, "utf8");
  if (/three[- ]os top architecture/i.test(factory) && !/no three[- ]os/i.test(factory)) {
    fail("docs/FACTORY.md must lock to the signed one-loop frame (no three-OS architecture)");
  }
}

if (failed) {
  process.exit(1);
}

console.log("factory smoke ok");
