# GTP_Port Repository Audit

Audit updated: 2026-07-15
Repository: `HammerheadFistpunch/GTP_Port`
Working branch: `gpt-handoff`
Baseline: commit `75791da` (`fixed immich gallery`)

## Executive finding

The repository has a complete functional publishing core and is ready for real
content. No framework change or architectural rebuild is recommended before
using the site for a job search.

The current separation between Git-backed Markdown and Astro presentation is a
strong base for later redesigns. TinaCloud does not own the content; it edits
the repository files.

## Operational status

| Area | Status |
| --- | --- |
| GitHub source branch | Operational on `gpt-handoff` |
| Cloudflare deployment | Operational |
| TinaCloud `/admin/` | Authenticated and operational |
| Homepage | Managed content and collection previews |
| Journal archive and shared details | Operational |
| Portfolio bento archive and shared details | Operational |
| Immich galleries | Operational on Journal and Portfolio |
| About and Contact | Operational; real content still needed |
| Resume | Structured editor operational; real content still needed |

The current content set generates 14 static pages after legacy-route cleanup.

## Content model status

Tina provides focused collections for:

- Site Settings
- Homepage
- Archive Pages
- Standard Pages
- Resume
- Content Entries

Content Entry bodies are ordinary Markdown. Their primary metadata uses
YAML frontmatter. This is portable to another Markdown-based system and can be
imported into a database CMS if needed.

## Implemented presentation and behavior

- Journal and Portfolio metadata
- cross-type related Content Entries
- project image and video media
- native, YouTube, and Vimeo rendering
- project gallery and lightbox
- narrative-image lightbox
- higher-quality, proportion-preserving Immich gallery and lightbox
- Resume overview and timeline
- responsive shared shell and mobile navigation
- keyboard, focus, contrast, and reduced-motion foundations
- descriptions, favicons, canonical URLs, and social metadata foundation

## Current risks

- Placeholder and test content remain visible.
- The test project contains a localhost media URL that must not be copied into
  real entries.
- Important project storytelling should not depend exclusively on an external
  Immich public share.
- Journal and Portfolio filters remain incomplete, but are unnecessary at the
  current content volume.
- Resume printing needs refinement.
- Sitemap, robots, RSS, image optimization, analytics, and final performance
  checks remain launch-quality work.
- A broad custom-block system inside articles would reduce portability and
  should be avoided unless clearly required.

## Recommendation

Begin replacing placeholders with strong real content immediately. Let actual
projects and articles drive the next design refinements. Keep authored bodies
in semantic Markdown, keep critical media locally owned, and reserve flexible
Tina blocks primarily for the small set of landing pages.

See `NEXT_STEPS.md` for the publishing order and `CONTENT_PORTABILITY.md` for
the content architecture guardrails.
