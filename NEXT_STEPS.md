# Next Steps - 2026-07-14

## Current checkpoint

AngrySquirrel.org is ready for real-world use and content population.

Operational now:

- Cloudflare Pages deployment from `gpt-handoff`
- authenticated TinaCloud editor at `/admin/`
- Homepage, Journal, Portfolio, About, Resume, and Contact routes
- Journal and Portfolio detail pages
- project media, video embeds, and narrative-image lightboxes
- live Immich galleries on Journal and Portfolio entries
- related Journal entries and Portfolio projects
- structured Resume editing
- responsive navigation, accessibility, canonical URLs, and social metadata

The active goal is no longer to wait for every roadmap refinement. The active
goal is to publish enough strong, accurate material to support a job search.

## Immediate content order

1. Replace the Resume placeholder content with current professional history.
2. Complete About and Contact with a clear professional positioning statement
   and reliable contact path.
3. Publish two or three strong Portfolio projects or case studies.
4. Publish one or two representative Journal entries.
5. Select durable cover images and local narrative images for each important
   project; use Immich as the expanded gallery rather than the only copy.
6. Review the Homepage after real content is present and adjust its wording and
   featured-item limits.

## Minimum content standard

Before marking an entry published:

- use a stable, lowercase, kebab-case filename
- write a specific title and concise description
- add an intentional cover image where appropriate
- explain the problem, contribution, process, and outcome
- include useful alt text for meaningful images
- remove localhost URLs and placeholder language
- verify every external and Immich link
- set `draft: false` only after reviewing the deployed page

## Non-blocking refinement queue

These remain useful, but they should not delay publishing:

- Journal category filters or category routes
- Portfolio project filters
- inline narrative video blocks
- Resume print refinement
- Journal and Portfolio archive polish
- case-study layout refinement
- responsive and cross-browser polish

## Launch-quality queue

After representative content is live:

- sitemap and robots.txt
- RSS
- final social-sharing images
- image optimization
- Lighthouse and performance review
- Pagefind search if the content volume justifies it
- Cloudflare Web Analytics
- final custom-domain and broken-link checks

## Verification workflow

With TinaCloud credentials:

```bash
npm run build
git diff --check
git status --short
```

Without TinaCloud credentials, use `npm run build:astro` for the local static
site check. Cloudflare performs the complete Tina and Astro production build
with its configured environment variables.
