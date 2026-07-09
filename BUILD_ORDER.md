# Build Order

## Current Status

**Project:** GTP_Port
**Framework:** Astro
**Hosting:** Cloudflare Pages
**Repository:** GitHub

Current build phase: **Foundation + Design System transition into Content Architecture**

---

# Completed

## Phase 1 — Foundation

* [x] Created new Astro project
* [x] Created GitHub repository
* [x] Connected Cloudflare Pages deployment
* [x] Verified automatic deployment pipeline
* [x] Confirmed static Astro build workflow

## Phase 2 — Design System Foundation

* [x] Established base layout structure
* [x] Created Navigation component
* [x] Created Footer component
* [x] Created Hero component
* [x] Created Button component
* [x] Created Container component
* [x] Created SectionTitle component
* [x] Created PortfolioCard component
* [x] Created JournalCard component
* [x] Created FeaturedArticle component

## Phase 3 — Astro Content Migration

* [x] Migrated content collections to Astro v6 format
* [x] Moved content configuration to `src/content.config.ts`
* [x] Added collection loaders
* [x] Verified Astro build reaches route generation

---

# Current Work

## Content Architecture

### Journal

Status:

* Collection configured
* Dynamic route created
* Route generation repaired
* Content rendering pending

Remaining:

* Add journal markdown entries
* Connect JournalCard components
* Build editorial archive layout

### Portfolio

Status:

* Collection configured
* Dynamic route created
* Route generation repaired
* Content rendering pending

Remaining:

* Add project markdown entries
* Connect PortfolioCard components
* Build case study layout

---

# Next Build Steps

## 1. Finish Content Routes

* [ ] Verify `/journal`
* [ ] Verify `/journal/[slug]`
* [ ] Verify `/portfolio`
* [ ] Verify `/portfolio/[slug]`

## 2. Build Homepage

Target structure:

* Hero
* Featured Work
* The AngrySquirrel Journal

  * FeaturedArticle
  * JournalCard list
* About section

Use placeholder content initially.

## 3. Apply Visual System

* Dark theme implementation
* Steel blue accent palette
* Editorial serif typography
* Spacing system
* Card styling
* Responsive behavior

## 4. Expand Content Types

Add support for:

* Software projects
* Photography galleries
* Video projects
* Published writing
* Resume content

---

# Future Phases

## CMS

Deferred until core site is complete.

Planned:

* TinaCMS integration
* Git-backed editing workflow
* Content collections management

## Integrations

Later:

* Immich photo integration
* Giscus comments
* Resume generation
* Cloudflare Analytics
* Search
* SEO improvements
