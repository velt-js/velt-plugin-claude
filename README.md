# Velt Plugin for Claude Code

Add real-time collaboration (comments, presence, cursors, CRDT editing, notifications) to React and Next.js apps using AI-assisted setup.

## What You Get

- **8 slash commands**: `/install-velt`, `/add-comments`, `/add-crdt`, `/add-notifications`, `/add-presence`, `/add-cursors`, `/screenshot`, `/velt-help`
- **4 agent-skills**: 118 implementation rules for setup, comments, CRDT, and notifications
- **Velt Expert agent**: specialized AI persona for Velt architecture guidance
- **Embedded best practices**: Combined rules guide in `guides/velt-rules.md`
- **MCP servers**: velt-installer (guided setup) + velt-docs (documentation search, fallback only)

## Architecture

The plugin is a **combo meal** — each component has a clear, non-overlapping role:

| Component | Role | What it does |
|-----------|------|-------------|
| **MCP Installer** | Orchestrator | WHAT to do, WHEN, in what ORDER. Generates installation plans with "READ FIRST:" directives pointing to specific skill files. |
| **Skills (agent-skills)** | Knowledge base | HOW to implement. Contains exact code patterns, import paths, extension ordering, CSS. Skills are the single source of truth for implementation. |
| **CLI** (`@velt-js/add-velt`) | Scaffolding | Quick-start code generation — login, VeltProvider setup, user auth boilerplate. |
| **Velt Docs MCP** | Fallback only | ONLY used when skills don't cover a topic. Never used during installation if skills exist. |
| **Slash command skills** | Triggers | Thin wrappers that invoke the MCP installer and tell Claude to follow its plan. |

## Quick Start

```bash
claude --plugin-dir /path/to/velt-plugin-claude --dangerously-skip-permissions
```

Then type `/install-velt` and follow the guided setup.

## Development

```bash
npm run sync      # Copy agent-skills from ../agent-skills
npm run validate  # Validate plugin completeness
```

## Structure

```
velt-plugin-claude/
├── .claude-plugin/plugin.json  # Claude Code plugin manifest
├── .mcp.json                   # MCP server registration
├── skills/                     # 8 plugin skills + 4 bundled agent-skills
├── agents/                     # velt-expert agent
├── guides/                     # Embedded best practices reference
└── scripts/
    ├── sync-agent-skills.mjs   # Sync agent-skills from sibling repo
    └── validate.mjs            # Validate plugin completeness
```

## Related

- [Velt Plugin for Cursor](https://github.com/velt-js/velt-plugin) (Cursor version)
- [Velt Agent Skills](https://github.com/velt-js/agent-skills) (118 implementation rules)
- [Velt MCP Installer](https://www.npmjs.com/package/@velt-js/mcp-installer)
- [Velt CLI](https://www.npmjs.com/package/@velt-js/add-velt)
- [Velt Documentation](https://docs.velt.dev)

## License

MIT
