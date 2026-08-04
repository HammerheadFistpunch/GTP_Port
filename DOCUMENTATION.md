# Documentation Index

Last reviewed: 2026-08-04 after the Sprint 1B Flexible Page shell and editorial controls

## Active project documents

| Document | Purpose |
| --- | --- |
| `README.md` | Concise current status, architecture, setup, and workflows |
| `BUILD_ORDER.md` | Active sprint, next executable chunk, and decision gates |
| `Roadmap.md` | Full sprint scope, dependencies, and acceptance criteria |
| `PROJECT_LOG.md` | Chronological decisions, completed work, and verification |
| `SITE_MAINTENANCE_GUIDE.md` | Owner guide to visual, Astro, Tina, schema, route, and dependency changes |
| `CONTENT_GUIDE.md` | Editable content locations and publishing behavior |
| `CONTENT_PORTABILITY.md` | Redesign and migration guardrails |

## Project instructions

| Document | Purpose |
| --- | --- |
| `AGENTS.md` | Repository-specific development and documentation requirements |
| `.env.example` | Safe template for required TinaCloud and branch variables |

## Source hierarchy

When documents disagree, use this order:

1. Current `gpt-handoff` source and configuration
2. `BUILD_ORDER.md` for the active chunk
3. `Roadmap.md` for planned scope and acceptance criteria
4. `README.md`, `SITE_MAINTENANCE_GUIDE.md`, and the content guides for
   current workflows
5. `PROJECT_LOG.md` for historical decisions and verification
6. Files under `AI notes/` for design history

## Documentation maintenance

Every completed sprint must review `PROJECT_LOG.md`, `BUILD_ORDER.md`,
`Roadmap.md`, and `SITE_MAINTENANCE_GUIDE.md`. Update the README and content
or portability guides when their subject changes. Update this index whenever a
document is added, retired, or renamed.

Historical design material under `AI notes/` may inform later work, but it
does not override current source, the active build order, or the roadmap.
