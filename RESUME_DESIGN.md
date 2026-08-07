# Resume Design and Source Model

Last updated: 2026-08-07
Branch: `gpt-handoff`
Sprint: 13 - Resume rebuild
Status: Complete and owner-verified on deployed site

## Purpose

The public Resume is a professional-background page, not a literal reproduction
of a two-page job-application resume. Its job is to explain how Patrick works,
show durable career evidence, and connect strategic communication, creative
production, and technical problem-solving into one coherent professional story.

Application-specific resumes may continue to be tailored separately. The website
must not require a second copy of the same career facts to remain current.

## Public-page goals

- feel like part of AngrySquirrel.org rather than an embedded Word resume
- present a concise professional profile before chronology
- show capabilities as durable themes rather than keyword stuffing
- make quantified accomplishments easy to scan
- preserve meaningful context around roles instead of reducing every role to a
  dense bullet list
- remain useful on desktop and mobile without JavaScript
- preserve the existing site typography and color system
- keep `/resume/` as the canonical public URL
- avoid publishing private application-only contact information

## Source model

The fixed Tina Resume document at `src/content/pages/resume.md` is the single
website source for Resume content.

Current structured fields:

- page title, eyebrow, headline, description, header style, and public links
- `professionalSummary` - professional profile narrative
- `competencies[]` - capability title and supporting detail
- `experience[]` - period, role, organization, location, description, highlights
- `education[]` - degree/credential, institution, focus, period

This model was intentionally retained because it already provides the necessary
structured ownership and avoids an unnecessary content migration. A later
editor-only cleanup may relabel or group fields, but must not create a second
source of truth.

## Public rendering

`src/pages/resume.astro` renders the fixed Resume document through
`src/components/resume/ResumeProfile.astro` inside the shared standard-page
shell.

The public hierarchy is:

1. page header and public links
2. Profile
3. Capabilities
4. Professional Background
5. Education & Credentials

The legacy `ResumeOverview.astro` and `Timeline.astro` components were removed
after the deployed replacement was owner-verified.

## Content rules

Career facts should be durable and broadly useful rather than tailored to one
job posting. Prefer concrete outcomes, scope, and representative responsibilities.
Do not add a claim solely because it is useful for one application.

Public Resume content should not include a street address, private reference
information, or other application-only personal details. Public contact should
route through intentionally published links such as LinkedIn and `/contact/`.

Experience entries should normally include:

- one short role description
- three to six high-signal highlights
- quantified results when verified
- enough context to explain scope without recreating every possible resume bullet

## PDF decision

PDF generation is deliberately excluded from Sprint 13. A generated PDF is
acceptable only if it can use the same structured source without creating a
parallel resume dataset or requiring routine manual synchronization.

Until that requirement is proven, application-specific DOCX/PDF resumes remain a
separate job-search artifact rather than a website publishing responsibility.

## Acceptance results

- [x] `/resume/` reads as a professional-background page rather than a Word-resume copy
- [x] website Resume facts live in one fixed Tina Resume document
- [x] experience is structured for add/remove/reorder/edit without Astro changes
- [x] highlights remain independently editable within each role
- [x] capabilities and education remain structured and reusable
- [x] existing site typography, colors, navigation, and `/resume/` URL are preserved
- [x] deployed page was owner-reviewed and accepted
- [x] private application-only contact details are absent
- [x] PDF generation is deliberately excluded pending a single-source strategy
- [x] legacy public-rendering components were removed after deployment verification

## Compatibility hold for Sprint 14

The Tina Resume collection still exposes the legacy `Additional Resume Content`
body field. The current Resume document has no body content and the public route
does not render that field. It is retained temporarily because removing a Tina
schema field requires regenerating and validating `tina-lock.json`; that change
should happen during Sprint 14's schema/QA pass rather than leaving the generated
schema out of sync.

## Sprint 13 implementation summary

Completed on 2026-08-07:

- reviewed and approved the Resume purpose, source model, hierarchy, and acceptance criteria
- added `ResumeProfile.astro`
- wired `/resume/` to the new professional-profile renderer
- populated the structured Resume with current career experience, quantified
  accomplishments, capabilities, and education
- added LinkedIn and Contact as intentional public links
- deployed and owner-verified the redesigned page
- removed the unused `ResumeOverview.astro` and `Timeline.astro` components
- deliberately deferred Tina body-field removal and PDF generation rather than
  creating parallel data or an unvalidated schema-lock change
