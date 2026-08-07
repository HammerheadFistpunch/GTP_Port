# Documentation Index

Last reviewed: 2026-08-07 after Sprint 13 Resume rebuild

## Active project documents

- `TINA_AUDIT.md` - Sprint 8 field/consumer inventory, disposition map, stored-data findings, and migration gates
- `TINA_FEASIBILITY.md` - Sprint 8B Markdown, external-media, and deliberate-publishing feasibility findings
- `RESUME_DESIGN.md` - Sprint 13 Resume purpose, source model, public hierarchy, content rules, PDF decision, acceptance results, and Sprint 14 compatibility hold

| Document | Purpose |
| --- | --- |
| `README.md` | Concise current status, architecture, setup, and workflows |
| `BUILD_ORDER.md` | Active sprint, next executable chunk, and decision gates |
| `Roadmap.md` | Full sprint scope, dependencies, and acceptance criteria |
| `PROJECT_LOG.md` | Chronological decisions, completed work, and verification |
| `STARTUP_PROMPT.md` | Copy-ready next-session handoff, baseline checks, and GitHub CLI safeguards |
| `SITE_MAINTENANCE_GUIDE.md` | Owner guide to visual, Astro, Tina, schema, route, and dependency changes |
| `CONTENT_GUIDE.md` | Editable content locations and publishing behavior |
| `CONTENT_PORTABILITY.md` | Redesign and migration guardrails |
| `PUBLISHING_GUIDE.md` | Deliberate publishing setup, owner workflow, security, and recovery |
| `IMPORT_GUIDE.md` | Markdown/MDX import mapping, validation, draft workflow, and troubleshooting |
| `RESUME_DESIGN.md` | Resume-specific design intent, source ownership, content rules, Sprint 13 acceptance results, and deferred schema cleanup |

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
6. Feature-specific design/implementation records such as `RESUME_DESIGN.md`
7. Files under `AI notes/` for design history

## Sprint 14 documentation checkpoint

Sprint 13's deployed Resume implementation is complete and owner-verified. The
first Sprint 14 documentation task is to reconcile the large historical/status
documents (`BUILD_ORDER.md`, `Roadmap.md`, `PROJECT_LOG.md`, and
`SITE_MAINTENANCE_GUIDE.md`) against the deployed Sprint 13 state before the
final migration/QA pass. This checkpoint also owns removal of the legacy Tina
Resume body field only if the schema and generated Tina lock can be regenerated
and validated together.

## Documentation maintenance

Every completed sprint must review `PROJECT_LOG.md`, `BUILD_ORDER.md`,
`Roadmap.md`, and `SITE_MAINTENANCE_GUIDE.md`. Update the README and content
or portability guides when their subject changes. Update this index whenever a
document is added, retired, or renamed.

Historical design material under `AI notes/` may inform later work, but it
does not override current source, the active build order, or the roadmap.
