# Deliberate Publishing Guide

Tina saves content changes to `gpt-handoff` immediately, but the public site
should rebuild only when the editing session is complete. The **Site → Publish
Site** screen compares the latest saved commit with the commit embedded in the
live build and triggers Cloudflare through a protected server relay.

## Security model

- `/admin/` and `/admin/api/publish` are covered by the same Cloudflare Access
  self-hosted application.
- The Pages Function validates Access's signed JWT and separately requires the
  configured owner email.
- `CLOUDFLARE_DEPLOY_HOOK_URL` is an encrypted Pages secret available only to
  the Function. It is never returned to the browser.
- `PUBLISH_STATE` is a KV binding used for a 15-minute duplicate-request lock.
- The latest `gpt-handoff` SHA is read from GitHub's public API; no GitHub token
  is stored in Cloudflare or Tina for this workflow.
- `/deployment.json` contains only the public branch, commit SHA, and build
  time. It is deliberately uncached so the editor can detect a completed build.

## One-time Cloudflare setup

Keep automatic production deployments enabled throughout these setup steps.

1. Deploy the Sprint 11 repository commit normally.
2. In **Zero Trust → Access controls → Applications**, create a self-hosted
   application for `angrysquirrel.org/admin/*`.
3. Add an Allow policy containing only the identity Pat uses for Tina. Record
   the application audience (`AUD`) and Cloudflare Access team domain.
4. In the Pages project, add these production runtime values:

   | Name | Type | Value |
   | --- | --- | --- |
   | `CLOUDFLARE_ACCESS_DOMAIN` | Variable | Full `https://…cloudflareaccess.com` team domain |
   | `CLOUDFLARE_ACCESS_AUD` | Variable | Access application audience |
   | `PUBLISH_ALLOWED_EMAIL` | Variable | Exact email claim allowed to publish |
   | `PUBLISH_GITHUB_REPOSITORY` | Variable | `HammerheadFistpunch/GTP_Port` |
   | `PUBLISH_GITHUB_BRANCH` | Variable | `gpt-handoff` |

5. Create a Workers KV namespace for publish state and bind it to the Pages
   Function as `PUBLISH_STATE` in Production.
6. In **Pages → Settings → Builds**, create a deploy hook named `Tina Publish
   Site` for branch `gpt-handoff`.
7. Store that complete URL as the encrypted Pages secret
   `CLOUDFLARE_DEPLOY_HOOK_URL`. Never paste it into Tina, source code, an issue,
   a screenshot, or a public-prefixed environment variable.
8. Redeploy once so the Function receives the new bindings and values.
9. Open `/admin/`, complete Cloudflare Access and Tina authentication, then open
   **Site → Publish Site**. The screen should report the saved and live short
   commit IDs without a configuration error.

Cloudflare documents the required pieces in its guides for [Access JWT
validation](https://developers.cloudflare.com/pages/functions/plugins/cloudflare-access/),
[Pages secrets and KV bindings](https://developers.cloudflare.com/pages/functions/bindings/),
and [deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/).

## Safe automatic-build cutoff

1. Trigger the new deploy hook once while automatic builds are still enabled.
2. Confirm the hook-created deployment succeeds and serves the expected commit.
3. In **Pages → Settings → Builds & deployments → Configure Production
   deployments**, clear **Enable automatic production branch deployments** and
   save.
4. Make and save one harmless Tina content edit.
5. Confirm GitHub receives the commit and Cloudflare does not start a build.
6. Open **Site → Publish Site**. It should show different Saved and Live commit
   IDs and enable the button.
7. Choose **Publish Site** once. The old public deployment remains active while
   Cloudflare builds.
8. Wait for Tina to report that the latest saved changes are live, then verify
   the affected public page directly.

Cloudflare's [production branch controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
are the switch that prevents routine Tina commits from rebuilding the site.

## Normal owner workflow

1. Edit and save as many Tina documents as needed.
2. Leave drafts enabled until an item should be included in the next release.
3. When the session is complete, open **Site → Publish Site**.
4. If Saved and Live match, there is nothing to publish.
5. If saved changes are pending, choose **Publish Site** once.
6. Keep the screen open or return later and use **Check status**.
7. Review the deployed pages after the screen reports that the saved commit is
   live.

## Failure and recovery

A failed build does not replace the working public deployment. The publish
screen keeps the target commit visible and prevents duplicate requests for up
to 15 minutes.

1. Open the failed deployment in Cloudflare and read the first useful build
   error.
2. Fix the content or source problem and save/push the correction to
   `gpt-handoff`.
3. Wait for the publish lock to expire if the prior build never reached the
   live commit. Use **Check status** to refresh the screen.
4. Publish again. The new request always targets the latest branch commit, not
   the failed one.
5. If the endpoint reports a configuration or authentication failure, keep
   automatic builds unchanged and verify the Access application, exact allowed
   email, KV binding, and encrypted deploy-hook secret.

If the hook URL may have leaked, delete it in Cloudflare immediately, create a
new hook, replace the encrypted secret, and redeploy before publishing again.
