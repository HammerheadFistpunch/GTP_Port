# Deliberate Publishing Guide

Tina saves content changes to `gpt-handoff` immediately, but the public site rebuilds only when the editing session is complete. The **Settings → Publish Site** screen compares the latest saved commit with the commit embedded in the live build and triggers Cloudflare through a protected server relay.

**Current rollout status:** deliberate-only production publishing is active. Automatic production branch deployments are disabled. Ordinary Tina saves commit content to `gpt-handoff` without rebuilding production; **Publish Site** is the intended production trigger.

## Security model

- `/admin/` and `/admin/api/publish` are covered by the same Cloudflare Access self-hosted application.
- The Pages Function validates Access's signed JWT and separately requires the configured owner email.
- `CLOUDFLARE_DEPLOY_HOOK_URL` is an encrypted Pages secret available only to the Function. It is never returned to the browser.
- `PUBLISH_STATE` is a KV binding used for a 15-minute duplicate-request lock.
- The latest `gpt-handoff` SHA is read from GitHub's public API; no GitHub token is stored in Cloudflare or Tina for this workflow.
- `/deployment.json` contains only the public branch, commit SHA, and build time. It is deliberately uncached so the editor can detect a completed build.

## Cloudflare configuration

Production runtime values:

| Name | Type | Purpose |
| --- | --- | --- |
| `CLOUDFLARE_ACCESS_DOMAIN` | Variable | Cloudflare Access team domain |
| `CLOUDFLARE_ACCESS_AUD` | Variable | Access application audience |
| `PUBLISH_ALLOWED_EMAIL` | Variable | Exact identity allowed to publish |
| `PUBLISH_GITHUB_REPOSITORY` | Variable | `HammerheadFistpunch/GTP_Port` |
| `PUBLISH_GITHUB_BRANCH` | Variable | `gpt-handoff` |
| `CLOUDFLARE_DEPLOY_HOOK_URL` | Encrypted secret | Deploy hook used only by the server relay |
| `PUBLISH_STATE` | KV binding | Duplicate-publish lock state |

Automatic production branch deployments must remain disabled. If they are re-enabled, routine Tina saves will once again trigger production builds and defeat the deliberate-publishing workflow.

## Normal owner workflow

1. Edit and save as many Tina documents as needed.
2. Leave entries/pages in Draft until they should be included in the next release.
3. When the editing session is complete, open **Settings → Publish Site**.
4. If Saved and Live match, there is nothing to publish.
5. If saved changes are pending, choose **Publish Site** once.
6. Keep the screen open or return later and use **Check status**.
7. Review the deployed pages after the screen reports that the saved commit is live.

## Verifying deliberate-only behavior

After changing Cloudflare build settings or the publish Function:

1. Save one harmless Tina edit.
2. Confirm GitHub receives the commit.
3. Confirm Cloudflare does **not** start a production build automatically.
4. Open **Publish Site** and confirm Saved and Live differ.
5. Publish once.
6. Confirm Cloudflare builds and the screen eventually reports the saved commit as live.

## Failure and recovery

A failed build does not replace the working public deployment. The publish screen keeps the target commit visible and prevents duplicate requests for up to 15 minutes.

1. Open the failed deployment in Cloudflare and read the first useful build error.
2. Fix the content or source problem and save/push the correction to `gpt-handoff`.
3. Wait for the publish lock to expire if the prior build never reached the live commit. Use **Check status** to refresh the screen.
4. Publish again. The new request targets the latest branch commit, not the failed one.
5. If the endpoint reports a configuration or authentication failure, verify the Access application, exact allowed email, KV binding, and encrypted deploy-hook secret.

If the hook URL may have leaked, delete it in Cloudflare immediately, create a new hook, replace the encrypted secret, and deploy the corrected configuration before publishing again.

## Periodic security checks

The endpoint implementation is designed to reject unauthenticated and wrong-identity requests. Sprint 14 did not re-run those negative tests during final closeout, so repeat them whenever Access policy, allowed identity, or Function authentication code changes.
