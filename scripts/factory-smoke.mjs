#!/usr/bin/env node
/**
 * Factory fail-closed smoke (TOL-639).
 * Exits 1 if instruction files, loop map, prove recipe, or deploy gate are off-frame.
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
  "docs/FACTORY-E2E.md",
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
      "lint · typecheck · smoke",
    ],
  },
  {
    file: "docs/FACTORY-E2E.md",
    needles: [
      "Linear",
      "acceptance",
      "branch",
      "Factory CI",
      "deploy",
      "eval harness",
      "M1",
      "GTM send",
      "one loop",
      "not done",
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

for (const rel of ["docs/FACTORY.md", "docs/FACTORY-E2E.md"]) {
  const path = resolve(root, rel);
  if (!existsSync(path)) {
    continue;
  }
  const text = readFileSync(path, "utf8");
  if (/three[- ]os top architecture/i.test(text) && !/no three[- ]os/i.test(text)) {
    fail(`${rel} must lock to the signed one-loop frame (no three-OS architecture)`);
  }
}

const deployRel = ".github/workflows/deploy-cloud-run.yml";
const deployPath = resolve(root, deployRel);
if (!existsSync(deployPath)) {
  fail(`missing ${deployRel}`);
} else {
  const deploy = readFileSync(deployPath, "utf8");
  const callsFactory = /uses:\s*\.\/\.github\/workflows\/factory-ci\.yml/.test(
    deploy,
  );
  const needsFactory =
    /needs:\s*factory-gates/.test(deploy) ||
    /needs:\s*\n[ \t]*-[ \t]*factory-gates/.test(deploy);
  if (!callsFactory) {
    fail(
      `${deployRel} must call ./.github/workflows/factory-ci.yml (deploy cannot skip Factory CI)`,
    );
  }
  if (!needsFactory) {
    fail(
      `${deployRel} must set needs: factory-gates (deploy cannot skip Factory CI)`,
    );
  }
}

if (failed) {
  process.exit(1);
}

console.log("factory smoke ok");
