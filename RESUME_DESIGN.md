# Resume Design and Source Model

Last updated: 2026-08-07
Branch: `gpt-handoff`
Sprint: 13 - Resume rebuild

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

The fixed Tina Resume document at `src/content/pages/resume.md` remains the
single website source for Resume content.

Current structured fields:

- page title, eyebrow, headline, description, header style, and public links
- `professionalSummary` - professional profile narrative
- `competencies[]` - capability title and supporting detail
- `experience[]` - period, role, organization, location, description, highlights
- `education[]` - degree/credential, institution, focus, period

This model is intentionally retained for the first Sprint 13 implementation
because it already provides the necessary structured ownership and avoids an
unnecessary content migration. A later editor-only cleanup may relabel or group
fields, but should not create a second source of truth.

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
6. optional Markdown body, retained only for compatibility until the Tina
   editor cleanup is validated

The old `ResumeOverview` plus `Timeline` composition is no longer the active
Resume renderer.

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

PDF generation is not part of the initial Sprint 13 implementation. A generated
PDF is acceptable only if it can use the same structured source without creating
a parallel resume dataset or requiring routine manual synchronization.

Until that requirement is proven, application-specific DOCX/PDF resumes remain a
separate job-search artifact rather than a website publishing responsibility.

## Acceptance criteria

- `/resume/` reads as a professional-background page rather than a Word-resume copy
- all website Resume facts have one obvious editing location in Tina
- experience can be added, removed, reordered, and edited without Astro changes
- highlights remain independently editable within each role
- capabilities and education remain structured and reusable
- existing site typography, colors, navigation, and `/resume/` URL are preserved
- mobile reading order remains logical and semantic
- private application-only contact details are absent
- PDF functionality is either generated from this source or deliberately excluded
- Tina/schema cleanup is not considered complete until Tina indexing, TypeScript,
  Astro production build, and hosted-editor save behavior are verified

## Sprint 13 implementation state

Implemented on 2026-08-07:

- added `ResumeProfile.astro`
- wired `/resume/` to the new professional-profile renderer
- populated the structured Resume with current career experience, quantified
  accomplishments, capabilities, and education
- added LinkedIn and Contact as intentional public links

Still required before Sprint 13 can be marked complete:

- run the normal local Tina-aware validation gate from a workspace with GitHub
  CLI/network access
- verify the deployed page visually on desktop and mobile
- verify hosted Tina can edit, reorder, and save Resume fields
- decide whether to remove the legacy optional Resume body field and unused old
  Resume renderer components after the build/editor check
- perform the required project-documentation wrap and record final verification
