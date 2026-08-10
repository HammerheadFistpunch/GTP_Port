# GTP_Port Project Log

## 2026-08-10 - Immich picker infinite scrolling implemented

Completed:

- Replaced the shared Immich picker's manual **Load more** control with
  automatic pagination as the editor approaches the bottom of the image grid.
- Applied the behavior to every authoring path that uses the shared picker,
  including cover images, structured galleries, Markdown insertion, and
  Import review.
- Added a synchronous request guard to prevent duplicate page requests and
  kept pagination tied to the submitted search rather than unfinished search
  text.
- Added a focused regression test for the scroll observer, scroll container,
  pagination sentinel, and duplicate-request guard.

Media-quality note:

- R2 publication still copies Immich's generated `thumbnail` and `preview`
  variants without additional recompression; the larger `preview` becomes the
  website's `web` variant.
- After changing Immich thumbnail quality or size, increment
  `MEDIA_VARIANT_VERSION` in Cloudflare Pages before selecting images again so
  new immutable R2 object URLs are created.

## 2026-08-10 - Immich v3 album browsing compatibility fix

Corrected the follow-up album-opening failure in the shared Immich picker:

- replaced the legacy `GET /albums/{id}` asset lookup, which no longer returns
  an album's asset list in Immich v3
- album photos now load through Immich's supported paginated
  `POST /search/metadata` endpoint with an `albumIds` filter
- retained filename and smart searches within an opened album
- added a backend regression test covering the exact endpoint, request body,
  returned image, total, and next-page behavior

Validation:

- the new album browsing regression test passes
- all functional Sprint 16 media backend tests pass

## 2026-08-09 - Sprint 17 authoring UX follow-up implemented

Implemented from owner review:

- added an Albums view with cover thumbnails/counts and direct album opening
  in the shared Immich picker
- rebuilt the picker at mobile widths as a full-viewport dialog with stacked
  touch-sized controls and responsive photo/album grids
- reordered Journal creation around Title and Entry Content first, followed by
  Journal Section, Status, Topics, and the remaining supporting metadata
- retained compact selects for Journal Section/Status and converted Topics from
  an always-open checkbox grid to an expandable multi-select dropdown
- defaulted new entries to Draft, today's date, an empty body, and Write mode
- consolidated formatting and view controls into one compact accessible icon
  toolbar; removed Split from the mobile control set
- removed the redundant Additional Media authoring field and empty stored
  arrays while preserving legacy Astro schema/layout read compatibility
- regenerated `tina/tina-lock.json` from source rather than editing it by hand

Validation:

- all 30 authoring/media tests pass
- focused strict TypeScript for the changed Tina editor/picker paths passes
- full repository TypeScript reaches only the pre-existing `TopicField` generic
  mismatch
- Tina admin production bundle and regenerated schema lock build successfully
  with cloud checks/indexing disabled
- Astro-only build remains blocked by the workspace network approval gate
- `git diff --check` passes

## 2026-08-09 - Sprint 17 hosted acceptance completed

Completed and owner-verified against the deployed site:

- confirmed the deployed Immich/R2 connector built successfully and is working
- verified Immich selection in a structured image field
- verified Immich insertion into Markdown
- verified Immich selection/insertion during Import review
- confirmed durable content stores permanent `media.angrysquirrel.org` URLs
- confirmed the selected R2-backed image renders publicly

Sprint 17 is complete. Sprint 18 gallery architecture/security remains planned
and intentionally paused until the owner returns to that work.


## 2026-08-09 - Sprint 17 site-wide media integration implemented

Implemented:

- completed and documented the required inventory of structured image fields,
  Markdown insertion, Import, stored source shapes, and public renderers
- added one shared Tina Immich picker with smart/filename search, albums,
  protected previews, pagination, and explicit selection
- made selection publish or reuse the asset through the protected backend and
  insert only the returned permanent R2 `web` URL
- connected the picker to Homepage, Custom Page, Journal cover, image block,
  and image-type Additional Media source controls through the shared structured
  image field
- added **Immich image** to Journal, Standard Page, Custom Page, and Import
  Markdown editing
- reused the picker for Import cover selection while preserving draft-only
  import behavior
- preserved Media Manager `/uploads/...`, safe relative Markdown, and external
  HTTPS sources; no stored schema or public renderer migration was required
- kept live `immichGallery` delivery explicitly deferred to Sprint 18

Validation:

- all 28 authoring/media tests pass
- focused strict TypeScript for every changed/new Tina component passes
- local Tina admin production bundle compiles successfully with cloud checks
  and indexing disabled; `tina/tina-lock.json` is unchanged because stored
  schema shapes did not change
- `git diff --check` passes
- standalone repository TypeScript still reaches only the pre-existing
  `TopicField` generic mismatch after Astro types are available
- the Astro-only build could not start in this workspace because its network
  approval was cancelled by the runtime; this is recorded as an environment
  limitation, not a successful build

Remaining acceptance:

- deliberately publish the implementation
- verify one structured field, Markdown insertion, and Import review in hosted
  `/admin/`
- save a draft using a permanent `media.angrysquirrel.org` URL and verify its
  public renderer before closing Sprint 17

## 2026-08-09 - Sprint 16 hosted acceptance completed

Completed and owner-verified against the deployed site:

- authenticated media status returned HTTP 200 with `configured: true`
- Immich browsing returned the expected image asset and its protected preview
  opened successfully through the admin endpoint
- published both deterministic R2 variants for asset
  `9df7eba8-7414-473c-8adb-cbb4c375bcdc`
- confirmed the public `thumbnail` WebP (13,452 bytes) and `web` JPEG
  (356,635 bytes) load from `media.angrysquirrel.org`
- repeated publication returned HTTP 200 with `reused: true` for both
  variants and unchanged URLs/sizes
- confirmed the public `web` image loads in an incognito session without an
  admin/Access session
- stopped only the `cloudflared` Immich Tunnel, disabled browser cache, and
  confirmed the public R2 image remained available
- restarted `cloudflared` and confirmed Immich browsing recovered with
  HTTP 200 and one returned item

Sprint 16 is complete. Sprint 17 is now the active build step for site-wide
Immich/R2 media selection and publication integration.

## 2026-08-08 - Sprint 16 infrastructure configured; hosted acceptance pending

Completed:

- created the least-privilege Immich media API key
- created the Cloudflare Access service token and Service Auth application for
  `immich-origin.angrysquirrel.org`
- installed a persistent `cloudflared` connector beside Immich in Docker on
  Windows and added it to the owner's Compose configuration using an
  environment-supplied tunnel token
- routed the protected origin to Immich and confirmed an ordinary/incognito
  browser receives `Forbidden`, proving DNS, Tunnel connectivity, and Access
  enforcement are active
- created the `angrysquirrel-media` R2 bucket, activated
  `media.angrysquirrel.org`, and kept `r2.dev` disabled
- bound the bucket to Pages as `MEDIA_BUCKET` and configured the production
  media URL plus encrypted Immich and Access service-token values
- reached the live browser-console acceptance-test stage

Still in progress:

- confirm the authenticated status endpoint returns HTTP 200 with
  `configured: true`
- browse one Immich asset and verify its protected preview
- publish the first `thumbnail` and `web` variants to R2
- confirm a repeated publish reports `reused: true` for both variants
- confirm the public R2 URL works without an Access session and remains
  available while Immich or its Tunnel is temporarily offline
- begin Sprint 17 only after all hosted checks pass

## 2026-08-08 - Sprint 16 Immich-to-R2 backend implemented

- Added an Access-protected `/admin/api/media/*` Pages Functions subtree with
  exact-owner authorization and same-origin mutation checks.
- Added server-side Immich album browsing, smart/filename asset search, date
  filters, private editor previews, image-only validation, and minimized editor
  responses that omit origin paths, GPS details, credentials, and the Immich
  hostname.
- Added optional Cloudflare Access service-token forwarding for a dedicated
  Tunnel-protected Immich origin.
- Added duplicate-safe R2 publishing with deterministic asset/checksum revision
  keys, `HEAD` reuse, immutable cache metadata, and separate `thumbnail` and
  `web` variants.
- Kept the workflow free by storing Immich's generated thumbnail/preview files;
  the current Cloudflare Images raw-byte binding requires a paid Images
  subscription.
- Added `MEDIA_BACKEND_GUIDE.md` covering least-privilege Immich permissions,
  Tunnel/Access service authentication, R2/custom-domain binding, secrets,
  endpoint behavior, retention, and hosted acceptance checks.

Validation:

- all 24 authoring and media-backend tests pass.
- the complete Cloudflare Pages Functions worker compiles with Wrangler 4.120.0.
- Astro builds all 50 static pages successfully.
- `git diff --check` passes.
- standalone strict TypeScript still reports only the pre-existing `TopicField`
  generic mismatch.
- the full Tina-aware build reaches TinaCloud code generation but cannot run in
  this workspace without `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN`; no schema was
  changed in Sprint 16.

Activation follow-up:

- create and bind the `angrysquirrel-media` R2 bucket and activate
  `media.angrysquirrel.org`.
- configure the private Immich origin, read-only API key, optional Access
  service token, owner identity, and Pages variables/secrets.
- deliberately deploy, publish one image, confirm repeat publication reports
  both variants as reused, and confirm its R2 URL still loads while Immich is
  temporarily unavailable.
- begin Sprint 17 only after this hosted acceptance gate passes.

## 2026-08-08 - Sprint 15 unified page-body editor completed

- Replaced the Standard Page and Custom Page `rich-text` body controls with the
  same source-preserving Markdown Write/Split/Preview field used by Journal
  entries.
- Kept the scope strictly to body fields. Homepage sections, Journal landing
  copy, Resume fields, descriptions, SEO fields, and Custom Page blocks retain
  their existing structured/plain-text controls.
- Preserved the existing `.md` body storage and Astro rendering path, so About,
  Contact, and existing Custom Page content require no migration.
- Regenerated `tina/tina-lock.json` through local Tina indexing.
- Added regression coverage proving the About and Contact Markdown bodies
  survive Tina parse/serialize/reopen and that all three body schemas share the
  same editor.
- Established Phase 3 Sprints 16-18 for the Immich-to-R2 backend, site-wide
  media integration, and later gallery security work.

Validation:

- all 18 authoring tests pass.
- Astro builds 50 static pages successfully.
- `git diff --check` passes.
- Tina local indexing and schema-lock generation succeed.
- standalone strict TypeScript remains blocked by the pre-existing `TopicField`
  generic mismatch; Sprint 15 introduced no new TypeScript diagnostic.

Deployment follow-up:

- reindex `gpt-handoff` in TinaCloud after publication.
- verify Write/Split/Preview on About, Contact, and a Custom Page body in hosted
  `/admin/`.

## 2026-08-08 - Google Docs importer maintenance fix

- Removed the incorrect requirement that every imported `.md`/`.mdx` source
  already contain YAML frontmatter.
- Made Review Import treat body-only Google Docs Markdown as the complete body,
  derive an editable title and safe filename from the uploaded filename, and
  leave canonical frontmatter generation to Tina when the draft is created.
- Preserved blocking validation for a source that starts a YAML header but does
  not close it, malformed YAML, unsafe body content, and other existing import
  safeguards.
- Sorted active Topics alphabetically and exposed all of them as visible,
  selectable review controls while retaining comma-separated label/slug input.
- Added a regression test modeled on the owner's `Big Sir_ Pt1.md` Google Docs
  export and updated owner/maintenance import guidance.

Validation:

- all 16 authoring, media, import, rollout, and Topic-migration tests pass.
- the focused importer suite passes all five tests.
- the Astro production build succeeds and generates 49 static pages.
- `git diff --check` passes.
- standalone strict TypeScript remains blocked by the existing `TopicField`
  schema typing mismatch; no Import screen TypeScript errors were reported.

## 2026-08-06 - Session wrap after Sprint 12

- Confirmed Sprint 12A through 12D are complete, deployed, and owner-verified.
- Confirmed remote `gpt-handoff` baseline `4a88fef` contains the reviewed Sprint
  12D tree before this documentation-only wrap-up.
- Kept Sprint 13 Resume content and design review as the next planned work.
- Kept Sprint 11's automatic-build cutoff and negative/security/recovery checks
  explicitly open.
- Added `STARTUP_PROMPT.md` as the copy-ready next-session handoff.
- Documented a durable GitHub CLI setup for fresh workspaces, including a
  persistent config directory, absolute credential-helper path, live device-flow
  polling, fresh-shell verification, remote fast-forward checks, and no-force
  publishing.

No application code, Tina schema, site content, or deployment configuration was
changed in this wrap-up.

## 2026-08-06 - Sprint 12D authoring rollout completed

- Recorded the owner's hosted Sprint 12C import approval and preserved the
  resulting canonical `imported-entry.mdx` draft as a regression fixture.
- Audited all 11 Content Entries through Tina's MDX parser, serializer, and
  reopen path. Every Markdown body is preserved after delimiter normalization.
- Verified every existing body against the final safe link, image, HTML, and
  supported-MDX policy.
- Added whole-collection regression tests so later Tina or schema changes fail
  visibly if an existing body would be rewritten or rejected.
- Returned the Sprint 12A proof entry to draft after its deployed renderer check;
  both Sprint 12 verification documents remain available without publishing
  test content.
- Reconciled Sprint 11's hosted status: the protected Publish Site action and
  deploy hook successfully triggered a deployment, while automatic production
  builds remain enabled and still trigger on Tina saves. The cutoff, negative
  save test, wrong-identity rejection, and failed-build exercise remain open.
- Updated the build order, roadmap, README, documentation index, publishing,
  import, content, portability, and maintenance guidance for owner rollout.

Validation:

- all authoring, media, import, and rollout tests pass.
- strict TypeScript checking and `git diff --check` pass.
- Tina local indexing, schema generation, and the custom admin bundle compile.
- the Tina-aware Astro production build excludes both draft verification
  entries and preserves the expected real-content routes.

Sprint 12 is complete. Sprint 13 begins with a separate Resume content and
design review.

## 2026-08-06 - Sprint 12C Markdown/MDX import implemented

- Added a dedicated **Content → Import Entry** Tina screen for `.md`, `.mdx`,
  and pasted-source ingestion.
- Added safe YAML frontmatter parsing with documented aliases for description,
  dates, entry type, placement, topic, section, tags, cover, technologies, and
  entry links.
- Added review-time completion for canonical filename, title, description,
  topic, placement, type, date, section, tags, cover, and body.
- Added controlled-tag matching by label, permanent slug, alias, or stored
  reference; unresolved tags block creation with an owner-facing resolution.
- Added validation for malformed frontmatter, empty bodies, unsafe link/image
  sources, embedded credentials, path-like filenames, executable MDX,
  unsupported components, and malformed YouTube elements.
- Made import create-only and draft-only. Filename collisions fail rather than
  overwriting an existing document.
- Routed creation through Tina's current `EntriesMutation`, producing canonical
  `.mdx` frontmatter while preserving the portable Markdown body.
- Added `IMPORT_GUIDE.md` and maintenance/portability guidance.

Validation:

- all nine authoring, media, and import tests pass.
- strict TypeScript checking and `git diff --check` pass.
- Tina local indexing and the custom admin bundle compile.
- a disposable local GraphQL import created the expected draft frontmatter and
  byte-preserved body, then was removed from the worktree.
- the Tina-aware Astro build produces 51 pages; the increase from 50 reflects
  the owner's hosted publication of the Sprint 12 proof entry.

Hosted Import Entry, tag-registry, create/save/reopen, duplicate-name, unsafe
URL, and unsupported-MDX checks passed owner review before Sprint 12D.

## 2026-08-06 - Sprint 12B external image authoring implemented

- Added one reusable Tina image control that retains Media Manager selection and
  upload while also accepting a directly entered HTTPS image URL.
- Added contained image previews, managed/external source labels, a clear action,
  and actionable client-side validation to cover, header, social, image-block,
  Homepage Hero, and Homepage destination-image fields.
- Added one shared source policy for repository-managed `/uploads/...` paths and
  credential-free HTTPS URLs, including public Immich-hosted asset URLs.
- Rejected HTTP, protocol-relative, data, credential-bearing, traversal, and
  ambiguous relative values in Tina and Astro content validation.
- Hardened Entry cover/gallery, Flexible Page header/social, and image-block
  renderers so invalid sources are omitted rather than emitted into the page.
- Updated the Markdown preview to omit unsafe inline-image sources with a visible
  correction message while preserving safe `/uploads`, HTTPS, and portable
  relative Markdown images.
- Added an external HTTPS cover image to the draft authoring proof and five media
  and round-trip tests covering supported and rejected source forms.

Validation:

- `npm run test:authoring` passes all five tests.
- strict TypeScript checking passes.
- Tina local indexing, schema generation, custom admin compilation, and the
  combined Astro child build pass with locked GraphQL version `2.4.7`.
- Astro still produces 50 public pages and excludes the draft proof entry.

Hosted image select/upload and external-URL preview/save/reopen remain required
before Sprint 12C. Published-content renderer review remains in the 12D rollout;
the proof entry is intentionally draft-only and has no public route.

## 2026-08-06 - Sprint 12A hosted YouTube preview correction

- Replaced the editor's informational YouTube card with the expected responsive,
  playable preview for valid `<YouTube />` elements.
- Restricted preview players to valid HTTPS YouTube URLs, converted them to
  `youtube-nocookie.com` embeds, and retained the non-playing fallback for an
  invalid or unsupported URL.
- Added URL-parser coverage for standard, short, and Shorts links plus unsafe
  protocol and lookalike-host rejection.

Hosted verification remains required after deployment before Sprint 12B.

## 2026-08-06 - Sprint 12A hosted editor layout correction

- Removed the split editor's fixed 28-rem-per-pane minimum, which could make
  the Markdown source and preview wider than Tina's available content panel.
- Kept split mode as equal, genuinely shrinkable columns and added a
  container-based stacked layout when the editor panel is narrower than 44rem.
- Constrained the preview, images, code blocks, and tables so wide content
  scrolls inside its own pane instead of creating a page-level scrollbar or
  clipping beyond the Tina canvas.

Hosted verification remains required after deployment before Sprint 12B.

## 2026-08-06 - Sprint 12A Markdown editor proof implemented

- Replaced the Journal Entry rich-text body control with a required string-body
  field so Tina edits the portable Markdown/MDX source directly.
- Added a custom source editor with Write, Split, and Preview modes. The live
  preview allowlists Markdown output, removes active/unsafe HTML, rejects unsafe
  link and image protocols, and never executes body MDX.
- Preserved the established `<YouTube />` element as raw source and represented
  valid URLs with a constrained player preview. Other custom MDX components
  produce a visible compatibility warning instead of being silently interpreted.
- Added a draft Content Entry fixture containing headings, links, an absolute
  image, lists, a blockquote, fenced code, and the existing YouTube element.
- Added Node tests that parse, serialize, and reopen the draft through Tina's
  own MDX file utilities, then confirm standard Markdown and YouTube source
  survive the round trip.
- Regenerated `tina/tina-lock.json`; the Journal Entry body is now a required
  GraphQL string rather than a rich-text JSON value.

Validation:

- `npm run test:authoring` passes the round-trip and YouTube URL safety tests.
- `npx tsc --noEmit` passes after Astro content types are generated.
- Tina local indexing, generated schema, lock generation, and custom admin
  compilation pass.
- a secret-free Astro production build still produces 50 public pages; the
  Sprint 12A fixture remains draft-only and receives no public route.

Hosted Tina save/reopen review remains the deployment gate before Sprint 12B.

## 2026-08-06 - Sprint 11 deliberate publishing implemented locally

- Added a Tina **Site → Publish Site** screen that compares the latest saved
  `gpt-handoff` commit with the commit embedded in the live Cloudflare build.
- Added accurate checking, no-pending, pending, publishing, success, and failure
  states plus 15-second live-deployment polling.
- Added `/admin/api/publish` as a Cloudflare Pages Function. It validates the
  Cloudflare Access JWT, requires the configured owner email, looks up the
  public branch head server-side, and calls the encrypted deploy hook without
  exposing it to Tina's browser bundle.
- Added a 15-minute `PUBLISH_STATE` KV lock so duplicate requests across tabs
  report an already-publishing state; completed deployments clear their own lock.
- Added `/deployment.json` with no-store caching so Tina can distinguish the
  currently live commit from newer saved work after reloads.
- Added `PUBLISHING_GUIDE.md` and safe environment-variable placeholders. The
  deploy-hook URL remains an encrypted Cloudflare secret and never belongs in
  the repository or a public-prefixed variable.

Validation:

- `npx tsc --noEmit` passes.
- Tina local indexing and custom admin compilation pass.
- the Cloudflare Pages Function compiles successfully with Wrangler.
- a secret-free Astro build produces the expected 50 public pages plus the
  deployment manifest.

Hosted configuration and the safe automatic-build cutoff remain required. The
existing automatic production build must stay enabled until the new relay and
deploy hook have triggered a successful smoke-test build.

## 2026-08-06 - Sprint 10 Tina navigation and schema cleanup implemented

- Added a grouped owner-facing Tina menu: **Settings** contains Site Settings
  and Tags; **Pages** contains Main Homepage, Journal Homepage, About, Contact,
  Resume, and New Pages; **Content** retains Journal Entries; Tina's **Site**
  group retains Media Manager.
- Hid Tina's redundant flat collection list so every retained owner task has
  one obvious menu location. The underlying collection names remain stable for
  GraphQL references and existing content.
- Relabeled Homepage, Journal, Flexible Page, and Content Entry collections
  around owner tasks and hid the internal `pageType` controls.
- Removed the unused Journal `topics`, Flexible Page `navigationOrder`, entry
  `featured`, `portfolioOrder`, and `tileSize` fields from Tina, Astro schemas,
  and stored content.
- Removed the unreferenced Tina helper that queried the nonexistent legacy
  `post` collection.
- Kept `placement` as a documented compatibility field because the published
  Photography gallery remains Portfolio-only and Journal filters still consume
  it. Its redesign belongs with the Sprint 12 authoring model.
- Regenerated `tina/tina-lock.json` through Tina's local development build.

Validation:

- `npx tsc --noEmit` passes.
- Tina local indexing, generated client/schema, and admin compilation pass.
- the compiled admin bundle contains the grouped navigation extension.
- the regenerated Tina lock has the new labels and none of the removed fields.
- a secret-free Astro validation build produces the expected 50 routes.
- the ordinary Astro command is blocked in this workspace only when the Tina
  integration attempts its network check; no site source or route error occurs.

Hosted sidebar navigation, document saving, New Pages creation, and TinaCloud
reindexing remain the deployment verification gate.

## 2026-08-06 - Sprint 9 Portfolio and Homepage simplification implemented

- Removed the public Portfolio landing page and made Portfolio an accessible
  label-only navigation group.
- Kept Video and Photography as direct Flexible Pages; routed
  Software/Ideation and Case Studies/Research to `/journal/projects/`, and
  Writing to `/journal/`.
- Replaced the Homepage bento cards with five compact image-and-label links.
- Replaced the misleading Homepage order selector with a real drag-and-drop
  control plus keyboard move buttons.
- Migrated both case studies into the Projects Journal section without changing
  their `/archive/` detail URLs.
- Retired legacy category pages, Services proof pages, `Test-content.mdx`, and
  their unused Portfolio renderer/resolver code after reference checks.
- Added Cloudflare redirects for every retired public route.
- Regenerated the Tina lock through the local Tina-aware build.

Validation:

- `npx tsc --noEmit` passes.
- `npm run build:astro` passes with 50 routes.
- `npx tinacms dev -c "astro build"` passes, including local indexing and
  custom Tina component compilation.
- the full cloud `npm run build` reaches the expected missing TinaCloud
  `clientId`/token boundary in this credential-free workspace.
- generated-route assertions confirm the two case-study URLs and surviving
  Portfolio pages, absence of retired routes, and copied `_redirects` file.

Cloudflare redirects and hosted Tina save/reorder behavior remain the owner
verification gate before Sprint 9 is marked deployed.

## 2026-08-06 - Sprint 8 decisions locked

Owner decisions close the Sprint 8 planning gates:

- Software/Ideation and Case Studies/Research will use the existing Projects
  Journal section; Writing will use the complete Journal feed.
- Homepage section ordering will use genuine drag-and-drop plus keyboard move
  controls.
- Services proof pages and `Test-content.mdx` will retire only after reference
  checks and redirects to the closest surviving destinations.
- Markdown-first authoring and the protected server-side publish relay remain
  the approved implementation directions from the feasibility review.

The final Tina sidebar organization remains a Sprint 10 decision. Sprint 9 can
proceed in schema-safe chunks without adding new Portfolio-only tags.

## 2026-08-06 - Sprint 8B feasibility findings recorded

Verified from current TinaCMS and Cloudflare documentation that the requested
authoring and publishing workflows are feasible:

- Tina text fields can own the Markdown body, and custom React field components
  can provide a source editor plus rendered preview.
- repository uploads can remain available while a custom source control accepts
  validated external HTTPS image URLs.
- Cloudflare Pages can disable automatic production-branch deployments and
  trigger a chosen branch through a deploy hook.
- the deploy hook cannot live in Tina's static browser bundle; a protected
  server-side relay must hold the secret and authenticate the Publish action.

Recorded the architecture, implementation spikes, fallback, and security gates
in `TINA_FEASIBILITY.md`. No application or service configuration changed.

## 2026-08-06 - Sprint 8A Tina audit completed

Completed a non-destructive inventory of all Tina collections, visible fields,
nested controls, stored content, Astro validation, renderers, and routes. The
result is recorded in `TINA_AUDIT.md`.

Key findings:

- Archive Pages combines active Journal settings with the retiring Portfolio
  landing model, which exposes controls irrelevant to each document.
- Homepage ordering is stored as a list of predefined string options, so the
  current drag-to-reorder instruction does not match the editor control.
- Journal `topics`, Flexible Page `navigationOrder`, and a legacy Tina `post`
  query helper have no active public consumer.
- Portfolio placement, ordering, tile sizing, packing, and override fields must
  remain only until Sprint 9 migrates routes, links, and fallbacks.
- the three planned Journal-backed Portfolio destinations do not yet have exact
  controlled tags, and several Homepage/navigation/footer links still target
  routes scheduled for retirement.
- Services proof pages and a published Test entry require an owner migration
  decision.

No Tina schema, content file, application source, or route changed in this
audit chunk. Sprint 8B is now the active decision and feasibility checkpoint.

## 2026-08-06 - Phase 2 simplification requirements recorded

Owner review identified the next set of problems after the visual and
information-architecture redesign:

- Homepage Portfolio tiles contain more repeated information than they need.
- Tina describes Homepage ordering as drag-and-drop even though the current
  control behaves like a choice list.
- The public Portfolio landing page is unnecessary. Video and Photography
  should remain direct Flexible Pages; Software/Ideation, Case Studies/Research,
  and Writing should resolve to Journal feeds or controlled tag archives.
- Tina contains redundant, obsolete, transitional, or confusing fields and
  collection entry points that require a consumer-level audit before removal.
- Content Entry authoring should become plain Markdown with live preview.
- image controls should accept public Immich or other direct URLs as well as
  repository-managed uploads.
- exported Markdown should be importable, validated, completed with required
  metadata, and published without rebuilding the body by hand.
- routine Tina saves should not deploy the site; an authenticated **Publish
  Site** action inside Tina should publish the completed editing session.
- Resume requires a separate redesign sprint.

Planning decision:

- Replace the former broad Sprint 8 cleanup with Sprints 8-14 covering audit,
  public Portfolio/Homepage simplification, Tina cleanup, deliberate publishing,
  Markdown-first authoring and import, Resume, and final migration/QA.
- Do not remove a field, collection, or compatibility route until Sprint 8 maps
  its stored data and every active consumer.
- Treat raw-Markdown editing and secure publish gating as feasibility gates;
  neither should be implemented by exposing repository or deploy credentials in
  browser code.

Repository state reviewed:

- `gpt-handoff` is the remote default and working branch.
- Sprint 7 navigation code and the corrected Tina lock are present.
- Later Tina-generated content commits confirm continuing hosted content saves.
- The pending Sprint 7 deployment and interaction checks remain open until an
  explicit owner verification is recorded.

## 2026-08-04 - Sprint 7 TinaCloud schema-lock correction

Corrected after the initial Sprint 7 deployment failed:

- Regenerated `tina/tina-lock.json` after the navigation schema change. The
  original Sprint 7 commit updated `tina/config.ts` but accidentally retained
  the Sprint 6 lock, so TinaCloud repeatedly indexed the older schema.
- Confirmed the regenerated lock includes the `SettingsNavigationPage` union
  used by internal navigation references.
- Confirmed Tina's generated GraphQL schema and TypeScript types contain the
  same navigation reference type.

Deployment recovery:

- Commit and push the regenerated Tina lock to `gpt-handoff`.
- Reindex `gpt-handoff` in TinaCloud after that commit is available remotely.
- Retry the newest Cloudflare deployment after TinaCloud finishes indexing.

## 2026-08-04 - Homepage Portfolio tile fallback corrected

Corrected after Sprint 7:

- Removed the duplicate centered entry-type label from image-free Homepage
  Portfolio tiles. The category is now rendered once with the title and
  description, independent of tile size.
- Replaced the redundant label with a decorative fallback surface consistent
  with the Portfolio landing-page cards.
- Confirmed the saved Homepage selection contains the four approved Portfolio
  paths: Video, Photography, Case Studies, and Software Projects. Writing
  Samples remains absent from the Homepage and primary navigation.

## 2026-08-04 - Sprint 7 navigation and information architecture implemented

Completed locally:

- Replaced the flat primary-navigation schema with a drag-reorderable Tina list
  supporting optional child links.
- Added Tina internal-page references for fixed, archive, Resume, and Flexible
  Pages while preserving custom site paths and explicit external URLs.
- Implemented a directly clickable Portfolio parent link with a separate,
  accessible submenu control for Video, Photography, Case Studies, and Software
  Projects.
- Kept Journal as a single primary-navigation destination. Latest, Automotive,
  Projects, Field Notes, and Off-topic remain local to the Journal archive.
- Removed About from the primary navigation while preserving `/about/`, the
  Homepage **More about Patrick** link, and the footer link.
- Corrected the primary Resume destination from `/` to `/resume/`.
- Removed Writing Samples from the Homepage category tiles and primary
  hierarchy. Published writing remains discoverable through Journal sections
  and tags; `/portfolio/writing-samples/` remains available as an unlinked
  compatibility route.
- Added desktop disclosure and mobile nested-menu behavior with independent
  parent links, touch-sized controls, Escape handling, outside-click closing,
  focus return, current-page state, and a no-JavaScript fallback.
- Added safe omission of missing or drafted internal page references.

Verified locally:

- Tina audits all 54 settings, page, Flexible Page, Tag, and Content Entry
  documents.
- Strict TypeScript checking, Astro component compilation, navigation-reference
  checks, and `git diff --check` pass.
- The saved primary order is Home, Portfolio, Journal, Resume, and Get in Touch;
  only Portfolio contains child links.
- The normal Astro build command is blocked by this workspace's network guard
  before Astro reports build diagnostics; Cloudflare remains the production
  build verification for this push.

Pending after push:

- Confirm Cloudflare builds and deploys the revised schema and navigation.
- Verify Tina drag ordering and internal-page selection in the hosted editor.
- Review desktop pointer/keyboard and phone touch behavior on the deployed site.

## 2026-08-04 - Sprint 6 compact Homepage implemented

Completed locally:

- Implemented the approved compact Homepage without changing the established
  typography or color system.
- Paired a reduced Hero with an independently editable Journal panel on desktop
  and a logical Hero-first stack on narrower screens.
- Added an explicit Tina reference for the Homepage Journal feature plus a
  compact chronological recent-story list that never duplicates the feature.
- Added safe newest-story fallback behavior when the selected feature is
  missing, drafted, or no longer placed in Journal.
- Added editable About Me, What I Do, Technology Stack, and Featured Portfolio
  sections with copy, links, visibility controls, and drag-reorderable block order.
- Migrated Featured Portfolio to the five published Portfolio category pages:
  Video, Photography, Case Studies, Writing Samples, and Software Projects.
- Preserved the standalone About page, every existing route, and the shared
  Portfolio reference model.
- Regenerated `tina/tina-lock.json` from Tina's generated schema artifacts.

Verified locally:

- Tina audits all 54 settings, page, Flexible Page, Tag, and Content Entry documents.
- Strict TypeScript checking and `git diff --check` pass.
- Astro builds all 58 existing routes.
- Generated Homepage HTML follows the stored five-block order, links to all five
  Portfolio categories, and renders the selected feature separately from three
  recent Journal stories.

Hosted verification:

- Cloudflare deployed the redesigned Homepage successfully.
- The owner reviewed and accepted the public Homepage design.
- Full cross-device, keyboard, and hosted Tina editing edge-case checks remain
  grouped with Sprint 8's final schema reindex and QA pass.

## 2026-08-04 - Sprint 5 controlled tags and subject archives implemented

Completed locally:

- Added a dedicated Tina **Tags** collection with stable slugs, editable public
  labels, optional archive descriptions, and previous-slug aliases.
- Migrated all 29 existing free-text tags into controlled tag documents and
  replaced seven tagged Content Entry lists with Tina references.
- Added 29 static `/tags/[slug]/` subject archives spanning published Journal,
  Portfolio, and dual-placement entries while excluding drafts.
- Added clickable tag chips to Journal cards, the featured story, and the
  bottom of Content Entry detail pages.
- Added canonical handling for alias routes and build-stopping validation for
  duplicate slugs, duplicate aliases, and references to missing tag documents.
- Kept Journal sections and descriptive tags as separate routing systems and
  preserved every existing `/archive/[slug]/` detail URL.
- Regenerated `tina/tina-lock.json` from Tina's generated schema artifacts.

Verified locally:

- Tina audits all 54 settings, page, Flexible Page, Tag, and Content Entry
  documents.
- Strict TypeScript checking and `git diff --check` pass.
- Astro builds 58 pages: the existing 29 routes plus all 29 tag archives.
- Generated Journal and entry HTML contains clickable tag URLs; Automotive
  and MBA archives contain their expected Journal and Portfolio entries.
- Duplicate canonical slugs, duplicate aliases, and orphaned tag references
  each produce an explicit validation failure.

Pending after push:

- Confirm Cloudflare deploys the 29 subject archives.
- Reindex TinaCloud and verify creating a tag, selecting it on an entry, and
  preserving an old slug through the alias field.

## 2026-08-04 - Sprint 4 Journal sections and landing page implemented

Completed locally:

- Implemented the approved compact editorial Journal design without changing
  the site's typography or color system.
- Added controlled Automotive, Projects, Field Notes, and Off-topic sections;
  Latest remains the complete landing feed rather than an assignable section.
- Added one conditionally required `journalSection` value to every published
  Journal entry and migrated all six current entries.
- Added static `/journal/[section]/` routes and replaced display-only topic
  chips with working section links.
- Added an explicit Tina reference for the featured Journal story. The selected
  feature is excluded from the remaining chronological landing feed.
- Preserved the legacy `primaryTopic`, `featured`, and archive-page `topics`
  values as documented compatibility fields during the staged migration.
- Preserved every existing `/archive/[slug]/` detail URL.
- Hid the browser scrollbar on the horizontal Journal section index while
  preserving touch, wheel, and trackpad scrolling on narrow screens.

Verified locally:

- Tina audits all 25 settings, page, Flexible Page, and Content Entry documents.
- Strict TypeScript checking passes.
- Astro generates 29 pages, including all four section routes and every
  existing archive detail URL.
- Generated Journal HTML includes every section link and includes the selected
  featured entry exactly once.
- The full TinaCloud build remains credential-gated as documented; no token was
  added to the repository.

Hosted verification:

- Cloudflare deployed the Journal landing and section routes; the owner
  accepted the layout and the scrollbar follow-up.
- Changing an entry section and featured-story selection in hosted Tina remains
  an owner verification item alongside the Sprint 5 schema reindex.

## 2026-08-04 - Sprint 3 Portfolio hierarchy and tile board implemented

Completed locally:

- Locked the public section name to **Portfolio** and retained `/portfolio/`
  as its canonical URL; navigation, footer, landing-page, Homepage, Tina, and
  planning labels no longer call the section Work.
- Added published Portfolio category pages for Video, Photography, Case
  Studies, Writing Samples, and Software Projects.
- Added ordered Tina tile lists to the Portfolio landing page and Homepage
  Featured Portfolio section. Each tile references an existing Content Entry
  or Flexible Page and may override size, emphasis, title, description, or
  image without changing the selected document.
- Added shared tile resolution that safely omits missing, drafted, or
  non-Portfolio sources. Removing a tile never deletes its source.
- Added Dense and Exact Order packing choices while retaining the existing
  bento sizing and numeric `portfolioOrder` fallback during migration.
- Regenerated `tina/tina-lock.json` from Tina's generated schema artifacts.

Verified locally:

- Tina audits all settings, page, Flexible Page, and Content Entry documents.
- Strict TypeScript checking passes.
- Astro generates 25 pages, including `/portfolio/`, all five Portfolio
  category routes, and every existing `/archive/[slug]/` URL.
- Generated Portfolio and Homepage HTML contain the explicit curated tiles.
- `git diff --check` passes.

Hosted verification:

- Cloudflare deployed all five Portfolio category routes successfully.
- The owner verified Tina tile removal and the public Portfolio tile layout.

## 2026-08-04 - Sprint 2B media and narrative video implemented

Completed locally:

- Added responsive, keyboard-accessible lightbox behavior to Flexible Page
  image blocks by sharing the existing narrative-image dialog.
- Hardened image, gallery, call-to-action, native-video, YouTube, and Vimeo
  values so incomplete or unsafe media does not break the route.
- Added an explicit Tina rich-text YouTube embed for Content Entries while
  keeping their bodies narrative-first rather than converting them to blocks.
- Migrated the nine Content Entry files from `.md` to Markdown-compatible
  `.mdx` without changing their existing narrative text or public slugs.
- Moved the Ferrari/IKEA proof video from end-of-entry media into the body as
  the first end-to-end rich-text embed example.
- Added the Astro 6-compatible `@astrojs/mdx` integration and regenerated the
  Tina schema lock.

Verified locally:

- Tina audits all 20 content documents, including all nine MDX entries.
- Strict TypeScript checking and `git diff --check` pass.
- Astro generates all 20 routes.
- The Ferrari/IKEA route renders a responsive privacy-enhanced
  `youtube-nocookie.com` iframe at the stored body position.
- Existing Content Entry filenames retain their stems, so every
  `/archive/[slug]/` URL remains unchanged.

Pending after push:

- Confirm Cloudflare and TinaCloud finish deploying the new MDX schema.
- Insert, move, edit, and remove a YouTube embed in hosted Tina.
- Verify image-block mouse, Enter/Space, Escape, and focus-return behavior on
  desktop and phone before closing Sprint 2.

## 2026-08-04 - Sprint 2A gallery density refined

- Limited the initial Immich gallery grid to four photos to keep page blocks
  compact.
- Added an accessible expand/collapse control that reveals the full grid and
  returns it to the four-photo preview.
- Preserved full-album lightbox navigation while the thumbnail grid is
  collapsed.
- Updated the content and maintenance guides with the shared gallery behavior.

## 2026-08-04 - Sprint 2A reorderable block foundation implemented

Completed locally:

- Added one ordered `blocks` list to Flexible Pages with Tina drag ordering.
- Added constrained templates for Markdown text, images, YouTube video, Immich
  galleries, selected child-page tiles, and calls to action.
- Added shared Astro validation and types in `src/lib/page-blocks.ts` plus a
  shared block renderer that resolves published Flexible Page tiles.
- Reused the existing responsive YouTube, Immich gallery, and button
  components while keeping block-specific presentation centralized.
- Preserved every existing Flexible Page Markdown body and rendered it after the
  ordered blocks; no content migration is required.
- Added all six block types to `/services/` as an end-to-end verification page.
- Recorded the decision to use a rich-text YouTube embed for Content Entries in
  Sprint 2B instead of converting entry bodies into page-builder blocks.
- Added `marked` as a direct dependency for portable Markdown text blocks and
  regenerated `tina/tina-lock.json`.

Verified locally:

- Tina indexes all six templates and regenerates its schema lock.
- Strict TypeScript checking and `git diff --check` pass.
- Astro generates all 20 current routes.
- The generated `/services/` HTML contains all six block types in stored order,
  followed by the original Markdown body.

Hosted verification completed before Sprint 2B:

- Cloudflare deployed the block schema and proof page.
- Hosted Tina add/remove/drag ordering and the refined four-image gallery
  preview were owner-verified.

## 2026-08-04 - Sprint 1B Flexible Page shell implemented

Completed locally:

- Added Flexible Page eyebrow, header image, header-image alt text,
  navigation label, and navigation order controls in Tina and Astro.
- Added safe defaults for new-page draft state, navigation order, missing
  optional presentation fields, and breadcrumb labels.
- Added generated breadcrumbs from published ancestor pages without changing
  the flat primary navigation.
- Finished the shared Flexible Page shell with responsive heading, spacing,
  body, and header-image behavior using the existing typography and colors.
- Added a custom static 404 page so missing, drafted, renamed, and deleted
  routes no longer fall back to the Homepage on Cloudflare.
- Regenerated `tina/tina-lock.json` and expanded the content and maintenance
  guides with create, nest, rename, draft, and delete workflows.

Verified locally:

- Tina local indexing and schema generation pass.
- Strict TypeScript checking passes.
- Astro generates 20 pages, including the 404 page and all four current
  Flexible Page routes.
- Existing About, Contact, Resume, Journal, Portfolio, and archive routes still
  generate.

Pending after push:

- Confirm the Cloudflare deployment and custom missing-page response.
- Reindex TinaCloud, then test create, rename, draft, and delete in the hosted
  editor before beginning Sprint 2.

## 2026-08-04 - Sprint 1A Flexible Page route proof implemented

Completed locally:

- Added a separate `flexiblePages` Astro collection and Tina **Flexible
  Pages** collection with document creation and deletion enabled.
- Added editable title, URL path, description, draft state, SEO title, SEO
  description, social image, and Markdown body fields.
- Added a guarded catch-all Astro route and minimal shared Flexible Page
  layout using the existing color, typography, width, and spacing system.
- Added build-time validation for invalid paths, reserved top-level routes,
  and duplicate published Flexible Page paths.
- Added published `/services/` and `/services/video-production/` proof pages.
- Regenerated the Tina schema lock.

Verified locally:

- Tina indexed the new collection successfully.
- Strict TypeScript checking passed.
- Astro built 17 static pages, including both proof URLs and all 15 baseline
  routes.
- The generated proof pages contain the expected canonical URLs and SEO
  metadata.
- `git diff --check` passed.

Pending:

- Push the implementation to `gpt-handoff` and confirm a successful
  Cloudflare preview before beginning Sprint 1B.

## 2026-08-03 - Documentation audit and cleanup completed

Completed:

- Consolidated active planning around `BUILD_ORDER.md` and `Roadmap.md`.
- Retired stale `NEXT_STEPS.md`, `Audit.md`, and `CHUNK_MANIFEST.md` files
  that duplicated or contradicted the current sprint plan.
- Refreshed the README, documentation index, maintenance guide, build order,
  roadmap, content guide, and repository agent instructions.
- Recorded documentation maintenance as part of every sprint's completion
  criteria.
- Corrected the local development instruction to use the Tina-aware
  `npm run dev` workflow.

Decisions:

- Preserve the site's existing typography and color choices during the
  redesign.
- Use the approved homepage mockup as the reference for layout, hierarchy,
  density, and spacing only.
- Sprint 1A remains the next application-code work; this cleanup changed
  documentation only.

## 2026-08-03 - Tina site-builder expansion roadmap approved

Planned:

- Expand Tina with creatable Flexible Pages and nested static URLs.
- Add a constrained, reorderable block system for text, images, YouTube,
  Immich galleries, child-page tiles, and calls to action.
- Replace numeric Portfolio ordering with a drag-reorderable Portfolio landing-page
  tile board that references permanent content without owning it.
- Add a required primary Journal section, working section routes, a selected
  featured story, and a compact editorial landing page.
- Add clickable tags and static tag archive pages while keeping sections and
  tags separate.
- Redesign the Homepage around a smaller hero, a side-by-side Journal preview,
  About Me, What I Do, Technology Stack, and selected Featured Portfolio.
- Add optional nested navigation after the dynamic page and archive routes are
  proven.
- Finish with migration, TinaCloud reindexing, route and accessibility QA, and
  owner documentation updates.

Decisions:

- The work is divided into eight independently verifiable sprints in
  `Roadmap.md`.
- Structured blocks are for flexible and landing pages; Journal and Portfolio entry
  bodies remain semantic and portable wherever possible.
- Permanent content stays separate from landing-page tile placement and
  presentation overrides.
- Existing public routes will be preserved or redirected before removal.
- No feature in this entry is marked complete; implementation begins with
  Sprint 1A in `BUILD_ORDER.md`.

## 2026-07-15 - Owner maintenance documentation added

Completed:

- Added `SITE_MAINTENANCE_GUIDE.md` as a repository-specific manual for making
  visual, component, page, Tina, content-schema, route, media, and dependency
  changes safely.
- Documented the required contract between Tina fields, Astro validation,
  Markdown frontmatter, renderers, and the generated Tina lock.
- Added safe recipes for optional fields, required fields, field removal,
  palette and typography changes, custom Tina controls, and package updates.
- Added verification guidance, common failure diagnosis, high-risk change
  warnings, and a final pre-push checklist.
- Linked the guide from the README and documentation index.

## 2026-07-15 - Architecture stabilization and Homepage editing refined

Completed:

- Confirmed the unified Content Entries migration, shared archive routes,
  Portfolio bento grid, Tina placement actions, and legacy cleanup in the
  deployed workflow.
- Fixed the custom Tina Placement field's hosted runtime error by importing the
  React runtime explicitly. Content Entries, including Photography Samples,
  can now be opened and edited in TinaCloud.
- Added editable **Section Title Link** fields to the Homepage Featured Portfolio and
  Journal Preview sections.
- Linked those Homepage headings to `/portfolio` and `/journal` by default
  while preserving direct links on the individual preview cards.
- Reviewed Journal topic navigation and documented that the current chips are
  display-only labels rather than functional filters.
- Identified static Astro topic routes derived from `primaryTopic` as the next
  recommended feature; no database backend is required.

Verified:

- Tina local schema indexing succeeds and regenerates `tina/tina-lock.json`.
- Strict TypeScript checking passes.
- Astro production build succeeds with 14 static pages.
- The Tina React runtime hotfix was verified in the hosted editor.

## 2026-07-15 - Unified Content Entries architecture completed

Completed:

- Replaced separate Journal and Portfolio storage schemas with one `entries`
  collection for articles, projects, galleries, and case studies.
- Added Tina placement actions for Portfolio only, Portfolio + Journal, and
  Archive to Journal; Journal placement clearly exposes the publication-date
  field used for chronological sorting.
- Moved all active content to `src/content/entries/`.
- Cut Homepage, Journal, and Portfolio queries over to the unified collection.
- Added stable neutral detail routes at `/archive/[slug]/` and one shared entry
  layout preserving inline lightboxes, media, video, Immich, links, and related
  content.
- Replaced the chronological Portfolio grid with a responsive bento layout
  controlled by manual order and tile size in Tina.
- Removed legacy collections, duplicate detail routes, layouts, related-content
  components, and duplicate Markdown files.

Verified:

- Astro production build succeeds with 14 static pages.
- `git diff --check` passes.
- Journal and Portfolio now present the same underlying entries differently
  without moving or converting content.

## 2026-07-14 - WordPress writing archive staged for review

Imported from the owner's WordPress.com content and media exports:

- Parsed 177 WordPress records, including 9 published posts and 128 media
  attachments.
- Converted all 9 published posts to portable Markdown drafts.
- Routed 5 editorial articles to Journal and 4 writing or strategy samples to
  Portfolio.
- Preserved original publication attribution, links, dates, headings, tables,
  captions, and article links where available.
- Copied the 65 WordPress-hosted media files referenced by the imported posts
  into `public/uploads/wordpress/`.
- Preserved externally hosted publisher images for review and documented every
  affected entry in `WORDPRESS_IMPORT_REVIEW.md`.
- Kept every imported entry at `draft: true` so nothing publishes before
  copyright, formatting, image, and collection-placement review.

Verified:

- Every referenced WordPress-hosted media file was found in the media export.
- Astro accepted all imported content and generated all 18 routes when the
  drafts were temporarily enabled in a test checkout.
- The delivered entries remain drafts.

## 2026-07-14 - Content publication phase opened

Decision:

- The site is ready to begin supporting a job search before every refinement
  milestone is complete.
- Real Resume, About, Contact, Portfolio, and Journal content is now the active
  priority.
- Remaining filters, print refinement, and design polish are non-blocking and
  should be driven by real published material.
- Journal and Portfolio bodies will remain semantic Markdown for redesign and
  migration safety.
- Structured or flexible Tina blocks should be concentrated on the small set
  of landing pages instead of becoming the default article format.
- Important cover and narrative images should remain locally owned; Immich is
  the expanded gallery layer rather than the only durable project media.

Documentation refreshed:

- README and active workflow
- next steps and build order
- roadmap and repository audit
- editable content guidance
- new content portability and redesign recommendations

## 2026-07-14 - Immich gallery presentation refined

Completed:

- Replaced low-resolution grid thumbnails with higher-quality Immich previews.
- Removed the forced 4:3 crop so images retain their original proportions.
- Replaced narrow auto-fit tiles with a balanced two-column layout and a
  single-column layout on narrow phones.
- Applied the shared component refinement to both Journal and Portfolio
  galleries.

Verified:

- Astro generated all nine static pages.
- `git diff --check` passed.

## 2026-07-14 - Immich galleries connected

Completed:

- Added an optional Immich Gallery group to Journal Entries and Portfolio
  Projects in Tina.
- Connected public `share.angrysquirrel.org` albums without an API key.
- Added a live client-side gallery so album changes appear without rebuilding
  the Astro site.
- Added lazy thumbnails, an accessible native dialog lightbox, previous/next
  controls, arrow-key navigation, Escape-to-close, and outside-click closing.
- Added loading, empty, no-JavaScript, and unavailable-service fallbacks.
- Connected the supplied 11-image public album to the placeholder Journal entry
  and Portfolio project for end-to-end verification.

Verified:

- Public share proxy responds successfully and exposes 11 image assets.
- Astro production build generates all nine pages.
- TinaCMS starts and regenerates the schema lock successfully.
- `git diff --check` passes.

## 2026-07-14 - TinaCloud connection completed

Completed:

- Added Cloudflare environment variables for the Tina client, token, and
  `gpt-handoff` branch.
- Made `gpt-handoff` the repository default branch so TinaCloud can load the
  existing schema.
- Reindexed the Tina schema and verified all seven collections.
- Verified authenticated production editing at `https://angrysquirrel.org/admin/`.

## 2026-07-14 - TinaCloud connection started

Changed:

- Reversed the earlier local-only Tina decision at the owner's request.
- Restored the production build to `tinacms build && astro build`.
- Added an Astro-only diagnostic build as `npm run build:astro`.
- Added a safe environment-variable template with the TinaCloud Client ID and
  `gpt-handoff` branch.
- Updated the active workflow documentation for a hosted `/admin/`.

Pending:

- Add `TINA_PUBLIC_CLIENT_ID`, `TINA_TOKEN`, and `GITHUB_BRANCH` to Cloudflare
  Pages for Preview and Production.
- Deploy and verify authenticated editing at `/admin/`.
- Connect a public Immich shared album to the native gallery/lightbox.

## 2026-07-11 - Milestone 5 accessibility and shared shell completed

Completed:

- Added a skip-to-content link and global visible keyboard-focus styles.
- Added current-page state to primary navigation, including detail routes.
- Added reduced-motion handling.
- Replaced wrapping mobile navigation with a compact accessible menu.
- Added Escape-to-close, outside-click handling, focus return, and 44px mobile targets.
- Preserved navigation access when JavaScript is unavailable.
- Explicitly linked the existing SVG and ICO favicons.
- Added the production site URL and canonical URLs.
- Added shared Open Graph and Twitter card metadata with optional content images.
- Verified descriptions flow through Homepage, archive, standard, Journal, and Portfolio layouts.
- Raised the steel-blue accent from `#4682B4` to `#4F91C7` so normal accent text passes on both primary and surface backgrounds.

Verified:

- User approved Chunks 4A and 4B and pushed both to `gpt-handoff`.
- Cloudflare Pages deployment succeeds from `gpt-handoff` without TinaCloud.
- Primary text contrast is 16.72:1 on the main background.
- Secondary text contrast is 8.41:1 on the main background.
- Updated accent contrast is 5.45:1 on the main background and 4.90:1 on charcoal surfaces.
- Production build generates nine static pages.
- `git diff --check` passes.

Next:

- Begin Milestone 6 page and component completion.

## 2026-07-11 - Functional component recovery completed

Completed:

- Restored portfolio Image, VideoPlayer, Gallery, Lightbox, and VideoEmbed components.
- Connected Tina project media to Portfolio detail pages.
- Added automatic lightbox behavior to images inserted inside project narrative content.
- Added automatic related Journal entries and Portfolio projects.
- Added a dedicated structured Resume collection with summary, competencies, experience, and education.
- Added responsive and print-aware Resume components.
- Removed the final unused zero-byte SearchBox and generic layout placeholders.
- Reconciled project documentation around the verified current state.

Verified:

- TinaCMS starts locally after all schema changes.
- Astro generates nine static pages.
- `git diff --check` passes.
- No zero-byte files remain under `src/`.

Deferred:

- Inline narrative video blocks
- Immich album integration
- Pagefind search
- Resume PDF generation

Next:

- Commit and push the approved checkpoint in VS Code.
- Confirm Cloudflare deployment.
- Begin accessibility Chunk 4A.

## 2026-07-10 — Subscription-free Tina workflow selected

Decision:

- TinaCloud will not be used.
- TinaCMS remains a local editing interface.
- Markdown remains the source of truth in GitHub.
- Cloudflare Pages will rebuild the static Astro site after repository pushes.
- The deployed site will not expose a hosted CMS editing interface.

Final editing workflow:

```text
Pull latest branch
→ run local Tina
→ edit Markdown through localhost/admin
→ run production build
→ commit and push
→ Cloudflare rebuilds
```

Multi-machine use:

- clone the same repository on each machine
- check out `gpt-handoff`
- pull before editing
- install dependencies
- run `npm run dev`
- commit and push through VS Code Source Control

Cloudflare diagnosis:

- Cloudflare correctly detects pushes to `gpt-handoff`.
- The deployment failure was reproduced locally.
- `npm run build` currently invokes `tinacms build && astro build`.
- `tinacms build` requires TinaCloud `clientId` and `token`.
- The production build must therefore be changed to `astro build` for the local-only Tina architecture.
- Cloudflare should use `NODE_VERSION=22.22.0`.

Next required repository changes:

- change the production build script to `astro build`
- raise the Node engine minimum to `22.22.0`
- remove unused `@astrojs/cloudflare`
- regenerate the lockfile
- clean Tina initializer demo files
- verify a complete local build
- push and confirm a successful Cloudflare deployment

## 2026-07-10 — TinaCMS local integration running

Changed:

- Initialized TinaCMS in the existing Astro project.
- Installed `tinacms`, `@tinacms/cli`, and `@tinacms/astro`.
- Moved the project from Astro 7 to Astro 6.4.6 because the current Tina Astro integration supports Astro 5 and 6.
- Preserved static Astro output instead of adopting the Node SSR configuration created by the Tina initializer.
- Removed the active `@astrojs/node` import and Node adapter from `astro.config.mjs`.
- Added Tina's Astro integration and local admin redirect.
- Added a Vite watcher exclusion for Visual Studio's `.vs` directory to prevent Windows `EBUSY` crashes.
- Added Node type definitions for the Tina TypeScript configuration.
- Created `tina/config.ts` and mapped the existing content structure into Tina.
- Split the broad page editor into separate CMS collections:
  - Homepage
  - Archive Pages
  - Standard Pages
- Retained separate collections for Site Settings, Journal Entries, and Portfolio Projects.

Verified:

- Tina's local GraphQL server starts successfully.
- Tina generates its local client and TypeScript files.
- The CMS loads at `/admin/index.html`.
- Editing the nested homepage hero eyebrow updates `src/content/pages/home.md`.
- Astro immediately renders the edited value on the homepage.

## 2026-07-10 — Site-wide content moved out of templates

Changed:

- Added a `settings` content collection and `src/content/settings/site.md`.
- Added managed page entries under `src/content/pages/`.
- Replaced hard-coded homepage preview data with collection queries.
- Added shared standard-page rendering for About, Resume, and Contact.
- Updated Navigation, Footer, BaseLayout, Hero, and FeaturedArticle to consume managed content.
- Added `CONTENT_GUIDE.md`.

Verified:

- All expected static routes generated.
- Page content and site settings are no longer embedded directly in Astro templates.
- Homepage, Journal, Portfolio, About, Resume, and Contact render from managed Markdown.
- Internal links and optional-image fallbacks were verified.

## 2026-07-10 — Functional content core completed

Completed:

- Journal and Portfolio detail routing
- Journal and Portfolio content schemas
- Journal and Portfolio detail layouts
- linked archive pages
- collection-driven homepage
- editable supporting page shells
- warning-free eight-page static build

The project then moved from functional content architecture into TinaCMS integration.
