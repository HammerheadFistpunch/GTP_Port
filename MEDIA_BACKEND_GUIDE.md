# Immich-to-R2 Media Backend Guide

Sprint 16 adds a protected Cloudflare Pages Functions service that lets the Tina editor browse private Immich images and publish durable website copies to Cloudflare R2. Sprint 17 will add the Tina picker and connect image fields to these endpoints.

## Hosted acceptance record (2026-08-09)

Sprint 16 is complete and owner-accepted.

Passed:

- authenticated status returned HTTP 200 with `configured: true`
- asset browsing returned an Immich image and its protected preview displayed
- first publication returned HTTP 201 with `thumbnail` and `web` variants
  on `media.angrysquirrel.org`
- the public `web` image loaded in an incognito session without admin access
- repeat publication returned HTTP 200 and `reused: true` for both variants
  with unchanged URLs and sizes
- the uncached public R2 image remained available while only the Immich
  `cloudflared` service was stopped
- after restarting `cloudflared`, Immich browsing recovered with HTTP 200

Verified asset:

- Immich asset ID: `9df7eba8-7414-473c-8adb-cbb4c375bcdc`
- thumbnail: WebP, 13,452 bytes
- web: JPEG, 356,635 bytes

## Architecture

```text
Authenticated /admin editor
→ Access-protected Pages Functions
→ private Immich API through Cloudflare Tunnel
→ thumbnail + preview variants copied once to R2
→ public delivery from media.angrysquirrel.org
```

Immich remains the source library. R2 is the public website-media store. Website visitors never call these admin endpoints and never need the Immich host, API key, Access service token, or home origin.

## Why the variants come from Immich

Cloudflare's current raw-byte Images binding requires an Images Paid subscription. To keep the workflow free, the backend stores the `thumbnail` and `preview` variants that Immich already generates. The public names are:

- `thumbnail` — editor/card-sized copy
- `web` — Immich's larger preview for normal page display

Control their dimensions and quality in Immich's image settings. The backend does not copy original files or require original-download permission.

## Protected endpoints

All endpoints are under `/admin/api/media/` and inherit Cloudflare Access plus exact-owner email checks.

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/admin/api/media` | GET | Confirm server-side configuration without revealing secrets |
| `/admin/api/media/albums` | GET | List albums available to the API-key owner |
| `/admin/api/media/assets` | GET | Browse, search, filter by date, or browse an album |
| `/admin/api/media/preview/:assetId` | GET | Proxy a private editor thumbnail; response is never publicly cached |
| `/admin/api/media/publish` | POST | Copy deterministic `thumbnail` and `web` variants to R2 |

Asset browsing supports these query parameters:

- `page` and `size` (`size` is capped at 60)
- `q` for a search phrase
- `search=smart` or `search=filename`
- `albumId`
- `takenAfter` and `takenBefore`

Publishing accepts JSON such as:

```json
{ "assetId": "11111111-1111-4111-8111-111111111111" }
```

The returned record contains editor-safe asset information, source identity, and permanent R2 URLs. It never returns private paths, GPS fields, the Immich hostname, or credentials.

## One-time Immich setup

1. In Immich, open **Account Settings → API Keys**.
2. Create a key named `AngrySquirrel website media`.
3. Grant only `asset.read`, `asset.view`, and `album.read`.
4. Copy the key once and store it as the Cloudflare secret `IMMICH_API_KEY`.

The key is read-only. Do not grant upload, update, delete, shared-link, user, or administration permissions.

### Recommended private origin route

Use a dedicated hostname such as `immich-origin.angrysquirrel.org` rather than the visitor-facing gallery hostname.

1. Add the hostname to the existing Cloudflare Tunnel and route it to the internal Immich service.
2. Create a Cloudflare Access self-hosted application for that hostname.
3. Create an Access service token named `AngrySquirrel media backend`.
4. Add a **Service Auth** policy that allows only that service token.
5. Store the token values as `IMMICH_ACCESS_CLIENT_ID` and `IMMICH_ACCESS_CLIENT_SECRET` encrypted secrets on the Pages project.
6. Store `https://immich-origin.angrysquirrel.org` as the encrypted secret `IMMICH_BASE_URL`.

The backend adds the service-token headers only to the configured Immich origin. Both service-token values must be set together. They may be omitted only if the configured Immich hostname does not use Cloudflare Access.

Cloudflare Tunnel is outbound-only, so this route does not require a public inbound port or expose the residential IP. This route is for server-to-server media publication; Sprint 18 separately revisits the live gallery hostname.

## One-time R2 setup

1. In Cloudflare R2, create a bucket named `angrysquirrel-media`.
2. In the bucket's **Settings → Custom Domains**, connect `media.angrysquirrel.org`.
3. Wait for the custom domain to become Active.
4. Keep the development `r2.dev` URL disabled so there is only one intended public origin.
5. In the `gtp-port` Pages project, add an R2 binding named `MEDIA_BUCKET` pointing to `angrysquirrel-media`.
6. Add `MEDIA_PUBLIC_BASE_URL=https://media.angrysquirrel.org` as a normal production variable.
7. Add `MEDIA_ALLOWED_EMAIL` as the exact owner email, or omit it to reuse `PUBLISH_ALLOWED_EMAIL`.

The application writes immutable, revisioned object keys under:

```text
immich/<asset-id>/<source-revision>/<variant-version>/thumbnail
immich/<asset-id>/<source-revision>/<variant-version>/web
```

Selecting the same unchanged asset again performs R2 `HEAD` checks and reuses both existing objects. A changed Immich checksum creates a new revisioned URL rather than overwriting a cached object.

The object URLs are extensionless. R2 already removes home-origin traffic; for extra edge caching, add a Cache Rule for hostname `media.angrysquirrel.org` with cache eligibility set to **Eligible for cache**. The stored objects also carry `public, max-age=31536000, immutable`.

## Pages runtime values

| Name | Type | Required | Purpose |
| --- | --- | ---: | --- |
| `MEDIA_BUCKET` | R2 binding | Yes | Durable website media store |
| `MEDIA_PUBLIC_BASE_URL` | Variable | Yes | Public custom-domain prefix |
| `MEDIA_VARIANT_VERSION` | Variable | Optional | Publication recipe version; defaults to `v1` |
| `IMMICH_BASE_URL` | Encrypted secret | Yes | Private HTTPS Immich origin |
| `IMMICH_API_KEY` | Encrypted secret | Yes | Read-only Immich API credential |
| `IMMICH_ACCESS_CLIENT_ID` | Encrypted secret | Recommended | Cloudflare Access machine identity |
| `IMMICH_ACCESS_CLIENT_SECRET` | Encrypted secret | Recommended | Cloudflare Access machine secret |
| `MEDIA_ALLOWED_EMAIL` | Variable | Optional | Exact editor identity; falls back to `PUBLISH_ALLOWED_EMAIL` |
| `CLOUDFLARE_ACCESS_DOMAIN` | Variable | Yes | Existing admin Access team domain |
| `CLOUDFLARE_ACCESS_AUD` | Variable | Yes | Existing admin Access audience |

This repository intentionally does not add a partial `wrangler` configuration. The production Pages project already uses dashboard-managed bindings, and adopting a Wrangler configuration would make that file the complete configuration source of truth. If configuration-as-code is adopted later, first download and review the entire existing Pages configuration.

## Activation and verification

The procedure below passed hosted owner acceptance on 2026-08-09. Re-run it after rotating credentials, changing bindings/hostnames, changing the variant recipe, or materially changing the media backend.

After the R2 binding, variables, secrets, Tunnel hostname, and Access policy are set, deliberately publish the latest `gpt-handoff` commit.

While signed into `/admin/`, run this in the browser console:

```js
const status = await fetch('/admin/api/media').then((response) => response.json());
const browse = await fetch('/admin/api/media/assets?size=1').then((response) => response.json());
const published = await fetch('/admin/api/media/publish', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ assetId: browse.items[0].id }),
}).then((response) => response.json());

console.log({ status, browse, published });
```

Verify:

1. `status.configured` is `true`.
2. Browse returns an image with an `/admin/api/media/preview/...` URL.
3. Publish returns both `thumbnail` and `web` URLs on `media.angrysquirrel.org`.
4. Repeating the publish returns `reused: true` for both variants.
5. Open the `web` URL in a private window; it must load without an admin session.
6. Stop Immich or the private Tunnel route temporarily, then reload the R2 URL with browser cache disabled. It must still load.
7. Restore Immich/Tunnel and confirm `/admin/api/media/assets?size=1` works again.

Do not stop Immich until at least one asset has been published successfully. The final offline check proves the public object no longer depends on the home server.

## Retention and recovery

- Do not automatically delete old R2 revisions. Content may still reference them.
- If Immich preview dimensions/quality change, increment `MEDIA_VARIANT_VERSION` (for example, from `v1` to `v2`) so newly selected assets receive new immutable URLs.
- Remove an old revision only after searching the repository and confirming no page uses its URL.
- Rotating the Immich API key or Access service token requires replacing the matching Cloudflare secrets and deploying again.
- If a credential may have leaked, revoke it at Immich or Cloudflare first, then replace the secret.
- If publishing partially fails, retry the same asset. Existing variants are reused and only missing variants are written.
