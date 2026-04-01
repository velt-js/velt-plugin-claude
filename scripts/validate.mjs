#!/usr/bin/env node

/**
 * validate.mjs
 *
 * Validates that the Claude plugin is complete and well-formed.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.log(`  ✗ ${label}`);
    failed++;
  }
}

console.log("╔══════════════════════════════════════╗");
console.log("║  Velt Claude Plugin Validator         ║");
console.log("╚══════════════════════════════════════╝\n");

// Manifest
const manifestPath = resolve(ROOT, ".claude-plugin", "plugin.json");
const manifestExists = existsSync(manifestPath);
check("plugin.json (.claude-plugin/) exists", manifestExists);
if (manifestExists) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    check(`Plugin name: ${manifest.name}`, manifest.name === "velt");
  } catch {
    check("plugin.json parses as valid JSON", false);
  }
}

// MCP
const mcpPath = resolve(ROOT, ".mcp.json");
const mcpExists = existsSync(mcpPath);
check(".mcp.json exists", mcpExists);
if (mcpExists) {
  try {
    const mcp = JSON.parse(readFileSync(mcpPath, "utf-8"));
    check("MCP: velt-installer present", !!mcp.mcpServers?.["velt-installer"]);
  } catch {
    check(".mcp.json parses as valid JSON", false);
  }
}

// Skills
console.log("\n  Skills:");
const SKILLS = [
  "install-velt", "velt-help",
];
for (const skill of SKILLS) {
  check(`Skill: ${skill}`, existsSync(resolve(ROOT, "skills", skill, "SKILL.md")));
}

// Agent
console.log("\n  Agent:");
check("Agent: velt-expert", existsSync(resolve(ROOT, "agents", "velt-expert.md")));

// Guides
console.log("\n  Guides:");
check("Guide: velt-rules.md", existsSync(resolve(ROOT, "guides", "velt-rules.md")));

// Agent Skills
console.log("\n  Agent Skills:");
const AGENT_SKILLS = [
  "velt-setup-best-practices", "velt-comments-best-practices",
  "velt-crdt-best-practices", "velt-notifications-best-practices",
  "velt-recorder-best-practices", "velt-self-hosting-data-best-practices",
  "velt-single-editor-mode-best-practices",
];
for (const skill of AGENT_SKILLS) {
  check(`Bundled: ${skill}`, existsSync(resolve(ROOT, "skills", skill, "SKILL.md")));
}

// Summary
console.log("\n══════════════════════════════════════");
if (failed === 0) {
  console.log("  All checks passed!");
} else {
  console.log(`  ${failed} check(s) failed!`);
  process.exit(1);
}
console.log("══════════════════════════════════════\n");
