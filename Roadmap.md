# GTP_Port Roadmap

Last updated: 2026-07-15
Working branch: `gpt-handoff`

## Vision

Build AngrySquirrel.org as a fast, dark, editorial-first personal site
combining long-form publishing with a professional portfolio of software,
photography, video, writing, engineering, and case-study work.

The system remains:

- static-first
- Git-backed
- content-focused
- editable without routine template changes
- designed and routed by Astro
- managed through TinaCMS locally and TinaCloud in production
- deployed through GitHub and Cloudflare Pages
- portable through Markdown, YAML frontmatter, and locally owned media

## Milestone 1 - Foundation

Status: **Complete**

- Astro project
- GitHub repository
- Cloudflare Pages connection
- static build pipeline
- content collections
- shared source organization

## Milestone 2 - Functional content core

Status: **Complete**

- shared `/archive/[slug]/` detail routes
- rendered Markdown bodies
- unified Content Entries schema and shared detail layout
- linked archive pages
- collection-driven Homepage
- supporting pages and editable site settings

## Milestone 3 - TinaCMS integration

Status: **Complete**

- Tina CLI and Astro integration
- Astro 6.4.6 compatibility
- static output preserved
- local editor workflow
- six focused Tina collections
- one-click Portfolio, dual-placement, and Archive-to-Journal controls
- authenticated TinaCloud editor at `/admin/`
- GitHub Markdown retained as the source of truth

## Milestone 4 - GitHub and Cloudflare publishing

Status: **Complete**

- Cloudflare watches `gpt-handoff`
- pushes trigger deployments
- production Node version set to `22.22.0`
- TinaCloud client, token, and branch variables configured
- production build runs `tinacms build && astro build`
- authenticated production editing verified

## Milestone 5 - Accessibility and shared shell

Status: **Complete**

- skip link and visible focus states
- current-page navigation state
- keyboard-accessible compact mobile navigation
- reduced-motion handling
- favicons and shared descriptions
- canonical URLs and social metadata foundation
- passing shared-shell color contrast

## Milestone 6 - Page and component completion

Status: **Core complete; optional enhancements remain**

Complete:

- related Journal entries and Portfolio projects
- curated Portfolio bento grid with manual ordering and tile sizing
- project galleries and lightboxes
- live Journal and Portfolio Immich galleries
- inline narrative-image lightbox
- native, YouTube, and Vimeo project media
- reusable media components
- structured Resume editor and timeline
- editable Homepage preview headings linked to their full archives

Remaining when justified by real content:

- functional Journal topic routes; current topic chips are display-only
- Portfolio project filters
- inline narrative video blocks
- Resume print refinement

## Milestone 7 - Design refinement

Status: **Incremental; not a publishing blocker**

- Homepage hierarchy and rhythm
- Journal and Portfolio archive polish
- article reading experience
- case-study presentation
- responsive and cross-browser review

Refinement should be driven by real content instead of delaying publication.

## Milestone 8 - Real content and job-search readiness

Status: **In progress**

- replace Resume, About, and Contact placeholders
- publish representative Journal entries
- publish strong Portfolio projects and case studies
- add photography, video, writing, and engineering work
- revise Homepage positioning around the completed material
- remove test content after replacements are verified

## Milestone 9 - Launch quality

Status: **Not started**

- sitemap and robots.txt
- RSS
- final social-sharing images
- image optimization
- Lighthouse and performance work
- Pagefind if content volume warrants it
- Cloudflare Web Analytics
- final responsive, browser, domain, and broken-link checks

## Later integrations

- Giscus
- Resume PDF generation
- advanced related-content features

## Content architecture decision

Landing pages may use structured Tina sections or a limited block system.
Journal and Portfolio bodies should remain semantic Markdown so redesigns change
the renderer rather than requiring content rewrites. See
`CONTENT_PORTABILITY.md`.
