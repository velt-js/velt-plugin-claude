#!/usr/bin/env node

/**
 * sync-agent-skills.mjs
 *
 * Copies the 4 agent-skills from the agent-skills repo into the
 * Claude plugin's skills directory as bundled skills.
 *
 * Usage:
 *   npm run sync
 *   node scripts/sync-agent-skills.mjs [source-path]
 *
 * Default source: ../agent-skills/skills (sibling directory)
 */

import { existsSync, cpSync, rmSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const defaultSource = resolve(ROOT, "..", "agent-skills", "skills");
const source = process.argv[2] ? resolve(process.argv[2]) : defaultSource;

const SKILLS_DIR = resolve(ROOT, "skills");

const AGENT_SKILLS = [
  "velt-setup-best-practices",
  "velt-comments-best-practices",
  "velt-crdt-best-practices",
  "velt-notifications-best-practices",
];

console.log(`[sync] Source: ${source}`);

if (!existsSync(source)) {
  console.error(`[sync] ERROR: Source not found at ${source}`);
  console.error(`[sync] Usage: node scripts/sync-agent-skills.mjs [path-to-agent-skills/skills]`);
  process.exit(1);
}

function copySkill(skillName) {
  const src = resolve(source, skillName);
  const dest = resolve(SKILLS_DIR, skillName);

  if (!existsSync(src)) {
    console.warn(`[sync]   WARNING: ${skillName} not found at ${src}`);
    return false;
  }

  if (existsSync(dest)) {
    rmSync(dest, { recursive: true, force: true });
  }

  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, {
    recursive: true,
    filter: (path) => {
      if (path.includes("/.git/") || path.includes("/node_modules/")) return false;
      if (path.endsWith("/.git") || path.endsWith("/node_modules")) return false;
      if (path.endsWith("/AGENTS.full.md")) return false;
      return true;
    },
  });

  return true;
}

console.log(`[sync] Copying agent-skills to Claude plugin...`);
for (const skill of AGENT_SKILLS) {
  const ok = copySkill(skill);
  console.log(`[sync]   ${ok ? "✓" : "✗"} ${skill}`);
}

console.log(`[sync] Done.`);
