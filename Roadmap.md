# GTP_Port Roadmap

Last updated: 2026-07-10  
Working branch: `gpt-handoff`

## Vision

Build AngrySquirrel.org as a fast, dark, editorial-first personal site combining long-form publishing with a professional portfolio of software, photography, video, writing, engineering, and case-study work.

The system remains:

- static-first
- Git-backed
- content-focused
- editable without routine code changes
- designed and routed by Astro
- managed through TinaCMS without giving the CMS ownership of layout or styling

## Milestone 1 — Foundation

Status: **Complete**

- Astro project
- GitHub repository
- Cloudflare Pages deployment
- static build pipeline
- content collections
- shared source organization

## Milestone 2 — Functional content core

Status: **Complete**

- working Journal and Portfolio detail routes
- rendered Markdown bodies
- expanded content schemas
- dedicated detail layouts
- linked archive pages
- collection-driven homepage
- non-empty supporting pages
- editable site settings and page content
- valid static route set

## Milestone 3 — TinaCMS local integration

Status: **Nearly complete**

Complete:

- Tina CLI installed
- Tina Astro integration installed
- Astro aligned to version 6.4.6
- static output preserved
- Tina admin running locally
- existing Markdown mapped into Tina collections
- homepage edit successfully verified end to end
- page editing separated into Homepage, Archive Pages, and Standard Pages

Remaining:

- verify every collection
- remove initializer demo leftovers
- run a clean production build
- commit the completed local integration

## Milestone 4 — TinaCloud and GitHub publishing

Status: **Not started**

- create/connect TinaCloud project
- configure client ID and token
- configure GitHub authentication
- confirm `gpt-handoff` or production branch behavior
- test deployed `/admin/`
- verify CMS commits and Cloudflare rebuilds

Exit condition: a browser-based Tina edit creates a Git commit and the deployed static site rebuilds successfully.

## Milestone 5 — Accessibility and shared shell completion

Status: **Next after Tina production access**

- skip link
- visible focus states
- current-page navigation state
- deliberate mobile navigation
- reduced-motion handling
- favicon and metadata cleanup
- keyboard and contrast review

## Milestone 6 — Page and component completion

Status: **Not started**

- Journal filters or category routes
- related articles
- project filters
- galleries and lightbox
- video embeds
- reusable media components
- resume timeline and print refinement

## Milestone 7 — Design completion

Status: **Not started**

- homepage hierarchy and rhythm
- Journal archive polish
- Portfolio archive polish
- article reading experience
- case-study presentation
- phone, tablet, laptop, and wide-screen review
- cross-browser review

## Milestone 8 — Real content

Status: **Not started**

- replace placeholders
- publish representative Journal entries
- publish portfolio projects and case studies
- add photography, video, and writing work
- complete biography, resume, and contact information

## Milestone 9 — Launch quality

Status: **Not started**

- canonical URLs
- Open Graph metadata
- sitemap and robots.txt
- RSS
- image optimization
- Lighthouse and performance work
- Pagefind
- Cloudflare Web Analytics
- custom-domain launch checks

## Later integrations

- Giscus
- Immich
- resume PDF generation
- advanced related-content features
