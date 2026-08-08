import cloudflareAccessPlugin from "@cloudflare/pages-plugin-cloudflare-access";

const json = (body, status) => Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
});

const authenticate = async (context) => {
    const domain = context.env.CLOUDFLARE_ACCESS_DOMAIN;
    const audience = context.env.CLOUDFLARE_ACCESS_AUD;
    if (!domain || !audience) {
        return json({ error: "Cloudflare Access is not configured for media management." }, 503);
    }

    return cloudflareAccessPlugin({ domain, aud: audience })(context);
};

const authorizeOwner = async (context) => {
    const allowedEmail = (context.env.MEDIA_ALLOWED_EMAIL || context.env.PUBLISH_ALLOWED_EMAIL || "")
        .trim()
        .toLowerCase();
    const email = context.data.cloudflareAccess?.JWT?.payload?.email?.toLowerCase();

    if (!allowedEmail || email !== allowedEmail) {
        return json({ error: "This identity is not allowed to manage website media." }, 403);
    }

    if (!["GET", "HEAD", "OPTIONS"].includes(context.request.method)) {
        const origin = context.request.headers.get("origin");
        if (origin && origin !== new URL(context.request.url).origin) {
            return json({ error: "Cross-origin media changes are not allowed." }, 403);
        }
    }

    return context.next();
};

export const onRequest = [authenticate, authorizeOwner];
